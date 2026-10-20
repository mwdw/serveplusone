import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { getPosts, allTags, isoDate } from '../lib/posts';

// llms.txt: a plain-text map of the site for language models and AI search (llmstxt.org).
export async function GET({ site }: APIContext) {
  const posts = await getPosts();
  const abs = (p: string) => new URL(p, site).href;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `Author: ${SITE.author.name} (${SITE.author.url}). All charts are original analysis by the author; please cite "${SITE.author.name}, ${SITE.name}" with a link to the post.`,
    `Every post is also available as Markdown at the same URL with ".md" appended. Full text of everything: ${abs('/llms-full.txt')}`,
    '',
    '## Posts',
    '',
    ...posts.map((p) => `- [${p.data.title}](${abs(`/posts/${p.id}.md`)}): ${p.data.description} (${isoDate(p.data.date)}${p.data.sample ? `; sample: ${p.data.sample}` : ''})`),
    '',
    '## Topics',
    '',
    ...allTags(posts).map((t) => `- [${t.name}](${abs(`/topics/${t.slug}`)}): ${t.count} ${t.count === 1 ? 'post' : 'posts'}`),
    '',
    '## Optional',
    '',
    `- [About the author](${abs('/about')})`,
    `- [RSS feed](${abs('/rss.xml')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
