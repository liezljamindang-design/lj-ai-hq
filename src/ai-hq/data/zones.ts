import type { Zone } from "../types";

/** Floor is 12 units wide and 10 deep. The entrance is on the front edge (y = 10). */
export const FLOOR = { width: 12, depth: 10 };

export const ZONES: Zone[] = [
  {
    id: "reception",
    key: 1,
    name: "Reception",
    summary: "Where every new lead is greeted, qualified and booked.",
    contains: ["Reception desk", "Visitor terminal", "Lounge"],
    rect: { x: 4.5, y: 7, w: 7.5, h: 3 },
  },
  {
    id: "sales",
    key: 2,
    name: "Sales & CRM",
    summary: "Pipeline, opportunities and follow-up, all in one view.",
    contains: ["CRM monitors", "Pipeline board", "Lead activity"],
    rect: { x: 0, y: 3.5, w: 4, h: 3 },
  },
  {
    id: "automation",
    key: 3,
    name: "Automation Lab",
    summary: "Workflows drawn as triggers, conditions and actions.",
    contains: ["Workflow wall", "Trigger and action nodes", "System activity"],
    rect: { x: 9, y: 0, w: 3, h: 3 },
  },
  {
    id: "ai-lab",
    key: 4,
    name: "AI Lab",
    summary: "Conversation AI and Voice AI agents at work.",
    contains: ["Agent workstations", "Conversation activity", "Voice AI indicators"],
    rect: { x: 6, y: 0, w: 3, h: 3 },
  },
  {
    id: "studio",
    key: 5,
    name: "Website & Funnel Studio",
    floorLabel: "Web & Funnel Studio",
    summary: "Websites and funnels built in GoHighLevel.",
    contains: ["Website previews", "Funnel mockups", "Project boards"],
    rect: { x: 0, y: 7, w: 4, h: 3 },
  },
  {
    id: "operations",
    key: 6,
    name: "Operations",
    summary: "Tasks, alerts and workflow health.",
    contains: ["Task board", "Alerts", "Workflow monitoring"],
    rect: { x: 8, y: 3.5, w: 4, h: 3 },
  },
  {
    id: "executive",
    key: 7,
    name: "Executive Office",
    summary: "Liezl Jamindang, GoHighLevel Specialist.",
    contains: ["About", "Experience", "CV", "Contact"],
    rect: { x: 0, y: 0, w: 3, h: 3 },
  },
  {
    id: "meeting",
    key: 8,
    name: "Meeting Room",
    summary: "The AI Automation Strategy Room.",
    contains: ["Glass meeting room", "Strategy display"],
    rect: { x: 3, y: 0, w: 3, h: 3 },
  },
];
