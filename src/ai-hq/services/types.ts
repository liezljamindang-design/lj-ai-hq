import type {
  ActivityEntry, ActivityEvent, Agent, AgentTask, ApprovalNotice, ApprovalRequest, ChatMessage, CrmSnapshot, LeadInquiry,
  WorkflowDefinition,
} from "../types";

/**
 * Service contracts. The UI talks only to these interfaces.
 * V1 uses the mock implementations. A future build swaps in versions that call
 * a secure server-side endpoint (never GoHighLevel, an AI API or n8n directly
 * from the browser), and no component has to change.
 *
 * calendarService is added when real calendar access is.
 */
/** "en" is the default. "tl" (Taglish) is used when the visitor writes in Tagalog. */
export type ChatLanguage = "en" | "tl";

export interface AgentService {
  listAgents(): Promise<Agent[]>;
  getTasks(agentId: string): Promise<AgentTask[]>;
  getActivity(agentId: string): Promise<ActivityEntry[]>;
  /** First message the employee shows when a chat opens. */
  getGreeting(agentId: string): string;
  /** Questions offered as one-tap suggestions, in the conversation's current language. */
  getSuggestions(agentId: string, language: ChatLanguage): string[];
  /**
   * Sends a visitor message and resolves with the employee's reply.
   * `source` says where the reply came from: live AI, or the written knowledge base.
   */
  sendMessage(agentId: string, text: string, history?: ChatMessage[]): Promise<{ text: string; language: ChatLanguage; source: "ai" | "kb" }>;
}

/**
 * READ operations only in V1. When real GoHighLevel access is added, writes
 * (create contact, move opportunity, book appointment) go in a separate
 * interface so they can be gated behind human approval.
 */
export interface CrmService {
  /** Metrics, pipeline stages and the leads on the board. */
  getSnapshot(): Promise<CrmSnapshot>;
}

export interface WorkflowService {
  /** The workflow shown in the Automation Lab: its steps, connections and recent runs. */
  getWorkflow(): Promise<WorkflowDefinition>;
}

export interface ActivityService {
  /** The most recent events across the whole HQ, newest first. */
  getRecent(): Promise<ActivityEvent[]>;
}

/**
 * Tells a person that an action is waiting for approval. V1 only composes the
 * messages so the demo can show them; nothing is sent. A live version sends
 * them from a server, where the Slack webhook URL and email credentials live.
 */
export interface NotificationService {
  /** The notices that go out for an approval request, one per channel. */
  approvalNotices(request: ApprovalRequest, agent: Agent): ApprovalNotice[];
}

export type LeadResult = "sent" | "not-configured" | "failed";

/** Delivers a real inquiry to Liezl through the site's own server. */
export interface LeadService {
  submit(lead: LeadInquiry): Promise<LeadResult>;
}

export interface HqServices {
  agents: AgentService;
  crm: CrmService;
  workflows: WorkflowService;
  activity: ActivityService;
  notifications: NotificationService;
  leads: LeadService;
}
