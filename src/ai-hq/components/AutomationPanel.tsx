import { useEffect, useRef, useState } from "react";
import { useHq } from "../store/hqStore";
import { WorkflowDiagram } from "./WorkflowDiagram";

const RESULT_LABEL = { completed: "Completed", waiting: "Waiting", failed: "Failed" } as const;

/** Automation Lab: one workflow drawn as connected steps, with what each step maps to in GoHighLevel. */
export function AutomationPanel({ onRetry }: { onRetry: () => void }) {
  const workflow = useHq((s) => s.workflow);
  const state = useHq((s) => s.workflowState);
  const nodeStates = useHq((s) => s.nodeStates);
  const close = useHq((s) => s.closeDashboard);
  const openAgent = useHq((s) => s.openAgent);
  const agents = useHq((s) => s.agents);
  const [selectedId, setSelectedId] = useState<string | null>("form");
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => { panelRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !useHq.getState().helpOpen) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const node = workflow?.nodes.find((n) => n.id === selectedId);
  const owner = agents.find((a) => a.id === node?.ownerId);

  return (
    <aside className="side-panel" ref={panelRef} tabIndex={-1} aria-labelledby="automation-title">
      <header className="panel-head">
        <div>
          <p className="eyebrow">Demo data</p>
          <h2 id="automation-title">Automation Lab</h2>
        </div>
        <button type="button" className="icon-btn" onClick={close} aria-label="Close the Automation Lab">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </header>

      <div className="panel-scroll">
        {state === "loading" && <p className="muted">Loading the workflow…</p>}
        {state === "error" && (
          <p className="muted">
            The workflow didn't load.{" "}
            <button type="button" className="link-btn" onClick={onRetry}>Try again</button>
          </p>
        )}

        {state === "ready" && workflow && (
          <>
            <p className="flow-status">
              <strong>{workflow.name}</strong>
              <span>{workflow.stats.active} workflows active · {workflow.stats.needsAttention} needs attention</span>
            </p>

            <WorkflowDiagram workflow={workflow} states={nodeStates} selectedId={selectedId} onSelect={setSelectedId} />

            {node && (
              <div className="node-detail" aria-live="polite">
                <h3>{node.title}</h3>
                <p>{node.summary}</p>
                <dl className="lead-facts">
                  <div><dt>In GoHighLevel</dt><dd>{node.ghl}</dd></div>
                  {owner && (
                    <div>
                      <dt>Handled by</dt>
                      <dd>
                        <button type="button" className="link-btn" onClick={() => openAgent(owner.id)}>{owner.name}, {owner.title}</button>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            <h3 className="panel-title panel-title-flush">Recent runs</h3>
            {workflow.runs.length === 0 ? (
              <p className="muted">No runs yet.</p>
            ) : (
              <ul className="run-list">
                {workflow.runs.map((r) => (
                  <li key={r.id} className={`run run-result-${r.result}`}>
                    <time>{r.time}</time>
                    <span className="run-subject">{r.subject}</span>
                    <span className="run-result">{RESULT_LABEL[r.result]}</span>
                    <span className="run-note">{r.note}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="muted">An original diagram for this portfolio. Step names follow how GoHighLevel workflows are built.</p>
          </>
        )}
      </div>
    </aside>
  );
}
