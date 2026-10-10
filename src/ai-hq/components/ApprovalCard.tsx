import { useState } from "react";
import { clockTime } from "../services/mockActivityService";
import { useHq } from "../store/hqStore";
import type { Agent, ApprovalRequest } from "../types";

let approvalEvent = 0;

/**
 * A simulated human-approval request. Approve and Reject only change what this
 * demo shows; no message is sent. In a live system these buttons would call a
 * backend that releases or cancels the queued action.
 */
export function ApprovalCard({ request, agent }: { request: ApprovalRequest; agent: Agent }) {
  const decision = useHq((s) => s.approvals[request.id] ?? "pending");
  const decideApproval = useHq((s) => s.decideApproval);
  const [showDetails, setShowDetails] = useState(false);

  function decide(next: "approved" | "rejected") {
    decideApproval(request.id, next);
    useHq.setState((s) => ({
      agents: s.agents.map((a) => (a.id === agent.id ? { ...a, status: next === "approved" ? "working" : "available" } : a)),
      activity: [
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
      </div>
    </section>
  );
}
