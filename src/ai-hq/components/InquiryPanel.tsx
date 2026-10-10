import { useState, type FormEvent } from "react";
import { HQ_CONFIG } from "../config";
import { services } from "../services";
import type { LeadInquiry } from "../types";
import { PanelShell } from "./PanelShell";

const SERVICES = [
  "CRM setup", "Workflow automation", "Website or funnel", "AI agents", "Calendar and booking",
  "Email and SMS follow-up", "Something else",
];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
type Status = "idle" | "sending" | "sent" | "fallback";

/**
 * "Work with Liezl". The one real form in the HQ: what a visitor enters is
 * sent to Liezl so she can follow up. If the server can't deliver it, the
 * visitor gets a ready-made email to send instead, so no inquiry is lost.
 */
export function InquiryPanel() {
  const [lead, setLead] = useState<LeadInquiry>({ firstName: "", lastName: "", email: "", services: [], notes: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = (field: keyof LeadInquiry) => (e: { target: { value: string } }) => setLead((l) => ({ ...l, [field]: e.target.value }));
  const toggle = (service: string) =>
    setLead((l) => ({ ...l, services: l.services.includes(service) ? l.services.filter((s) => s !== service) : [...l.services, service] }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!lead.firstName.trim() || !lead.lastName.trim()) return setError("Enter your first and last name.");
    if (!EMAIL.test(lead.email.trim())) return setError("Enter a valid email address, like name@example.com.");
    setError("");
    setStatus("sending");
    const result = await services.leads.submit(lead);
    setStatus(result === "sent" ? "sent" : "fallback");
  }

  const mailto =
    `mailto:${HQ_CONFIG.email}?subject=${encodeURIComponent(`Inquiry from ${lead.firstName} ${lead.lastName}`)}` +
    `&body=${encodeURIComponent(`Name: ${lead.firstName} ${lead.lastName}\nEmail: ${lead.email}\nServices needed: ${lead.services.join(", ") || "Not specified"}\n\n${lead.notes}`)}`;

  return (
    <PanelShell eyebrow="Work with Liezl" title="Request a quote" closeLabel="Close the inquiry form">
      {status === "sent" ? (
        <div className="inquiry-done" role="status">
          <p className="inquiry-done-title">Sent. Thank you, {lead.firstName.trim()}!</p>
          <p>Liezl has your details and will reply to {lead.email.trim()}, usually within a day.</p>
        </div>
      ) : status === "fallback" ? (
        <div className="inquiry-done" role="alert">
          <p className="inquiry-done-title">The form couldn't send your inquiry.</p>
          <p>Your details are not lost. Send them to Liezl by email instead:</p>
          <a className="btn-primary inquiry-submit" href={mailto}>Open the email, ready to send</a>
          <p className="muted">If nothing opens, write to <span className="inquiry-address">{HQ_CONFIG.email}</span>.</p>
          <button type="button" className="link-btn" onClick={() => setStatus("idle")}>Back to the form</button>
        </div>
      ) : (
        <form className="inquiry" onSubmit={onSubmit} noValidate>
          <p>Tell Liezl what you need. She prepares every quote herself and replies by email.</p>
          <p className="inquiry-real">This form is real. Unlike the demo data around it, what you enter is sent to Liezl, and only to her.</p>

          <div className="field-row">
            <div className="field">
              <label htmlFor="inq-first">First name</label>
              <input id="inq-first" type="text" autoComplete="given-name" maxLength={80} value={lead.firstName} onChange={set("firstName")} required />
            </div>
            <div className="field">
              <label htmlFor="inq-last">Last name</label>
              <input id="inq-last" type="text" autoComplete="family-name" maxLength={80} value={lead.lastName} onChange={set("lastName")} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="inq-email">Email</label>
            <input id="inq-email" type="email" autoComplete="email" inputMode="email" maxLength={160} value={lead.email} onChange={set("email")} required />
          </div>

          <fieldset className="field">
            <legend>Services needed</legend>
            <div className="service-chips">
              {SERVICES.map((s) => (
                <button key={s} type="button" className="service-chip" aria-pressed={lead.services.includes(s)} onClick={() => toggle(s)}>{s}</button>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="inq-notes">Notes</label>
            <textarea id="inq-notes" rows={4} maxLength={2000} value={lead.notes} onChange={set("notes")}
              placeholder="Your business, what you want automated, and any deadline." />
          </div>

          {/* Hidden from people; bots that fill it in are ignored. */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="inq-website">Website</label>
            <input id="inq-website" type="text" tabIndex={-1} autoComplete="off" value={lead.website} onChange={set("website")} />
          </div>

          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary inquiry-submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send to Liezl"}
          </button>
        </form>
      )}
    </PanelShell>
  );
}
