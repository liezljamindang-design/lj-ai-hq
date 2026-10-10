// Shared helpers for the serverless functions. Files starting with "_" are not exposed as endpoints.

/** Best-effort rate limit, per visitor address. It resets when the function restarts, so it slows abuse rather than preventing it. */
const hits = new Map();
export function rateLimited(req, { max, windowMs }) {
  const ip = String(req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > max;
}

/** Vercel parses JSON bodies for us; this also copes with a raw string. */
export function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body ?? "{}");
  } catch {
    return null;
  }
}

export const clean = (value, max) => String(value ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}
