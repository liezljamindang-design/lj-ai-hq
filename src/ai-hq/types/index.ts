export type ZoneId =
  | "reception"
  | "sales"
  | "automation"
  | "ai-lab"
  | "studio"
  | "operations"
  | "executive"
  | "meeting";

/** A room on the floor, measured in floor-grid units (x runs right, y runs toward the entrance). */
export interface Zone {
  id: ZoneId;
  /** Map key shown on the floor and in the directory. */
  key: number;
  name: string;
  /** Shorter name printed on the floor, where space is tight. */
  floorLabel?: string;
  summary: string;
  contains: string[];
  rect: { x: number; y: number; w: number; h: number };
}

export type AgentStatus =
  | "available"
  | "working"
  | "processing"
  | "waiting-approval"
  | "offline";

export interface Agent {
  id: string;
  name: string;
  title: string;
  department: string;
  zone: ZoneId;
  status: AgentStatus;
  description: string;
  responsibilities: string[];
  /** Where the employee stands on the floor, in floor units. */
  pos: { x: number; y: number };
  /** Headline numbers for today. Demo values. */
  metrics: { label: string; value: string }[];
  /** GoHighLevel features this role would use once real integrations exist. */
  wouldUse: string[];
  /** Workflow automations this role runs, each as a trigger and what follows it. */
  automations: AgentAutomation[];
}

export interface AgentAutomation {
  name: string;
  trigger: string;
  action: string;
}

export type TaskState = "done" | "in-progress" | "attention" | "waiting-approval";

export interface AgentTask {
  id: string;
  label: string;
  state: TaskState;
}

export interface ActivityEntry {
  id: string;
  time: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  from: "agent" | "visitor";
  text: string;
}

export type ThemeChoice = "light" | "dark";

export type FurnitureKind =
  | "desk"
  | "chair"
  | "plant"
  | "sofa"
  | "table"
  | "low-table"
  | "rack"
  | "kiosk"
  | "board"
  | "cabinet"
  | "counter"
  | "lamp";

/**
 * One object on the floor. The footprint (x, y, w, h in floor units) is used
 * both to draw it and, from Phase 3, as its collision boundary.
 */
export interface FurnitureItem {
  id: string;
  kind: FurnitureKind;
  zone: ZoneId;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Desks only: how many monitors sit on it. */
  monitors?: number;
}

/** A straight partition. Exactly one of the two axes is fixed. */
export interface WallSegment {
  id: string;
  /** "x" means the wall sits at x = at and runs along y; "y" is the reverse. */
  axis: "x" | "y";
  at: number;
  from: number;
  to: number;
  /** Height in screen pixels. */
  height: number;
}

export type StageId = "new" | "contacted" | "qualified" | "booked" | "closed";

export interface PipelineStage {
  id: StageId;
  name: string;
}

/** A fictional lead and its opportunity. */
export interface Lead {
  id: string;
  name: string;
  business: string;
  industry: string;
  source: string;
  stage: StageId;
  /** Opportunity value in US dollars. */
  value: number;
  /** Id of the AI employee currently responsible. */
  ownerId: string;
  nextAction: string;
  history: { time: string; text: string }[];
  /** True when the opportunity has sat in its stage too long. */
  stalled?: boolean;
}

export interface CrmMetrics {
  newLeads: number;
  qualifiedLeads: number;
  appointments: number;
  pipelineValue: number;
  followUpsRunning: number;
  /** Total open opportunities, of which the board shows the most recent. */
  openOpportunities: number;
}

export interface CrmSnapshot {
  metrics: CrmMetrics;
  stages: PipelineStage[];
  leads: Lead[];
}

export type WorkflowNodeKind = "trigger" | "action" | "ai" | "condition" | "end";
export type NodeRunState = "idle" | "active" | "done" | "skipped";

export interface WorkflowNode {
  id: string;
  kind: WorkflowNodeKind;
  title: string;
  summary: string;
  /** The GoHighLevel building block this step corresponds to. */
  ghl: string;
  /** AI employee responsible for the step, if any. */
  ownerId?: string;
  /** Column (0 = main path, 1 = branch) and row in the diagram. */
  col: 0 | 1;
  row: number;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface WorkflowRun {
  id: string;
  time: string;
  subject: string;
  result: "completed" | "waiting" | "failed";
  note: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  stats: { active: number; needsAttention: number };
  runs: WorkflowRun[];
}

/** One line in the global Live Activity feed. */
export interface ActivityEvent {
  id: string;
  time: string;
  text: string;
}

export type DemoStatus = "idle" | "running" | "completed";

/** An action an AI employee has prepared but may not take without a person's decision. */
export interface ApprovalRequest {
  id: string;
  agentId: string;
  action: string;
  reason: string;
  details: { label: string; value: string }[];
}

export type NotificationChannel = "email" | "slack";

/** A message telling a person that something is waiting for their decision. */
export interface ApprovalNotice {
  channel: NotificationChannel;
  /** Who or where it goes: an address, or a Slack channel. */
  to: string;
  /** Emails only. */
  subject?: string;
  body: string;
}
export type ApprovalDecision = "pending" | "approved" | "rejected";

/** A portfolio project shown on the Website & Funnel Studio monitors. */
export interface Project {
  id: string;
  name: string;
  industry: string;
  built: string[];
  technology: string[];
  /** Automation behind the build. Left out where it has not been written up yet. */
  automation?: string;
  /** Path or URL of a screenshot. A drawn placeholder is used when missing. */
  screenshot?: string;
  /** Link to the live website. Falls back to the portfolio. */
  url?: string;
  /** Link to the matching funnel, with its name. */
  funnelUrl?: string;
  funnelLabel?: string;
}

export type DashboardId = "crm" | "automation" | "demo" | "executive" | "projects" | "strategy" | "inquiry";

/** A real inquiry from a visitor who wants to work with Liezl. Unlike everything else in the HQ, this is not demo data. */
export interface LeadInquiry {
  firstName: string;
  lastName: string;
  email: string;
  services: string[];
  notes: string;
  /** Hidden field that only bots fill in. */
  website?: string;
}
