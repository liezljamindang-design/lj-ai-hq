import type { WorkflowDefinition } from "../types";

/** The lead-intake workflow shown in the Automation Lab. Demo data. */
export const WORKFLOW_SEED: WorkflowDefinition = {
  id: "new-lead-intake",
  name: "New lead intake",
  stats: { active: 18, needsAttention: 1 },
  nodes: [
    {
      id: "form", kind: "trigger", title: "Form submitted", col: 0, row: 0,
      summary: "A visitor submits a website or funnel form. This starts the workflow.",
      ghl: "Workflow trigger: Form Submitted",
    },
    {
      id: "contact", kind: "action", title: "Create contact", col: 0, row: 1,
      summary: "The lead is saved as a contact, or matched to an existing one, with the form answers in custom fields.",
      ghl: "Action: Create or Update Contact",
      ownerId: "sophia",
    },
    {
      id: "qualify", kind: "ai", title: "AI qualification", col: 0, row: 2,
      summary: "Sophia replies within seconds and asks the qualifying questions the business chose.",
      ghl: "Conversation AI or Voice AI agent",
      ownerId: "sophia",
    },
    {
      id: "condition", kind: "condition", title: "Qualified?", col: 0, row: 3,
      summary: "The workflow checks the answers and takes one of two paths.",
      ghl: "If/Else condition on a tag or custom field",
    },
    {
      id: "opportunity", kind: "action", title: "Create opportunity", col: 0, row: 4,
      summary: "A qualified lead becomes an opportunity in the pipeline, with a value and an owner.",
      ghl: "Action: Create or Update Opportunity",
      ownerId: "olivia",
    },
    {
      id: "nurture", kind: "end", title: "Nurture", col: 1, row: 4,
      summary: "A lead who isn't ready yet enters a timed email and SMS sequence instead of being dropped.",
      ghl: "Action: Add to Workflow (nurture sequence)",
      ownerId: "ava",
    },
    {
      id: "calendar", kind: "action", title: "Book appointment", col: 0, row: 5,
      summary: "The lead picks an open time, the appointment is created and the pipeline stage updates.",
      ghl: "Calendar booking and Appointment Status trigger",
      ownerId: "olivia",
    },
    {
      id: "followup", kind: "end", title: "Follow-up", col: 0, row: 6,
      summary: "Confirmation and reminder messages go out, and Chloe checks that every step ran.",
      ghl: "Email and SMS actions with wait steps",
      ownerId: "ava",
    },
  ],
  edges: [
    { from: "form", to: "contact" },
    { from: "contact", to: "qualify" },
    { from: "qualify", to: "condition" },
    { from: "condition", to: "opportunity", label: "Qualified" },
    { from: "condition", to: "nurture", label: "Not qualified" },
    { from: "opportunity", to: "calendar" },
    { from: "calendar", to: "followup" },
  ],
  runs: [
    { id: "r1", time: "12:46 PM", subject: "Sarah M.", result: "completed", note: "Qualified path, appointment booked" },
    { id: "r2", time: "11:51 AM", subject: "Priya N.", result: "waiting", note: "Waiting at AI qualification for a reply" },
    { id: "r3", time: "10:12 AM", subject: "Kevin D.", result: "completed", note: "Not qualified, moved to nurture" },
  ],
};
