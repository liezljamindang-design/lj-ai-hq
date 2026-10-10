import { BY_AGENT, FALLBACK, NICHE_ANSWER, NICHES, SHARED, type KnowledgeEntry } from "../data/knowledge";

/** Lower-case, strip accents and punctuation, so "Magkano?" and "magkano" compare equal. */
const normalise = (text: string) =>
  ` ${text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9/\s-]/g, " ").replace(/\s+/g, " ").trim()} `;

/**
 * How well a keyword fits a question. Short words must match as whole words,
 * so "ig" does not fire inside "magbigay"; longer ones may match as a stem,
 * so "qualif" covers "qualify" and "qualified". Phrases count for more.
 */
function hit(question: string, keyword: string): number {
  const k = keyword.toLowerCase();
  const found = k.length <= 4 ? question.includes(` ${k} `) : question.includes(k);
  if (!found) return 0;
  return k.includes(" ") || k.includes("-") ? 2 : 1;
}

function best(question: string, entries: KnowledgeEntry[]) {
  let top: { entry: KnowledgeEntry; score: number } | null = null;
  for (const entry of entries) {
    const score = entry.keywords.reduce((sum, k) => sum + hit(question, k), 0);
    if (score > 0 && (!top || score > top.score)) top = { entry, score };
  }
  return top;
}

/**
 * Picks the reply for a question put to one employee:
 * 1. an exact suggested question,
 * 2. otherwise the best keyword match, preferring the employee's own specialty on a tie,
 * 3. otherwise an example for the niche the visitor named,
 * 4. otherwise an honest "not in my knowledge base".
 */
export function answer(agentId: string, text: string): string {
  const own = BY_AGENT[agentId] ?? [];
  const exact = [...own, ...SHARED].find((e) => e.q === text);
  if (exact) return exact.a;

  const question = normalise(text);
  const mine = best(question, own);
  const shared = best(question, SHARED);
  const niche = NICHES.find((n) => n.keywords.some((k) => hit(question, k) > 0));

  // Greetings and thanks are weak signals: any real topic or niche in the same message wins over them.
  const smallTalk = shared && (shared.entry.id === "hello" || shared.entry.id === "thanks");
  const topic = mine && (!shared || smallTalk || mine.score >= shared.score) ? mine : smallTalk ? null : shared;

  if (topic) return topic.entry.a;
  if (niche) return (NICHE_ANSWER[agentId] ?? NICHE_ANSWER.sophia)(niche);
  if (shared) return shared.entry.a;
  return FALLBACK;
}
