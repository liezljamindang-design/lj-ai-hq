import { useEffect, useRef } from "react";
import { useHq } from "../store/hqStore";
import type { Lead } from "../types";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Miniature CRM: today's numbers, the pipeline, and a closer look at any lead. Demo data only. */
export function CrmPanel({ onRetry }: { onRetry: () => void }) {
  const crm = useHq((s) => s.crm);
  const state = useHq((s) => s.crmState);
  const openLeadId = useHq((s) => s.openLeadId);
  const setOpenLead = useHq((s) => s.setOpenLead);
  const close = useHq((s) => s.closeDashboard);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => { panelRef.current?.focus(); }, [openLeadId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || useHq.getState().helpOpen) return;
      if (useHq.getState().openLeadId) setOpenLead(null);
      else close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, setOpenLead]);

  const lead = crm?.leads.find((l) => l.id === openLeadId);

  return (
    <aside className="side-panel crm-panel" ref={panelRef} tabIndex={-1} aria-labelledby="crm-title">
      <header className="panel-head">
        <div>
          <p className="eyebrow">Demo data</p>
          <h2 id="crm-title">{lead ? lead.name : "CRM dashboard"}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close the CRM dashboard">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </header>

      <div className="panel-scroll">
        {state === "loading" && <p className="muted">Loading the CRM…</p>}
        {state === "error" && (
          <p className="muted">
            The CRM didn't load.{" "}
            <button type="button" className="link-btn" onClick={onRetry}>Try again</button>
          </p>
        )}

        {state === "ready" && crm && lead && <LeadDetail lead={lead} />}

        {state === "ready" && crm && !lead && (
          <>
            <dl className="crm-metrics" aria-label="Today">
              <div><dt>New leads</dt><dd>{crm.metrics.newLeads}</dd></div>
              <div><dt>Qualified leads</dt><dd>{crm.metrics.qualifiedLeads}</dd></div>
              <div><dt>Appointments</dt><dd>{crm.metrics.appointments}</dd></div>
              <div><dt>Follow-ups running</dt><dd>{crm.metrics.followUpsRunning}</dd></div>
              <div className="crm-metric-wide"><dt>Pipeline value</dt><dd>{usd.format(crm.metrics.pipelineValue)}</dd></div>
            </dl>

            <h3 className="panel-title panel-title-flush">Pipeline</h3>
            {crm.leads.length === 0 ? (
              <p className="muted">No opportunities yet.</p>
            ) : (
              <ol className="pipeline">
                {crm.stages.map((stage) => {
                  const leads = crm.leads.filter((l) => l.stage === stage.id);
                  const total = leads.reduce((sum, l) => sum + l.value, 0);
                  return (
                    <li key={stage.id} className={`stage stage-${stage.id}`}>
                      <div className="stage-head">
                        <span className="stage-name">{stage.name}</span>
                        <span className="stage-count">{leads.length}</span>
                        <span className="stage-total">{usd.format(total)}</span>
                      </div>
                      {leads.length === 0 ? (
                        <p className="stage-empty">Empty</p>
                      ) : (
                        <ul className="stage-leads">
                          {leads.map((l) => (
                            <li key={l.id}>
                              <button type="button" className="lead-card" onClick={() => setOpenLead(l.id)}>
                                <span className="lead-name">{l.name}</span>
                                <span className="lead-value">{usd.format(l.value)}</span>
                                <span className="lead-biz">{l.business}</span>
                                {l.stalled && <span className="lead-flag">Stalled</span>}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
            <p className="muted">
              Showing the {crm.leads.length} most recent of {crm.metrics.openOpportunities} opportunities. Every name and
              number is fictional.
            </p>
          </>
        )}
      </div>
    </aside>
  );
}

function LeadDetail({ lead }: { lead: Lead }) {
  const crm = useHq((s) => s.crm)!;
  const owner = useHq((s) => s.agents.find((a) => a.id === lead.ownerId));
  const setOpenLead = useHq((s) => s.setOpenLead);
  const openAgent = useHq((s) => s.openAgent);
  const stageIndex = crm.stages.findIndex((s) => s.id === lead.stage);

  return (
    <div className="lead-detail">
      <button type="button" className="link-btn" onClick={() => setOpenLead(null)}>← Back to the pipeline</button>
      <p className="lead-detail-biz">{lead.business} · {lead.industry}</p>

      {/* Where this lead sits in the pipeline */}
      <ol className="stage-track" aria-label="Pipeline stage">
        {crm.stages.map((s, i) => (
          <li key={s.id} className={i < stageIndex ? "is-past" : i === stageIndex ? "is-current" : ""} aria-current={i === stageIndex ? "step" : undefined}>
            <span className="stage-pip" aria-hidden="true" />
            <span>{s.name}</span>
          </li>
        ))}
      </ol>

      <dl className="lead-facts">
        <div><dt>Value</dt><dd>{usd.format(lead.value)}</dd></div>
        <div><dt>Source</dt><dd>{lead.source}</dd></div>
        <div>
          <dt>Handled by</dt>
          <dd>
            {owner ? (
              <button type="button" className="link-btn" onClick={() => openAgent(owner.id)}>{owner.name}, {owner.title}</button>
            ) : (
              "Unassigned"
            )}
          </dd>
        </div>
        <div><dt>Next</dt><dd>{lead.nextAction}</dd></div>
      </dl>

      <h3 className="panel-title panel-title-flush">History</h3>
      <ol className="activity-list">
        {lead.history.map((h, i) => (
          <li key={i}><time>{h.time}</time><span>{h.text}</span></li>
        ))}
      </ol>
    </div>
  );
}
