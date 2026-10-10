import type { AgentStatus } from "../types";

export const STATUS_LABEL: Record<AgentStatus, string> = {
  available: "Available",
  working: "Working",
  processing: "Processing",
  "waiting-approval": "Waiting for approval",
  offline: "Offline",
};

export function StatusDot({ status }: { status: AgentStatus }) {
  return <span className={`status-dot status-${status}`} aria-hidden="true" />;
}
