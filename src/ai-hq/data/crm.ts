import type { CrmSnapshot } from "../types";

/** Fictional CRM data. No real people, businesses or figures. */
export const CRM_SEED: CrmSnapshot = {
  metrics: {
    newLeads: 14,
    qualifiedLeads: 8,
    appointments: 5,
    pipelineValue: 48200,
    followUpsRunning: 9,
    openOpportunities: 23,
  },
  stages: [
    { id: "new", name: "New Lead" },
    { id: "contacted", name: "Contacted" },
    { id: "qualified", name: "Qualified" },
    { id: "booked", name: "Appointment Booked" },
    { id: "closed", name: "Closed" },
  ],
  leads: [
    {
      id: "lead-daniel", name: "Daniel R.", business: "Brightside HVAC", industry: "HVAC",
      source: "Website form", stage: "new", value: 1800, ownerId: "sophia",
      nextAction: "Sophia is sending the first reply.",
      history: [{ time: "12:31 PM", text: "Submitted the free estimate form" }],
    },
    {
      id: "lead-priya", name: "Priya N.", business: "Lotus Med Spa", industry: "Med spa",
      source: "Facebook ad", stage: "new", value: 3200, ownerId: "sophia",
      nextAction: "Waiting for a reply to the welcome text.",
      history: [
        { time: "11:52 AM", text: "Welcome text sent" },
        { time: "11:51 AM", text: "Lead captured from a Facebook lead form" },
      ],
    },
    {
      id: "lead-marcus", name: "Marcus T.", business: "Tidewater Plumbing", industry: "Plumbing",
      source: "Missed call text back", stage: "contacted", value: 950, ownerId: "sophia",
      nextAction: "Qualification questions in progress.",
      history: [
        { time: "10:40 AM", text: "Replied to the text back" },
        { time: "10:38 AM", text: "Missed call, automatic text sent" },
      ],
    },
    {
      id: "lead-elena", name: "Elena V.", business: "Verde Landscaping", industry: "Landscaping",
      source: "Website chat", stage: "contacted", value: 2100, ownerId: "ava",
      nextAction: "Day 2 nurture email goes out tomorrow.",
      history: [
        { time: "Yesterday", text: "Entered the 30-day nurture campaign" },
        { time: "Yesterday", text: "Asked about seasonal packages by chat" },
      ],
    },
    {
      id: "lead-sarah", name: "Sarah M.", business: "Northgate Dental", industry: "Dental",
      source: "Website form", stage: "qualified", value: 2400, ownerId: "olivia",
      nextAction: "Olivia is offering appointment times.",
      history: [
        { time: "12:45 PM", text: "Moved to Qualified" },
        { time: "12:44 PM", text: "Opportunity created" },
        { time: "12:42 PM", text: "Qualification started by Sophia" },
      ],
    },
    {
      id: "lead-james", name: "James O.", business: "Harbor Roofing", industry: "Roofing",
      source: "Roof inspection funnel", stage: "qualified", value: 7500, ownerId: "olivia", stalled: true,
      nextAction: "Stalled for 6 days. Follow-up sequence restarted, task assigned to a person.",
      history: [
        { time: "11:20 AM", text: "Flagged as stalled" },
        { time: "6 days ago", text: "Moved to Qualified" },
      ],
    },
    {
      id: "lead-aiko", name: "Aiko S.", business: "Petal & Stem Florist", industry: "Florist",
      source: "Booking funnel", stage: "booked", value: 1200, ownerId: "olivia",
      nextAction: "Appointment Thursday, 2:00 PM. Reminder text scheduled.",
      history: [
        { time: "9:15 AM", text: "Reminder text scheduled" },
        { time: "Yesterday", text: "Appointment booked" },
      ],
    },
    {
      id: "lead-tom", name: "Tom B.", business: "Summit Auto Detailing", industry: "Automotive",
      source: "Service booking funnel", stage: "booked", value: 1650, ownerId: "olivia",
      nextAction: "Appointment Friday, 10:30 AM.",
      history: [{ time: "Yesterday", text: "Appointment booked from the booking funnel" }],
    },
    {
      id: "lead-grace", name: "Grace L.", business: "Corner Cup Coffee", industry: "Coffee shop",
      source: "Table reservation funnel", stage: "closed", value: 2900, ownerId: "olivia",
      nextAction: "Won. Review request sends in 3 days.",
      history: [
        { time: "Monday", text: "Marked as won" },
        { time: "Last week", text: "Appointment completed" },
      ],
    },
  ],
};
