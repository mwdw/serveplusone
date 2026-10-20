import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getPosts, hiresUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const site = context.site!;
  const items = await Promise.all(
    posts.map(async (p) => {
      const imgs = await Promise.all(p.data.images.map(async (i) => `<p><img src="${new URL(await hiresUrl(i), site).href}" alt="${i.alt.replace(/"/g, '&quot;')}" /></p>`));
      return {
        title: p.data.title,
        description: p.data.description,
        pubDate: p.data.date,
        link: `/posts/${p.id}`,
        categories: p.data.tags,
        content: imgs.join('') + `<p>${p.data.description}</p>`,
      };
    }),
  );
  return rss({
    title: SITE.name,
    description: SITE.description,
    site,
    items,
    customData: `<language>${SITE.lang}</language>`,
  });
}
