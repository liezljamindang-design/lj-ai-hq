// POST /api/lead
// Receives the "Work with Liezl" form and passes it on to Liezl. This is real,
// not demo data: the details a visitor enters are sent to her and nowhere else.
//
// Delivery is configured with environment variables, set in Vercel and never in the code:
//   LEAD_WEBHOOK_URL   a GoHighLevel (or n8n, Zapier, Make) inbound webhook. The workflow
//                      behind it creates the contact and emails or messages Liezl.
//   RESEND_API_KEY     optional alternative: sends the email directly through Resend.
//   LEAD_TO_EMAIL      where that email goes. Defaults to Liezl's address.
// If neither is set the endpoint answers 503 and the form offers a plain email link instead.
import { clean, rateLimited, readJson, send } from "./_lib.js";

const SERVICES = new Set([
  "CRM setup", "Workflow automation", "Website or funnel", "AI agents", "Calendar and booking",
  "Email and SMS follow-up", "Something else",
]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (rateLimited(req, { max: 5, windowMs: 10 * 60_000 })) return send(res, 429, { error: "too_many_requests" });

  const body = readJson(req);
  if (!body) return send(res, 400, { error: "invalid_json" });
  // A hidden field real visitors never fill in. Bots do, and get a quiet success.
  if (clean(body.website, 200)) return send(res, 200, { ok: true });

  const lead = {
    firstName: clean(body.firstName, 80),
    lastName: clean(body.lastName, 80),
    email: clean(body.email, 160).toLowerCase(),
    services: (Array.isArray(body.services) ? body.services : []).map((s) => clean(s, 60)).filter((s) => SERVICES.has(s)),
    notes: clean(body.notes, 2000),
  };
  if (!lead.firstName || !lead.lastName || !EMAIL.test(lead.email)) return send(res, 400, { error: "invalid_fields" });

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  if (!webhook && !resendKey) return send(res, 503, { error: "not_configured" });

  const payload = {
    ...lead,
    first_name: lead.firstName, // snake_case copies: GoHighLevel maps these to contact fields without extra setup
    last_name: lead.lastName,
    name: `${lead.firstName} ${lead.lastName}`,
    services_needed: lead.services.join(", "),
    source: "LJ AI Headquarters",
    submittedAt: new Date().toISOString(),
  };

  try {
    if (webhook) {
      const r = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
    } else {
      const to = process.env.LEAD_TO_EMAIL || "liezljamindang@gmail.com";
      const text = [
        `New inquiry from LJ AI Headquarters`, ``,
        `Name: ${payload.name}`, `Email: ${lead.email}`,
        `Services needed: ${payload.services_needed || "Not specified"}`, ``,
        `Notes:`, lead.notes || "(none)",
      ].join("\n");
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "LJ AI Headquarters <onboarding@resend.dev>",
          to: [to], reply_to: lead.email, subject: `New inquiry: ${payload.name}`, text,
        }),
      });
      if (!r.ok) throw new Error(`resend ${r.status}`);
    }
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error("lead delivery failed:", err?.message); // the lead's details are deliberately not logged
    return send(res, 502, { error: "delivery_failed" });
  }
}
