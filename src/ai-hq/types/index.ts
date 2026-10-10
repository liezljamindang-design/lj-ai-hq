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
  | "counter";

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
