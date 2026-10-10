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

export interface ChatScript {
  /** Suggested question shown as a chip. */
  q: string;
  /** Words that route a typed question to this answer. */
  keywords: string[];
  a: string;
}

export const AGENT_GREETING: Record<string, string> = {
  sophia: "Hi, I'm Sophia. I greet every new lead, qualify them and book the appointment. What would you like to know?",
  olivia: "I'm Olivia. I keep the pipeline moving once a lead is qualified. Ask me how.",
  ava: "I'm Ava. I run the email and SMS campaigns that keep leads warm. What can I explain?",
  chloe: "I'm Chloe. I watch the workflows and flag anything that breaks. What would you like to see?",
  mia: "I'm Mia. I keep the executive's tasks, calendar and reports in order. How can I help?",
};

export const AGENT_SCRIPTS: Record<string, ChatScript[]> = {
  sophia: [
    {
      q: "How does your lead follow-up system work?",
      keywords: ["follow", "system", "work", "lead"],
      a: "When a new lead enters the CRM, I can respond immediately, gather qualification information, update the contact record, and route qualified opportunities into the correct pipeline.",
    },
    {
      q: "How do you qualify a lead?",
      keywords: ["qualify", "qualification", "questions"],
      a: "I ask a short set of questions the business chooses, such as service needed, timeline and budget. The answers are saved to custom fields on the contact, and a tag marks the lead as qualified or not.",
    },
    {
      q: "Can you book appointments?",
      keywords: ["book", "appointment", "calendar", "schedule"],
      a: "Yes. Once a lead qualifies I offer open times from the connected calendar, create the appointment, and the confirmation and reminder messages go out automatically.",
    },
    {
      q: "What happens after hours?",
      keywords: ["hours", "night", "weekend", "closed", "missed"],
      a: "I still reply. Missed calls get a text back within a minute, and new form submissions get an answer right away, so no lead waits until morning.",
    },
  ],
  olivia: [
    {
      q: "How do you manage the pipeline?",
      keywords: ["pipeline", "manage", "stage", "opportunit"],
      a: "Each qualified lead becomes an opportunity with a value and an owner. I move it between stages as things happen: contacted, qualified, appointment booked, closed. Every move can trigger the next follow-up.",
    },
    {
      q: "What happens to a stalled deal?",
      keywords: ["stall", "stuck", "cold", "no reply"],
      a: "If an opportunity sits in one stage too long, I flag it, restart a follow-up sequence, and create a task for a person to step in. Nothing sits forgotten.",
    },
    {
      q: "How do you hand off to a human?",
      keywords: ["human", "hand", "person", "team", "notify"],
      a: "I send an internal notification with the contact, the conversation summary and the suggested next step, then assign a task with a due date.",
    },
  ],
  ava: [
    {
      q: "How does lead nurturing work?",
      keywords: ["nurtur", "campaign", "email", "sequence", "drip"],
      a: "Leads who aren't ready yet enter a timed sequence of emails and texts. Each message waits for the right delay, and the sequence stops by itself the moment the lead replies or books.",
    },
    {
      q: "Do you handle SMS compliance?",
      keywords: ["sms", "text", "complian", "a2p", "10dlc", "opt"],
      a: "Texts in the US need A2P 10DLC brand and campaign registration before they send reliably. I only message contacts who opted in, and every text honors opt-out replies.",
    },
    {
      q: "What triggers a campaign?",
      keywords: ["trigger", "start", "when"],
      a: "A trigger is any event in the CRM: a form submitted, a tag added, an appointment booked, a pipeline stage changed. The workflow listens for it and starts the right messages.",
    },
  ],
  chloe: [
    {
      q: "What do you monitor?",
      keywords: ["monitor", "watch", "check", "track"],
      a: "Every active workflow, the tasks assigned to people, and anything that should have happened but didn't, like a reminder that never sent.",
    },
    {
      q: "What happens when a workflow fails?",
      keywords: ["fail", "error", "break", "broken", "alert"],
      a: "I raise an alert with the workflow name, the step that failed and the contacts affected. Fixing or re-running it is a person's decision, not mine.",
    },
    {
      q: "What goes in the daily summary?",
      keywords: ["summary", "report", "daily"],
      a: "New leads, appointments booked, opportunities moved, workflows that ran, and the short list of items that need a person today.",
    },
  ],
  mia: [
    {
      q: "What do you need approval for?",
      keywords: ["approv", "permission", "allow", "sensitive"],
      a: "Anything with real consequences: bulk messages, deleting records, changing automation settings, or moving high-value opportunities. I prepare the action and wait for a yes.",
    },
    {
      q: "How do you prepare reports?",
      keywords: ["report", "prepare", "brief", "summary"],
      a: "I pull the week's numbers from the CRM, compare them with last week, and write a short brief covering priorities, risks and next actions.",
    },
    {
      q: "How do you coordinate the team?",
      keywords: ["coordinat", "team", "others", "together"],
      a: "Sophia hands qualified leads to Olivia, Ava keeps the rest warm, and Chloe checks that every step ran. I keep the executive informed and collect the decisions that need a person.",
    },
  ],
};

export const CHAT_FALLBACK =
  "I can only answer a few scripted topics in this demo. Try one of the suggested questions below.";
