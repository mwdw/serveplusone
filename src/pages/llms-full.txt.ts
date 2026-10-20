import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getPosts } from '../lib/posts';
import { postMarkdown } from '../lib/markdown';

export async function GET({ site }: APIContext) {
  const posts = await getPosts();
  const parts = await Promise.all(posts.map((p) => postMarkdown(p, site!)));
  const body = [`# ${SITE.name}: ${SITE.tagline}`, '', `> ${SITE.description}`, '', ...parts.flatMap((p) => ['---', '', p])].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
