import { useState } from "react";
import { services } from "../services";
import { clockTime } from "../services/mockActivityService";
import { useHq } from "../store/hqStore";
import type { Agent, ApprovalRequest } from "../types";

let approvalEvent = 0;

/**
 * A simulated human-approval request, with the email and Slack notices that
 * would tell the owner about it. Approve and Reject only change what this
 * demo shows; no message is sent. In a live system these buttons would call a
 * backend that releases or cancels the queued action.
 */
export function ApprovalCard({ request, agent }: { request: ApprovalRequest; agent: Agent }) {
  const decision = useHq((s) => s.approvals[request.id] ?? "pending");
  const decideApproval = useHq((s) => s.decideApproval);
  const [showDetails, setShowDetails] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const notices = services.notifications.approvalNotices(request, agent);
  const channels = notices.map((n) => (n.channel === "email" ? `email to ${n.to}` : `Slack ${n.to}`)).join(" and ");

  function decide(next: "approved" | "rejected") {
    decideApproval(request.id, next);
    useHq.setState((s) => ({
      agents: s.agents.map((a) => (a.id === agent.id ? { ...a, status: next === "approved" ? "working" : "available" } : a)),
      activity: [
        { id: `demo-approval-${++approvalEvent}`, time: clockTime(), text: `Decision confirmed by email and Slack (simulated)` },
        { id: `demo-approval-${++approvalEvent}`, time: clockTime(), text: `${agent.name}'s campaign request was ${next}` },
        ...s.activity,
      ],
    }));
  }

  return (
    <section className={`approval approval-${decision}`} aria-label={`Approval request from ${agent.name}`}>
      <p className="eyebrow">{agent.name} AI · {decision === "pending" ? "Requesting approval" : decision === "approved" ? "Approved" : "Rejected"}</p>
      <p className="approval-action"><span>Action:</span> {request.action}</p>

      {decision === "pending" && <p className="muted">{request.reason}</p>}
      {decision === "approved" && <p className="muted">In a live system the campaign would now send. This is a simulation, so nothing was sent.</p>}
      {decision === "rejected" && <p className="muted">{agent.name} cancelled the campaign. Nothing was sent.</p>}

      <p className="approval-notified">
        <span aria-hidden="true">✉</span> Owner notified by {channels}. <em>Simulated: no message was sent.</em>
      </p>

      {showNotices && (
        <div className="notices">
          {notices.map((n) => (
            <figure key={n.channel} className={`notice notice-${n.channel}`}>
              <figcaption>
                <strong>{n.channel === "email" ? "Email" : "Slack"}</strong> to {n.to}
              </figcaption>
              {n.subject && <p className="notice-subject">{n.subject}</p>}
              <p className="notice-body">{n.body}</p>
            </figure>
          ))}
        </div>
      )}

      {showDetails && (
        <dl className="lead-facts">
          {request.details.map((d) => (
            <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>
          ))}
        </dl>
      )}

      <div className="approval-buttons">
        {decision === "pending" && (
          <>
            <button type="button" className="btn-primary" onClick={() => decide("approved")}>Approve</button>
            <button type="button" className="btn-secondary" onClick={() => decide("rejected")}>Reject</button>
          </>
        )}
        <button type="button" className="link-btn" aria-expanded={showDetails} onClick={() => setShowDetails((v) => !v)}>
          {showDetails ? "Hide details" : "View details"}
        </button>
        <button type="button" className="link-btn" aria-expanded={showNotices} onClick={() => setShowNotices((v) => !v)}>
          {showNotices ? "Hide notifications" : "View notifications"}
        </button>
      </div>
    </section>
  );
}
