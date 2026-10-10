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
}

export type ThemeChoice = "light" | "dark";
