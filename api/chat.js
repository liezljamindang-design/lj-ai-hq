// POST /api/chat
// Live AI replies for the employees' chat, using Claude. The API key stays on
// the server. If ANTHROPIC_API_KEY is not set the endpoint answers 503 and the
// site quietly falls back to its written knowledge base.
//
//   ANTHROPIC_API_KEY   required to turn live AI on
//   CHAT_MODEL          optional, defaults to a small, fast, low-cost Claude model
//
// Cost control: short replies, short history, and a per-visitor rate limit.
// Also set a monthly spend limit in the Anthropic console; that is the real cap.
import { clean, rateLimited, readJson, send } from "./_lib.js";
import { PERSONAS, systemPrompt } from "./_personas.js";

const MODEL = process.env.CHAT_MODEL || "claude-haiku-4-5-20251001";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return send(res, 503, { error: "not_configured" });
  if (rateLimited(req, { max: 15, windowMs: 5 * 60_000 })) return send(res, 429, { error: "too_many_requests" });

  const body = readJson(req);
  const agentId = clean(body?.agentId, 20);
  if (!body || !PERSONAS[agentId]) return send(res, 400, { error: "invalid_request" });

  // Keep only the last few turns, trimmed, alternating and starting with the visitor.
  const turns = (Array.isArray(body.messages) ? body.messages : [])
    .map((m) => ({ role: m?.role === "assistant" ? "assistant" : "user", content: clean(m?.content, 600) }))
    .filter((m) => m.content)
    .slice(-8);
  while (turns.length && turns[0].role !== "user") turns.shift();
  const messages = [];
  for (const t of turns) {
    if (messages.length && messages[messages.length - 1].role === t.role) messages[messages.length - 1].content += `\n${t.content}`;
    else messages.push(t);
  }
  if (!messages.length || messages[messages.length - 1].role !== "user") return send(res, 400, { error: "invalid_request" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: MODEL, max_tokens: 350, system: systemPrompt(agentId), messages }),
    });
    if (!r.ok) throw new Error(`anthropic ${r.status}`);
    const data = await r.json();
    const text = (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    if (!text) throw new Error("empty reply");
    return send(res, 200, { text: text.slice(0, 2000) });
  } catch (err) {
    console.error("chat failed:", err?.message);
    return send(res, 502, { error: "upstream_failed" });
  }
}
