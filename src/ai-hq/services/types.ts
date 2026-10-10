import type { ActivityEntry, Agent, AgentTask, CrmSnapshot } from "../types";

/**
 * Service contracts. The UI talks only to these interfaces.
 * V1 uses the mock implementations. A future build swaps in versions that call
 * a secure server-side endpoint (never GoHighLevel, an AI API or n8n directly
 * from the browser), and no component has to change.
 *
 * workflowService, calendarService and activityService are added in the
 * phases that first use them.
 */
export interface AgentService {
  listAgents(): Promise<Agent[]>;
  getTasks(agentId: string): Promise<AgentTask[]>;
  getActivity(agentId: string): Promise<ActivityEntry[]>;
  /** First message the employee shows when a chat opens. */
  getGreeting(agentId: string): string;
  /** Questions offered as one-tap suggestions. */
  getSuggestions(agentId: string): string[];
  /** Sends a visitor message and resolves with the employee's reply. */
  sendMessage(agentId: string, text: string): Promise<string>;
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

export interface HqServices {
  agents: AgentService;
  crm: CrmService;
}
