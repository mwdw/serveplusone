/**
 * Automatic tags. Each post is read (title, summary, writing, chart descriptions,
 * data line) and tagged from this vocabulary. Tags written by hand on the
 * "Tags:" line are always kept as well; add "Auto tags: no" to switch this off
 * for one post.
 *
 * Topics are deliberately specific ("Rally length", not "Rally") so the filter
 * buttons stay useful as the archive grows. Add or rename topics here.
 */

/** Topic → patterns. A post gets the topic if any pattern matches anywhere in it
 *  (or, for the broad ones listed in HEADLINE_ONLY, in its title or summary). */
export const TOPICS: Record<string, RegExp[]> = {
  'Serve +1': [/\+\s?1\b/, /plus[- ]one/i, /server'?s (second|next) shot/i],
  'First serve': [/\b(first|1st)[- ]serve/i],
  'Second serve': [/\b(second|2nd)[- ]serve/i],
  'Serve speed': [/serve (speed|pace)/i],
  'Serve placement': [/serve (placement|direction|location|accuracy)/i, /wide serves?/i, /\bT serves?\b/, /body serves?/i, /landing (distance|spot|location)/i, /out wide/i],
  'Serve dominance': [/serve dominan/i, /unreturned/i, /hold(s|ing)? serve/i, /hold (rate|%)/i, /\baces\b/i],
  Return: [/\breturn/i],
  'Return position': [/return (position|contact|depth|stance)/i, /returners?\b.*\b(stand|position|contact|deep|depth)/i, /contact points? on .*serves?/i],
  'Court position': [/rally contact/i, /court position/i, /rally position/i],
  'Forehand vs backhand': [/\bforehands?\b[^.]{0,40}\bbackhands?\b(?!\s+(corners?|sides?|thirds?|grip))/i, /\bbackhands?\b[^.]{0,40}\bforehands?\b(?!\s+(corners?|sides?|thirds?|grip))/i],
  Forehand: [/forehand/i],
  Backhand: [/backhand/i],
  'Shot direction': [/inside[- ](out|in)\b/i, /cross[- ]?court/i, /down the line/i, /shot direction/i],
  'Spin and speed': [/\bspin rates?\b/i, /\brpm\b/i, /ball speed/i, /net clearance/i, /groundstroke speed/i],
  'Drop shots': [/drop[- ]shots?/i],
  'Rally length': [/rally length/i, /shots? per rally/i, /(long|short|extended) rallies/i, /rally count/i],
  'Break points': [/break[- ]points?/i],
  Tiebreaks: [/tie-?breaks?/i],
  Lefties: [/left[- ]hand(ed|ers?)?/i, /\blefty\b|\blefties\b/i],
  Prospects: [/prospects?/i, /next[- ]?gen/i],
  'Surface comparison': [/\b(clay|hard|grass)\b[\s\S]{0,80}\b(clay|hard|grass)\b/i],
  Rankings: [/\belo\b/i, /rankings?\b/i],
  WTA: [/\bWTA\b/, /women'?s (tour|tennis|game)/i],
  'Court speed': [/court speed/i, /getting (slower|faster)/i, /(slower|faster) (courts?|conditions|surface)/i],
  'Balls and equipment': [/\bball changes?\b/i, /(new|newer|old|older|fresh|worn) balls/i, /\bstrings?\b.*\btension/i],
  History: [/\b19[5-9]\d\b/, /\b(serve|open|golden|big three) era\b/i],
};

/** Broad topics that only count when the title or summary is about them. */
const HEADLINE_ONLY = new Set(['First serve', 'Second serve', 'Return', 'Forehand', 'Backhand', 'Serve dominance']);
/** If a post has the specific topic, drop the general ones it implies. */
const IMPLIES: Record<string, string[]> = {
  'Return position': ['Court position', 'Return'],
  'Forehand vs backhand': ['Forehand', 'Backhand'],
};

/** Tournaments, tagged when the title, summary or writing mentions them. */
export const EVENTS: Record<string, RegExp> = {
  'Australian Open': /australian open|\bAO\b/,
  'Roland Garros': /roland[- ]garros|french open/i,
  Wimbledon: /wimbledon/i,
  'US Open': /us open|u\.s\. open/i,
  'Monte Carlo': /monte[- ]carlo/i,
  Madrid: /madrid open|\bin madrid\b/i,
  Rome: /italian open|\bin rome\b|internazionali/i,
  'Indian Wells': /indian wells/i,
  Miami: /miami open|\bin miami\b/i,
  'ATP Finals': /atp finals|nitto/i,
};

/**
 * Players, tagged only when named in the title, summary or Tags line,
 * so a chart that labels 20 players doesn't sprout 20 tags.
 */
export const PLAYERS: Record<string, RegExp> = {
  Sinner: /\bsinner\b/i,
  Alcaraz: /\balcaraz\b/i,
  Djokovic: /\bdjokovic\b/i,
  Zverev: /\bzverev\b/i,
  Medvedev: /\bmedvedev\b/i,
  Fritz: /\bfritz\b/i,
  Draper: /\bdraper\b/i,
  Shelton: /\bshelton\b/i,
  'de Minaur': /\bde minaur\b|\bminaur\b/i,
  Rune: /\brune\b/i,
  Ruud: /\bruud\b/i,
  Musetti: /\bmusetti\b/i,
  Mensik: /\bmen[sš]ik\b/i,
  Fonseca: /\bfonseca\b/i,
  Jodar: /\bj[oó]dar\b/i,
  Fils: /\bfils\b/i,
  Tien: /\btien\b/i,
  'Auger-Aliassime': /auger[- ]aliassime|\bFAA\b/,
  Bublik: /\bbublik\b/i,
  Rublev: /\brublev\b/i,
  Tsitsipas: /\btsitsipas\b/i,
  'Davidovich Fokina': /davidovich fokina|\bADF\b/i,
  Vacherot: /\bvacherot\b/i,
  Darderi: /\bdarderi\b/i,
  Tiafoe: /\btiafoe\b/i,
  Cobolli: /\bcobolli\b/i,
  Lehecka: /\bleh[eě]cka\b/i,
  Khachanov: /\bkhachanov\b/i,
  Sampras: /\bsampras\b/i,
  'Ivanišević': /\bivani[sš]evi[cć]/i,
  Swiatek: /\b[sś]wi[aą]tek\b/i,
  Sabalenka: /\bsabalenka\b/i,
  Gauff: /\bgauff\b/i,
  Rybakina: /\brybakina\b/i,
  Pegula: /\bpegula\b/i,
  Anisimova: /\banisimova\b/i,
  Andreeva: /\bandreeva\b/i,
};

/** Display order in the filter: topics first, then events, then players. */
export const ORDER = [...Object.keys(TOPICS), ...Object.keys(EVENTS), ...Object.keys(PLAYERS)];

export function autoTags(opts: { headline: string; everything: string; story?: string }): string[] {
  const out = new Set<string>();
  for (const [tag, patterns] of Object.entries(TOPICS)) {
    const text = HEADLINE_ONLY.has(tag) ? opts.headline : opts.everything;
    if (patterns.some((p) => p.test(text))) out.add(tag);
  }
  for (const [specific, general] of Object.entries(IMPLIES)) if (out.has(specific)) general.forEach((g) => out.delete(g));
  // Events: only from the headline and writing, so "data includes Monte Carlo" doesn't count.
  for (const [tag, p] of Object.entries(EVENTS)) if (p.test(opts.story ?? opts.everything)) out.add(tag);
  for (const [tag, p] of Object.entries(PLAYERS)) if (p.test(opts.headline)) out.add(tag);
  return [...out];
}

/** Remove general topics made redundant by a more specific one (applied to the final tag list). */
export function tidy(tags: string[]): string[] {
  const set = new Set(tags);
  for (const [specific, general] of Object.entries(IMPLIES)) if (set.has(specific)) general.forEach((g) => set.delete(g));
  return [...set];
}

/** Match a hand-written tag to the vocabulary's spelling, so "serve+1" and "Serve +1" are one topic. */
export function canonical(tag: string): string {
  const key = tag.toLowerCase().replace(/[^a-z0-9+]/g, '');
  return ORDER.find((t) => t.toLowerCase().replace(/[^a-z0-9+]/g, '') === key) ?? tag;
}
