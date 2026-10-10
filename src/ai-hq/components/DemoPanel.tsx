import { useEffect, useRef } from "react";
import { resetDemo, startDemo } from "../demo/runner";
import { DEMO_LEAD_ID, DEMO_STEPS } from "../demo/script";
import { useHq } from "../store/hqStore";
import { ActivityFeed } from "./ActivityFeed";

/** Follows the live demo: the nine steps, where the lead sits in the pipeline, and the activity feed. */
export function DemoPanel({ onRetryActivity }: { onRetryActivity: () => void }) {
  const demo = useHq((s) => s.demo);
  const crm = useHq((s) => s.crm);
  const close = useHq((s) => s.closeDashboard);
  const openCrm = useHq((s) => s.openCrm);
  const openAutomation = useHq((s) => s.openAutomation);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => { panelRef.current?.focus({ preventScroll: true }); }, []); // keep the office in view on phones
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !useHq.getState().helpOpen) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const lead = crm?.leads.find((l) => l.id === DEMO_LEAD_ID);
  const stageIndex = lead && crm ? crm.stages.findIndex((s) => s.id === lead.stage) : -1;

  return (
    <aside className="side-panel side-panel-inline" ref={panelRef} tabIndex={-1} aria-labelledby="demo-title">
      <header className="panel-head">
        <div>
          <p className="eyebrow">Simulation</p>
          <h2 id="demo-title">Live demo</h2>
        </div>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close the demo panel">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </header>

      <div className="panel-scroll">
        <p className="demo-state" role="status">
          {demo.status === "idle" && (demo.wasReset ? "Demo reset. Everything is back to how it was." : "One fictional lead, from first inquiry to booked appointment.")}
          {demo.status === "running" && `Maya K. is moving through the system. Step ${Math.max(1, demo.step + 1)} of ${DEMO_STEPS.length}.`}
          {demo.status === "completed" && "Demo complete. Maya K. was answered, qualified, booked and followed up without anyone lifting a finger."}
        </p>

        {demo.status === "idle" && (
          <button type="button" className="btn-primary demo-run" onClick={() => startDemo()}>Run live demo</button>
        )}
        {demo.status === "completed" && (
          <div className="demo-actions">
            <button type="button" className="btn-secondary" onClick={() => openCrm(DEMO_LEAD_ID)}>See Maya in the CRM</button>
            <button type="button" className="btn-secondary" onClick={openAutomation}>See the workflow</button>
            <button type="button" className="link-btn" onClick={resetDemo}>Reset demo</button>
          </div>
        )}

        {lead && crm && (
          <div className="demo-track" aria-label={`Maya K. is at ${crm.stages[stageIndex]?.name}`}>
            {crm.stages.map((s, i) => (
              <span key={s.id} className={i < stageIndex ? "is-past" : i === stageIndex ? "is-current" : ""}>
                <i aria-hidden="true" />
                {s.name}
              </span>
            ))}
          </div>
        )}

        <ol className="demo-steps">
          {DEMO_STEPS.map((step, i) => {
            const state = demo.status === "completed" || i < demo.step ? "done" : i === demo.step ? "current" : "todo";
            return (
              <li key={step.title} className={`demo-step is-${state}`} aria-current={state === "current" ? "step" : undefined}>
                <span className="demo-step-n" aria-hidden="true">{state === "done" ? "✓" : i + 1}</span>
                <span>{step.title}</span>
              </li>
            );
          })}
        </ol>

        <h3 className="panel-title panel-title-flush">Live activity</h3>
        <ActivityFeed limit={12} onRetry={onRetryActivity} />
      </div>
    </aside>
  );
}
