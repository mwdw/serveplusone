// Regenerates favicon, touch icons, web manifest and the default social card.
// Run with:  npm run brand
// (Needs Newsreader + Schibsted Grotesk installed locally for the text to render in those faces.)
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const NAME = process.env.SITE_NAME || 'Serve Plus One';
const TAG = process.env.SITE_TAG || 'Tennis data, short essays, analysis';
const COURT = '#142231', CHALK = '#eef1ea', MUTED = '#8e9fb1', BALL = '#dbe46f';

// The mark: the net and the centre line make a plus; the ball in the box is the one. 28×28 grid.
const mark = (scale = 1) => `
  <path d="M2 14h24" stroke="${CHALK}" stroke-width="${2.3 * scale}" stroke-linecap="round"/>
  <path d="M14 2.5v23" stroke="${CHALK}" stroke-width="${1.5 * scale}" stroke-linecap="round"/>
  <circle cx="20" cy="20" r="2.9" fill="${BALL}"/>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<rect width="32" height="32" rx="7" fill="${COURT}"/>
<g transform="translate(2 2)">${mark(1.25)}</g></svg>`;
await writeFile('public/favicon.svg', favicon);
await sharp(Buffer.from(favicon.replace('rx="7"', 'rx="0"')), { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(Buffer.from(favicon), { density: 600 }).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(Buffer.from(favicon), { density: 600 }).resize(512, 512).png().toFile('public/icon-512.png');

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${COURT}"/>
<path d="M0 58h1200" stroke="${CHALK}" stroke-opacity=".5" stroke-width="2"/><path d="M600 58v16" stroke="${CHALK}" stroke-opacity=".5" stroke-width="2"/>
<path d="M150 58v572M164 58v572" stroke="${CHALK}" stroke-opacity=".35" stroke-width="2"/>
<g transform="translate(226 160) scale(3.6)">${mark(0.8)}</g>
<text x="230" y="350" font-family="Newsreader 16pt, Newsreader, Georgia, serif" font-size="112" letter-spacing="-2" fill="${CHALK}">${NAME}</text>
<text x="234" y="420" font-family="Schibsted Grotesk, Inter, sans-serif" font-size="34" fill="${MUTED}">${TAG}</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og-default.png');

await writeFile(
  'public/site.webmanifest',
  JSON.stringify({ name: NAME, short_name: 'Serve +1', description: TAG, start_url: '/', display: 'standalone', background_color: COURT, theme_color: COURT, icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 2),
);
console.log('Brand assets written to public/');
