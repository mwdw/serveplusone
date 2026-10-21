/**
 * Quoted posts. A line in post.txt that is just an X post link
 * (https://x.com/someone/status/123…) becomes a small card with who said it,
 * when, what they said and a link to the original. The details are looked up
 * when the site builds; if that fails the card still shows a plain link.
 */
export interface Quote {
  url: string;
  handle: string;
  name?: string;
  text?: string;
  date?: Date;
  hasVideo?: boolean;
  hasImage?: boolean;
}

export const QUOTE_LINE = /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/(\w+)\/status\/(\d+)\S*$/i;

const cache = new Map<string, Promise<Quote>>();

export function getQuote(url: string): Promise<Quote> {
  const m = url.match(QUOTE_LINE);
  if (!m) return Promise.resolve({ url, handle: '' });
  const [, handle, id] = m;
  const clean = `https://x.com/${handle}/status/${id}`;
  if (!cache.has(id)) {
    cache.set(
      id,
      (async () => {
        try {
          const res = await fetch(`https://api.fxtwitter.com/${handle}/status/${id}`, { signal: AbortSignal.timeout(8000) });
          const t = (await res.json())?.tweet;
          if (!t) throw new Error('no tweet');
          const media = t.media?.all ?? [];
          return {
            url: clean,
            handle: t.author?.screen_name ?? handle,
            name: t.author?.name,
            text: (t.text ?? '').trim() || undefined,
            date: t.created_timestamp ? new Date(t.created_timestamp * 1000) : undefined,
            hasVideo: media.some((x: { type: string }) => x.type === 'video' || x.type === 'gif'),
            hasImage: media.some((x: { type: string }) => x.type === 'photo'),
          };
        } catch {
          console.warn(`[serveplusone] couldn't fetch quoted post ${clean}; showing a plain link.`);
          return { url: clean, handle };
        }
      })(),
    );
  }
  return cache.get(id)!;
}
