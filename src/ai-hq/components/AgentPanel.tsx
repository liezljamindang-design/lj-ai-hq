import { useEffect, useRef, useState } from "react";
import { useAgentDetail } from "../hooks/useAgentDetail";
import { useHq } from "../store/hqStore";
import type { Agent, TaskState } from "../types";
import { APPROVALS } from "../data/approvals";
import { AgentChat } from "./AgentChat";
import { ApprovalCard } from "./ApprovalCard";
import { StatusDot, STATUS_LABEL } from "./StatusDot";

const TABS = ["Chat", "Tasks", "Activity", "Capabilities"] as const;
type Tab = (typeof TABS)[number];

const TASK_MARK: Record<TaskState, { mark: string; label: string }> = {
  done: { mark: "✓", label: "Done" },
  "in-progress": { mark: "•", label: "In progress" },
  attention: { mark: "!", label: "Needs attention" },
  "waiting-approval": { mark: "⏸", label: "Waiting for approval" },
};

/** Side panel for one AI employee. A column on desktop, a full-screen card on phones. */
export function AgentPanel({ agent }: { agent: Agent }) {
  const closeAgent = useHq((s) => s.closeAgent);
  const [tab, setTab] = useState<Tab>("Chat");
  const { state, tasks, activity, retry } = useAgentDetail(agent.id);
  const panelRef = useRef<HTMLElement>(null);

  // Move focus into the panel when it opens or switches to another employee.
  useEffect(() => {
    setTab("Chat");
    panelRef.current?.focus();
  }, [agent.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !useHq.getState().helpOpen) closeAgent();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAgent]);

  const detailFallback =
    state === "loading" ? (
      <p className="muted">Loading…</p>
    ) : state === "error" ? (
      <p className="muted">
        This didn't load.{" "}
        <button type="button" className="link-btn" onClick={retry}>Try again</button>
      </p>
    ) : null;

  return (
    <aside className="side-panel" ref={panelRef} tabIndex={-1} aria-labelledby="agent-panel-name">
      <header className="agent-head">
        <span className="agent-avatar agent-avatar-lg" aria-hidden="true">{agent.name[0]}</span>
        <div className="agent-head-id">
          <h2 id="agent-panel-name">{agent.name}</h2>
          <p>{agent.title} · {agent.department}</p>
          <p className="agent-status"><StatusDot status={agent.status} />{STATUS_LABEL[agent.status]}</p>
        </div>
        <button type="button" className="icon-btn" onClick={closeAgent} aria-label={`Close ${agent.name}'s panel`}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </header>

      <p className="agent-desc">{agent.description}</p>

      {APPROVALS.filter((r) => r.agentId === agent.id).map((r) => (
        <ApprovalCard key={r.id} request={r} agent={agent} />
      ))}

      <dl className="agent-metrics" aria-label="Today">
        {agent.metrics.map((m) => (
          <div key={m.label}>
            <dd>{m.value}</dd>
            <dt>{m.label}</dt>
          </div>
        ))}
      </dl>

      <div className="tabs" role="tablist" aria-label={`${agent.name} details`}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls="agent-tabpanel"
            className={tab === t ? "is-active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tabpanel" id="agent-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === "Chat" && <AgentChat agent={agent} />}

        {tab === "Tasks" &&
          (detailFallback ??
            (tasks.length === 0 ? (
              <p className="muted">No tasks yet.</p>
            ) : (
              <ul className="task-list">
                {tasks.map((t) => (
                  <li key={t.id} className={`task task-${t.state}`}>
                    <span className="task-mark" aria-hidden="true">{TASK_MARK[t.state].mark}</span>
                    <span className="task-label">{t.label}</span>
                    <span className="task-state">{TASK_MARK[t.state].label}</span>
                  </li>
                ))}
              </ul>
            )))}

        {tab === "Activity" &&
          (detailFallback ??
            (activity.length === 0 ? (
              <p className="muted">No activity yet.</p>
            ) : (
              <ol className="activity-list">
                {activity.map((a) => (
                  <li key={a.id}>
                    <time>{a.time}</time>
                    <span>{a.text}</span>
                  </li>
                ))}
              </ol>
            )))}

        {tab === "Capabilities" && (
          <div className="caps">
            <h3>What {agent.name} does</h3>
            <ul className="caps-list">
              {agent.responsibilities.map((r) => <li key={r}>{r}</li>)}
            </ul>
            <h3>GoHighLevel features this role would use</h3>
            <ul className="tag-list">
              {agent.wouldUse.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <p className="muted">Not connected in this demo. The service layer is ready for it.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
