/**
 * Posts live in the top-level posts/ folder, one folder per post:
 *
 *   posts/2026-07-01 Sine of a Great Serve/
 *     chart.png          ← any number of images; shown in filename order
 *     post.txt           ← plain text (see posts/_example/post.txt)
 *
 * Text file layout:
 *   line 1            title
 *   next paragraph    summary (shown under the thumbnail and in Google)
 *   the rest          the writing (Markdown works: **bold**, [links](…), ## headings)
 *   optional lines at the very end, e.g.  Tags: Serve, Sinner
 *
 * Folders starting with _ are ignored.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { marked } from 'marked';
import path from 'node:path';
import { autoTags, canonical, tidy } from './tags';

export interface PostImage {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  /** Path on disk, for generating social cards */
  file: string;
}
export interface PostVideo {
  url: string;
  name: string;
  file: string;
  mime: string;
}
export type MediaItem = { kind: 'image'; name: string; image: PostImage } | { kind: 'video'; name: string; video: PostVideo };
/** What a post page renders, in order: media blocks and text blocks. */
export type Block = { type: 'media'; item: MediaItem } | { type: 'text'; html: string };

export interface Post {
  id: string;
  folder: string;
  body: string;
  html: string;
  blocks: Block[];
  data: {
    title: string;
    description: string;
    /** Show the summary under the title (false when a "Summary:" line moves it into the writing). */
    dek: boolean;
    date: Date;
    tags: string[];
    /** Images only, in filename order. The first is the thumbnail and social card. */
    images: PostImage[];
    videos: PostVideo[];
    autoplay: boolean;
    sample?: string;
    kind: 'note' | 'essay';
    featured: boolean;
    selected: boolean;
    source?: { url: string };
  };
}

