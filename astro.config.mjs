// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The live address. Override with a SITE_URL environment variable if it ever changes.
const site = process.env.SITE_URL || 'https://serveplusone.co';

export default defineConfig({
  site,
  trailingSlash: 'never',
  build: { format: 'file' }, // /posts/foo.html served as /posts/foo
  integrations: [sitemap({ filter: (page) => !/\/post(\.html)?$/.test(page) })],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  // Never inline videos into the page, however small.
  vite: { build: { assetsInlineLimit: (file) => (/\.(mp4|webm|mov|m4v)$/i.test(file) ? false : undefined) } },
});
