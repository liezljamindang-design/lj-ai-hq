import {
  BY_AGENT, FALLBACK, NICHE_ANSWER, NICHE_QUESTION, NICHES, SHARED, SUGGESTIONS,
  type KnowledgeEntry, type Lang,
} from "../data/knowledge";

/** Lower-case, strip accents and punctuation, so "Magkano?" and "magkano" compare equal. */
const normalise = (text: string) =>
  ` ${text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "").replace(/[^a-z0-9/\s-]/g, " ").replace(/\s+/g, " ").trim()} `;

/**
 * Common Tagalog words that rarely appear in English sentences. One of them
 * in a message is enough to answer in Taglish. Words that double as English
 * ("may", "at", "pa", "raw", "akin", "kay") are left out on purpose.
 */
const TAGALOG = new Set(
  ("ako ko ikaw ka mo iyo siya niya kami namin tayo natin kayo niyo ninyo sila nila " +
    "ba po opo oo hindi wala walang meron mayroon yung iyong ito iyan yan yun dito diyan doon nandito " +
    "na ng nang sa kung kapag pag kasi dahil para pero tapos tsaka saka rin lang naman nga daw muna talaga sobra " +
    "ano anong sino saan kailan bakit paano paanong magkano ilan ilang alin gaano " +
    "pwede puwede gusto gustong kailangan kelangan alam marunong " +
    "salamat kumusta kamusta musta sige paki pakisabi pasensya " +
    "mga isang akong bang kang nyo nya ganun ganito ganyan").split(" "),
);
/** Taglish verbs built on an English root, such as "mag-book" or "nag-message". */
const TAGLISH_VERB = /^(mag|nag|pag|naka|maka|ipa|na|i|ma)-[a-z]+$/;

/** "tl" when the message contains Tagalog, otherwise "en". */
export function detectLanguage(text: string): Lang {
  const words = normalise(text).trim().split(" ");
  return words.some((w) => TAGALOG.has(w) || TAGLISH_VERB.test(w)) ? "tl" : "en";
}

/**
 * How well a keyword fits a question. Short words must match as whole words,
 * so "opt" does not fire inside "option"; longer ones may match as a stem,
 * so "qualif" covers "qualify" and "qualified". Phrases count for more.
 */
function hit(question: string, keyword: string): number {
  const k = normalise(keyword).trim();
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

const nicheAnswer = (agentId: string, lang: Lang) => (NICHE_ANSWER[agentId] ?? NICHE_ANSWER.sophia)[lang];

/** The suggestion chips for an employee, in the given language. */
export function suggestions(agentId: string, lang: Lang): string[] {
  const all = [...(BY_AGENT[agentId] ?? []), ...SHARED];
  return (SUGGESTIONS[agentId] ?? []).flatMap((ref) => {
    if (ref.startsWith("niche:")) {
      const niche = NICHES.find((n) => n.id === ref.slice(6));
      return niche ? [NICHE_QUESTION[lang](niche)] : [];
    }
    const q = all.find((e) => e.id === ref)?.q;
    return q ? [q[lang]] : [];
  });
}

/**
 * Picks the reply for a question put to one employee:
 * 1. an exact suggested question,
 * 2. otherwise the best keyword match, preferring the employee's own specialty on a tie,
 * 3. otherwise an example for the niche the visitor named,
 * 4. otherwise an honest "not in my knowledge base".
 * The reply is in English unless the question itself contains Tagalog.
 */
export function answer(agentId: string, text: string): { text: string; language: Lang } {
  const language = detectLanguage(text);
  const own = BY_AGENT[agentId] ?? [];
  const reply = (t: string) => ({ text: t, language });

  const exact = [...own, ...SHARED].find((e) => e.q && (e.q.en === text || e.q.tl === text));
  if (exact) return reply(exact.a[language]);
  const chipNiche = NICHES.find((n) => NICHE_QUESTION.en(n) === text || NICHE_QUESTION.tl(n) === text);
  if (chipNiche) return reply(nicheAnswer(agentId, language)(chipNiche));

  const question = normalise(text);
  const mine = best(question, own);
  const shared = best(question, SHARED);
  const niche = NICHES.find((n) => n.keywords.some((k) => hit(question, k) > 0));

  // Greetings and thanks are weak signals: any real topic or niche in the same message wins over them.
  const smallTalk = shared && (shared.entry.id === "hello" || shared.entry.id === "thanks");
  const topic = mine && (!shared || smallTalk || mine.score >= shared.score) ? mine : smallTalk ? null : shared;

  if (topic) return reply(topic.entry.a[language]);
  if (niche) return reply(nicheAnswer(agentId, language)(niche));
  if (shared) return reply(shared.entry.a[language]);
  return reply(FALLBACK[language]);
}