const texts = import.meta.glob('/posts/*/*.{txt,md,TXT,MD}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const images = import.meta.glob('/posts/*/*.{png,jpg,jpeg,webp,avif,gif,PNG,JPG,JPEG,WEBP,AVIF,GIF}', { import: 'default', eager: true }) as Record<string, ImageMetadata>;
const videos = import.meta.glob('/posts/*/*.{mp4,webm,mov,m4v,MP4,WEBM,MOV,M4V}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const MIME: Record<string, string> = { mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' };

const SETTINGS = /^(summary|tags?|topics?|data|alt(?:\s*\d+)?|caption(?:\s*\d+)?|hide|hidden|pin|pinned|type|date|x|link|autoplay|auto\s*tags)\s*:\s*(.*)$/i;
const yes = (v = '') => /^(y|yes|true|1)$/i.test(v.trim());

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/\+\s?1\b/g, ' plus one ').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'post';

function parse(folder: string, raw: string, imgs: [string, ImageMetadata][], vids: [string, string][]): Post {
  const lines = raw.replace(/\r\n?/g, '\n').replace(/^﻿/, '').trimEnd().split('\n');

  // Settings: "Key: value" lines at the end of the file.
  const settings: Record<string, string> = {};
  while (lines.length) {
    const last = lines[lines.length - 1].trim();
    const m = last.match(SETTINGS);
    if (last === '') lines.pop();
    else if (m) { settings[m[1].toLowerCase().replace(/\s+/g, '')] = m[2].trim(); lines.pop(); }
    else break;
  }

  const paras = lines.join('\n').trim().split(/\n\s*\n/);
  const title = (paras.shift() ?? folder).replace(/^#+\s*/, '').replace(/\n/g, ' ').trim();
  // A "Summary:" line sets the home-page/Google summary separately, and the
  // writing then starts straight after the title (nothing shown under it).
  const dek = !settings.summary;
  const summary = dek ? (paras.shift() ?? '').trim() : settings.summary;
  const body = paras.join('\n\n').trim();

  const dateStr = settings.date || folder.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  const date = dateStr ? new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00Z' : '')) : new Date();
  if (!dateStr || isNaN(date.valueOf())) console.warn(`[serveplusone] "${folder}" has no date. Start the folder name with one, e.g. "2026-10-20 ${title}".`);

  const name = folder.replace(/^\d{4}-\d{2}-\d{2}\s*[-_ ]?\s*/, '') || title;
  const plainSummary = summary.replace(/[*_`#>]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const manual = (settings.tags ?? settings.tag ?? settings.topics ?? settings.topic ?? '').split(',').map((t) => t.trim()).filter(Boolean);
  // "-Tag" on the Tags line removes a tag the automatic tagger added.
  const remove = new Set(manual.filter((t) => t.startsWith('-')).map((t) => canonical(t.slice(1).trim())));
  const kept = manual.filter((t) => !t.startsWith('-')).map(canonical);
  const alts = Object.entries(settings).filter(([k]) => /^(alt|caption)\d*$/.test(k)).map(([, v]) => v).join('\n');
  const auto = settings.autotags && !yes(settings.autotags)
    ? []
    : autoTags({
        headline: [title, summary, kept.join(', ')].join('\n'),
        everything: [title, summary, body, alts, settings.data ?? ''].join('\n'),
        story: [title, summary, body].join('\n'),
      });
  const tags = tidy([...new Set([...kept, ...auto])]).filter((t) => !remove.has(t));
  const link = settings.x ?? settings.link;

  const postImages: PostImage[] = imgs.map(([file, src], i) => ({
    src,
    file: path.join(process.cwd(), file),
    alt: settings[`alt${i + 1}`] ?? (i === 0 ? settings.alt : undefined) ?? `${title}: ${plainSummary || 'chart'}`,
    caption: settings[`caption${i + 1}`] ?? (i === 0 ? settings.caption : undefined),
  }));
  const postVideos: PostVideo[] = vids.map(([file, url]) => ({
    url,
    file: path.join(process.cwd(), file),
    name: path.basename(file),
    mime: MIME[path.extname(file).slice(1).toLowerCase()] ?? 'video/mp4',
  }));

  // Every media file in filename order. A line in the writing that is just a
  // filename ("2.png", "rally.mp4") places that file there; the rest go first.
  const media: MediaItem[] = [
    ...imgs.map(([file], i) => ({ kind: 'image' as const, name: path.basename(file), image: postImages[i] })),
    ...postVideos.map((v) => ({ kind: 'video' as const, name: v.name, video: v })),
  ].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const byName = new Map(media.map((m) => [m.name.toLowerCase(), m]));
  const placed = new Set<MediaItem>();
  const textBlocks: Block[] = [];
  let buf: string[] = [];
  const flush = () => {
    const t = buf.join('\n').trim();
    if (t) textBlocks.push({ type: 'text', html: marked.parse(t, { async: false }) as string });
    buf = [];
  };
  for (const line of body.split('\n')) {
    const ref = byName.get(line.trim().replace(/^\[\[|\]\]$/g, '').toLowerCase());
    if (ref && !placed.has(ref)) { flush(); placed.add(ref); textBlocks.push({ type: 'media', item: ref }); }
    else buf.push(line);
  }
  flush();
  const blocks: Block[] = [...media.filter((m) => !placed.has(m)).map((item) => ({ type: 'media' as const, item })), ...textBlocks];

  return {
    id: slugify(name),
    folder,
    body: (dek ? [summary, body] : [body]).filter(Boolean).join('\n\n'),
    html: body ? (marked.parse(body, { async: false }) as string) : '',
    blocks,
    data: {
      title,
      description: plainSummary || title,
      dek,
      date,
      tags,
      sample: settings.data || undefined,
      kind: /essay/i.test(settings.type ?? '') ? 'essay' : 'note',
      featured: yes(settings.pin ?? settings.pinned),
      selected: !yes(settings.hide ?? settings.hidden),
      source: link && /^https?:\/\//.test(link) ? { url: link } : undefined,
      images: postImages,
      videos: postVideos,
      autoplay: yes(settings.autoplay),
    },
  };
}

let cache: Post[] | undefined;
export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;
  const byFolder = new Map<string, { text?: string; imgs: [string, ImageMetadata][]; vids: [string, string][] }>();
  const folderOf = (p: string) => p.split('/')[2];
  for (const [p, t] of Object.entries(texts)) {
    const f = folderOf(p);
    if (f.startsWith('_') || f.startsWith('.') || /\/readme[^/]*$/i.test(p)) continue;
    const entry = byFolder.get(f) ?? { imgs: [], vids: [] };
    entry.text = (entry.text ? entry.text + '\n\n' : '') + t;
    byFolder.set(f, entry);
  }
  for (const [p, img] of Object.entries(images)) {
    const f = folderOf(p);
    if (f.startsWith('_') || f.startsWith('.')) continue;
    const entry = byFolder.get(f) ?? { imgs: [], vids: [] };
    entry.imgs.push([p, img]);
    byFolder.set(f, entry);
  }
  for (const [p, url] of Object.entries(videos)) {
    const f = folderOf(p);
    if (f.startsWith('_') || f.startsWith('.')) continue;
    const entry = byFolder.get(f) ?? { imgs: [], vids: [] };
    entry.vids.push([p, url]);
    byFolder.set(f, entry);
  }
  const posts: Post[] = [];
  const seen = new Set<string>();
  for (const [folder, { text, imgs, vids }] of byFolder) {
    imgs.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
    vids.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }));
    if (!text) console.warn(`[serveplusone] "${folder}" has media but no text file; using the folder name as the title.`);
    const post = parse(folder, text ?? folder.replace(/^\d{4}-\d{2}-\d{2}\s*/, ''), imgs, vids);
    let id = post.id, n = 2;
    while (seen.has(id)) id = `${post.id}-${n++}`;
    seen.add(id);
    post.id = id;
    if (post.data.selected) posts.push(post);
  }
  cache = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return cache;
}

export const tagSlug = slugify;

export function allTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const p of posts) for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count, slug: tagSlug(name) }));
}

export const dims = (img: PostImage) => ({ width: img.src.width, height: img.src.height });

/** Full-resolution file for the zoom view and "Full resolution" link. */
export async function hiresUrl(img: PostImage): Promise<string> {
  const out = await getImage({ src: img.src, width: img.src.width, format: img.src.format as any, quality: 95 });
  return out.src;
}

/** Social card: the generated 1200×630 /og/<slug>.png */
export async function socialImage(img: PostImage | undefined, site: URL, slug?: string) {
  if (!img || !slug) return undefined;
  return { url: new URL(`/og/${slug}.png`, site).href, width: 1200, height: 630 };
}

export function plainText(md = '') {
  return md.replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_`~]/g, '').replace(/\s+/g, ' ').trim();
}

export function readingMinutes(md = '') {
  return Math.max(1, Math.round(plainText(md).split(' ').filter(Boolean).length / 230));
}

export const fmtDate = (d: Date, style: 'long' | 'month' = 'long') =>
  d.toLocaleDateString('en-GB', style === 'month' ? { month: 'long', year: 'numeric', timeZone: 'UTC' } : { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
