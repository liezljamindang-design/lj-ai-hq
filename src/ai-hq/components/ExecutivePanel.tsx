import { useState } from "react";
import { HQ_CONFIG } from "../config";
import { PROFILE } from "../data/profile";
import { useHq } from "../store/hqStore";
import { PanelShell } from "./PanelShell";

const TABS = ["About me", "Experience", "Contact"] as const;
type Tab = (typeof TABS)[number];

/** The Executive Office: who built this, with links back to the portfolio and the CV. */
export function ExecutivePanel() {
  const openPanel = useHq((s) => s.openPanel);
  const [tab, setTab] = useState<Tab>("About me");

  return (
    <PanelShell eyebrow="Executive Office" title={HQ_CONFIG.ownerName} closeLabel="Close the Executive Office">
      <div className="exec-id">
        <p className="exec-title">{HQ_CONFIG.ownerTitle}</p>
        <p className="exec-tagline">{HQ_CONFIG.ownerTagline}</p>
      </div>

      <div className="exec-actions">
        <button type="button" className="btn-primary" onClick={() => openPanel("projects")}>View projects</button>
        <a className="btn-secondary" href={HQ_CONFIG.cvPath} download>Download CV</a>
        <a className="link-btn" href={HQ_CONFIG.portfolioUrl}>Open the full portfolio</a>
      </div>

      <div className="tabs" role="tablist" aria-label="About Liezl">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" id={`exec-tab-${t}`} aria-selected={tab === t} aria-controls="exec-tabpanel"
            className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div id="exec-tabpanel" role="tabpanel" aria-labelledby={`exec-tab-${tab}`} className="exec-body">
        {tab === "About me" && (
          <>
            {PROFILE.about.map((p) => <p key={p}>{p}</p>)}
            <h3 className="panel-title panel-title-flush">GoHighLevel skills</h3>
            <ul className="tag-list">{PROFILE.skills.map((s) => <li key={s}>{s}</li>)}</ul>
            <h3 className="panel-title panel-title-flush">Certifications</h3>
            <ul className="caps-list">{PROFILE.certifications.map((c) => <li key={c}>{c}</li>)}</ul>
          </>
        )}

        {tab === "Experience" && (
          <ol className="exp-list">
            {PROFILE.experience.map((e) => (
              <li key={e.role + e.dates}>
                <p className="exp-dates">{e.dates}</p>
                <p className="exp-role">{e.role}</p>
                <p className="exp-org">{e.org}</p>
                <p>{e.summary}</p>
              </li>
            ))}
          </ol>
        )}

        {tab === "Contact" && (
          <>
            <p>Tell me what you'd like automated. I usually reply within a day.</p>
            <dl className="lead-facts">
              <div><dt>Email</dt><dd><CopyValue value={HQ_CONFIG.email} href={`mailto:${HQ_CONFIG.email}`} /></dd></div>
              <div><dt>Phone</dt><dd><CopyValue value={HQ_CONFIG.phone} href={`tel:${HQ_CONFIG.phone.replace(/\s/g, "")}`} /></dd></div>
              <div><dt>Based in</dt><dd>{HQ_CONFIG.location}</dd></div>
              <div><dt>Portfolio</dt><dd><a className="link-btn" href={HQ_CONFIG.portfolioUrl}>{HQ_CONFIG.portfolioUrl.replace("https://", "")}</a></dd></div>
            </dl>
          </>
        )}
      </div>
    </PanelShell>
  );
}

/** A contact detail shown as selectable text, with a copy button for when the mail or phone link does nothing. */
function CopyValue({ value, href }: { value: string; href: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the value is still on screen to select by hand */
    }
  }

  return (
    <span className="copy-value">
      <a className="link-btn" href={href}>{value}</a>
      <button type="button" className="copy-btn" onClick={copy} aria-label={`Copy ${value}`}>{copied ? "Copied" : "Copy"}</button>
    </span>
  );
}
