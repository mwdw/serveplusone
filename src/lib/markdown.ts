import { SITE } from '../site.config';
import { hiresUrl, isoDate, type Post } from './posts';

/** A self-contained Markdown rendering of a post, for /posts/<slug>.md and llms-full.txt. */
export async function postMarkdown(p: Post, site: URL) {
  const abs = (u: string) => new URL(u, site).href;
  const imgs = await Promise.all(p.data.images.map(async (i) => `![${i.alt}](${abs(await hiresUrl(i))})`));
  imgs.push(...p.data.videos.map((v) => `Video: ${abs(v.url)}`));
  return [
    `# ${p.data.title}`,
    '',
    `${p.data.description}`,
    '',
    `- Author: ${SITE.author.name}`,
    `- Published: ${isoDate(p.data.date)}`,
    p.data.sample ? `- Data sample: ${p.data.sample}` : '',
    p.data.tags.length ? `- Topics: ${p.data.tags.join(', ')}` : '',
    `- URL: ${abs(`/posts/${p.id}`)}`,
    p.data.source ? `- First posted: ${p.data.source.url}` : '',
    '',
    ...imgs,
    '',
    (p.body ?? '').trim(),
    '',
  ]
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
    .join('\n');
}
