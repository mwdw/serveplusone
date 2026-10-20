import type { APIContext } from 'astro';

// Open to search engines and AI assistants alike: being cited is the point.
const aiAgents = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot'];

export function GET({ site }: APIContext) {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...aiAgents.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
    `Sitemap: ${new URL('/sitemap-index.xml', site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
