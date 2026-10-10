import type { AgentStatus, CrmSnapshot, Lead, NodeRunState } from "../types";

export const DEMO_LEAD_ID = "lead-demo";

/** The fictional lead who travels through the HQ during the demo. */
export const DEMO_LEAD: Lead = {
  id: DEMO_LEAD_ID,
  name: "Maya K.",
  business: "Solace Wellness Studio",
  industry: "Wellness",
  source: "Website form",
  stage: "new",
  value: 2600,
  ownerId: "sophia",
  nextAction: "Sophia is sending the first reply.",
  history: [],
};

export interface DemoStep {
  title: string;
  /** Where the lead marker goes: the entrance, or the employee now holding the lead. */
  at: "entrance" | string;
  agents?: Record<string, AgentStatus>;
  nodes?: Record<string, NodeRunState>;
  /** Lines added to Live Activity. */
  feed: string[];
  /** Changes to the CRM. Receives a private copy, so it may edit it directly. */
  crm?: (crm: CrmSnapshot, lead: Lead, time: string) => void;
}

const note = (lead: Lead, time: string, text: string) => lead.history.unshift({ time, text });

/**
 * The lead journey, one step every couple of seconds. This is the single place
 * that describes the demo: the office, CRM, workflow and feed all read from the
 * state these steps write.
 */
export const DEMO_STEPS: DemoStep[] = [
  {
    title: "New website lead arrives",
    at: "entrance",
    nodes: { form: "active" },
    feed: ["New lead received: Maya K., website form"],
    crm: (crm, lead, time) => {
      crm.metrics.newLeads += 1;
      note(lead, time, "Submitted the website form");
    },
  },
  {
    title: "Sophia receives the lead",
    at: "sophia",
    agents: { sophia: "working" },
    nodes: { form: "done", contact: "active" },
    feed: ["Contact created", "Sophia AI replied in 4 seconds"],
    crm: (_crm, lead, time) => {
      lead.stage = "contacted";
      lead.nextAction = "Sophia is asking the qualifying questions.";
      note(lead, time, "Contact created, first reply sent by Sophia");
    },
  },
  {
    title: "Sophia starts AI qualification",
    at: "sophia",
    agents: { sophia: "processing" },
    nodes: { contact: "done", qualify: "active" },
    feed: ["Sophia AI started qualification"],
    crm: (_crm, lead, time) => note(lead, time, "Qualification started"),
  },
  {
    title: "Contact record is updated",
    at: "sophia",
    nodes: { qualify: "done", condition: "active" },
    feed: ["Contact updated with qualification answers"],
    crm: (_crm, lead, time) => note(lead, time, "Answers saved: service, timeline, budget"),
  },
  {
    title: "Olivia receives the qualified opportunity",
    at: "olivia",
    agents: { sophia: "available", olivia: "processing" },
    nodes: { condition: "done", nurture: "skipped", opportunity: "active" },
    feed: ["Lead qualified", "Opportunity created: $2,600"],
    crm: (crm, lead, time) => {
      crm.metrics.qualifiedLeads += 1;
      crm.metrics.openOpportunities += 1;
      crm.metrics.pipelineValue += lead.value;
      lead.ownerId = "olivia";
      lead.nextAction = "Olivia is placing the opportunity in the pipeline.";
      note(lead, time, "Opportunity created, handed to Olivia");
    },
  },
  {
    title: "Opportunity moves through the pipeline",
    at: "olivia",
    agents: { olivia: "working" },
    nodes: { opportunity: "done", calendar: "active" },
    feed: ["Pipeline moved to Qualified"],
    crm: (_crm, lead, time) => {
      lead.stage = "qualified";
      lead.nextAction = "Olivia is offering appointment times.";
      note(lead, time, "Moved to Qualified");
    },
  },
  {
    title: "Appointment gets booked",
    at: "olivia",
    feed: ["Appointment booked: Tuesday, 10:00 AM", "Pipeline moved to Appointment Booked"],
    crm: (crm, lead, time) => {
      crm.metrics.appointments += 1;
      lead.stage = "booked";
      lead.nextAction = "Appointment Tuesday, 10:00 AM. Confirmation on its way.";
      note(lead, time, "Appointment booked for Tuesday, 10:00 AM");
    },
  },
  {
    title: "Follow-up automation starts",
    at: "ava",
    agents: { ava: "processing" },
    nodes: { calendar: "done", followup: "active" },
    feed: ["Follow-up workflow triggered", "Confirmation email and reminder text scheduled"],
    crm: (crm, lead, time) => {
      crm.metrics.followUpsRunning += 1;
      lead.nextAction = "Reminder text sends the day before the appointment.";
      note(lead, time, "Confirmation sent, reminder scheduled");
    },
  },
  {
    title: "Chloe verifies the workflow ran",
    at: "chloe",
    agents: { ava: "working", chloe: "working" },
    nodes: { followup: "done" },
    feed: ["Chloe verified every workflow step completed"],
    crm: (_crm, lead, time) => note(lead, time, "Workflow run verified by Chloe"),
  },
];

/** Milliseconds between steps. Slow enough to read each one. */
export const STEP_MS = 2200;
