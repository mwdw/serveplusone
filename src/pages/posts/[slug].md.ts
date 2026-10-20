import type { APIContext } from 'astro';
import { getPosts, type Post } from '../../lib/posts';
import { postMarkdown } from '../../lib/markdown';

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export async function GET({ props, site }: APIContext<{ post: Post }>) {
  return new Response(await postMarkdown(props.post, site!), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
