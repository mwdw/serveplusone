import type { APIContext } from 'astro';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { SITE } from '../../site.config';
import { getPosts } from '../../lib/posts';

// 1200×630 social card per post: the lead chart, uncropped, on the court colour.
// (X and LinkedIn crop anything that isn't ~1.91:1, which mangles charts.)
const W = 1200, H = 630, PAD = 34, FOOT = 46;
const COURT = '#142231', CHALK = '#eef1ea';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.filter((p) => p.data.images[0]).map((post) => ({ params: { slug: post.id }, props: { file: post.data.images[0].file } }));
}

export async function GET({ props }: APIContext<{ file: string }>) {
  const { file } = props;
  const chart = sharp(await readFile(file)).resize({ width: W - PAD * 2, height: H - PAD - FOOT, fit: 'inside', withoutEnlargement: false });
  const buf = await chart.png().toBuffer();
  const { width = 0, height = 0 } = await sharp(buf).metadata();
  const foot = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${FOOT}">
      <g transform="translate(${PAD} 10) scale(0.9)" fill="none" stroke="${CHALK}" stroke-opacity=".85" stroke-linecap="round">
        <path d="M2 14h24" stroke-width="2.3"/><path d="M14 2.5v23" stroke-width="1.5"/>
        <circle cx="20" cy="20" r="2.9" fill="#dbe46f" stroke="none"/>
      </g>
      <text x="${PAD + 36}" y="31" font-family="Schibsted Grotesk, Inter, sans-serif" font-size="17" fill="${CHALK}" fill-opacity=".8">${SITE.name}  /  ${SITE.author.name}</text>
    </svg>`,
  );
  const png = await sharp({ create: { width: W, height: H, channels: 3, background: COURT } })
    .composite([
      { input: buf, left: Math.round((W - width) / 2), top: Math.round(PAD + (H - PAD - FOOT - height) / 2) },
      { input: foot, left: 0, top: H - FOOT },
    ])
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
