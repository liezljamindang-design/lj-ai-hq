import type { NotificationService } from "./types";

/** Fictional recipients. A live build reads the real ones from server-side settings. */
const OWNER_EMAIL = "owner@example.com";
const SLACK_CHANNEL = "#approvals";

/**
 * Demo implementation: writes the email and the Slack message an approval
 * request would produce, so the HQ can show them. It sends nothing.
 */
export const mockNotificationService: NotificationService = {
  approvalNotices(request, agent) {
    const facts = request.details.map((d) => `${d.label}: ${d.value}`).join("\n");
    return [
      {
        channel: "email",
        to: OWNER_EMAIL,
        subject: `Approval needed: ${request.action.replace(/\.$/, "")}`,
        body: `${agent.name} (${agent.title}) has prepared an action and is waiting for your decision.\n\nAction: ${request.action}\nWhy it needs you: ${request.reason}\n\n${facts}\n\nApprove or reject it in AI Headquarters. Nothing is sent until you approve.`,
      },
      {
        channel: "slack",
        to: SLACK_CHANNEL,
        body: `${agent.name} AI is requesting approval\n${request.action}\n${request.reason}\n[ Approve ]  [ Reject ]  [ View details ]`,
      },
    ];
  },
};
