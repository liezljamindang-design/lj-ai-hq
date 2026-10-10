import type { ApprovalRequest } from "../types";

/**
 * Simulated approval requests. In a live system these would come from the
 * backend, and Approve would release a queued action there. Here nothing is sent.
 */
export const APPROVALS: ApprovalRequest[] = [
  {
    id: "appr-campaign",
    agentId: "mia",
    action: "Send follow-up campaign to 124 contacts.",
    reason: "Bulk messages need a person's approval before they send.",
    details: [
      { label: "Audience", value: "124 contacts tagged Past Client, opted in to SMS and email" },
      { label: "Message", value: "A seasonal check-in with a booking link" },
      { label: "Channels", value: "Email first, SMS two days later if unopened" },
      { label: "Prepared by", value: "Ava, reviewed by Mia" },
    ],
  },
];
