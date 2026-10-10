import type { ActivityEntry, AgentTask } from "../types";

/** Sample work for each AI employee. All names and numbers are fictional. */
export const AGENT_TASKS: Record<string, AgentTask[]> = {
  sophia: [
    { id: "s1", label: "Responded to website lead", state: "done" },
    { id: "s2", label: "Qualified Sarah M.", state: "done" },
    { id: "s3", label: "Appointment created for Thursday, 2:00 PM", state: "done" },
    { id: "s4", label: "Follow-up pending for two unanswered inquiries", state: "in-progress" },
    { id: "s5", label: "Reschedule offer to 3 no-shows", state: "waiting-approval" },
  ],
  olivia: [
    { id: "o1", label: "Pipeline updated", state: "done" },
    { id: "o2", label: "Opportunity created for Northgate Dental", state: "done" },
    { id: "o3", label: "Follow-up sequence running for 9 contacts", state: "in-progress" },
    { id: "o4", label: "Deal stalled 6 days: Harbor Roofing", state: "attention" },
  ],
  ava: [
    { id: "a1", label: "Welcome email series sent to new leads", state: "done" },
    { id: "a2", label: "Appointment reminder SMS scheduled", state: "done" },
    { id: "a3", label: "30-day nurture campaign running", state: "in-progress" },
    { id: "a4", label: "Reactivation campaign draft", state: "waiting-approval" },
  ],
  chloe: [
    { id: "c1", label: "18 workflows checked", state: "done" },
    { id: "c2", label: "Daily summary prepared", state: "done" },
    { id: "c3", label: "1 workflow needs attention: missed-call text back", state: "attention" },
    { id: "c4", label: "Tracking 27 open tasks", state: "in-progress" },
  ],
  mia: [
    { id: "m1", label: "Weekly pipeline report prepared", state: "done" },
    { id: "m2", label: "Strategy call scheduled for Friday", state: "done" },
    { id: "m3", label: "Organizing next week's priorities", state: "in-progress" },
    { id: "m4", label: "Send follow-up campaign to 124 contacts", state: "waiting-approval" },
  ],
};

export const AGENT_ACTIVITY: Record<string, ActivityEntry[]> = {
  sophia: [
    { id: "s1", time: "12:46 PM", text: "Booked an appointment for Sarah M." },
    { id: "s2", time: "12:43 PM", text: "Updated the contact record with qualification answers" },
    { id: "s3", time: "12:42 PM", text: "Started qualifying a new website lead" },
    { id: "s4", time: "11:58 AM", text: "Answered a pricing question by chat" },
  ],
  olivia: [
    { id: "o1", time: "12:45 PM", text: "Moved Sarah M. to Qualified" },
    { id: "o2", time: "12:44 PM", text: "Created an opportunity worth $2,400" },
    { id: "o3", time: "11:20 AM", text: "Flagged Harbor Roofing as stalled" },
    { id: "o4", time: "10:05 AM", text: "Started a follow-up sequence for 9 contacts" },
  ],
  ava: [
    { id: "a1", time: "12:46 PM", text: "Triggered the appointment follow-up workflow" },
    { id: "a2", time: "11:30 AM", text: "Sent the welcome series to 12 new leads" },
    { id: "a3", time: "9:15 AM", text: "Scheduled reminder texts for tomorrow's appointments" },
  ],
  chloe: [
    { id: "c1", time: "12:47 PM", text: "Verified the new-lead workflow ran end to end" },
    { id: "c2", time: "12:10 PM", text: "Raised an alert: missed-call text back failed twice" },
    { id: "c3", time: "9:00 AM", text: "Sent the daily operations summary" },
  ],
  mia: [
    { id: "m1", time: "12:30 PM", text: "Requested approval for a 124-contact campaign" },
    { id: "m2", time: "11:05 AM", text: "Scheduled Friday's strategy call" },
    { id: "m3", time: "9:30 AM", text: "Delivered the weekly pipeline report" },
  ],
};
