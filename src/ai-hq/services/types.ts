import type { Agent } from "../types";

/**
 * Service contracts. The UI talks only to these interfaces.
 * V1 uses the mock implementations. A future build swaps in versions that call
 * a secure server-side endpoint (never GoHighLevel, an AI API or n8n directly
 * from the browser), and no component has to change.
 *
 * crmService, workflowService, calendarService and activityService are added
 * in the phases that first use them.
 */
export interface AgentService {
  listAgents(): Promise<Agent[]>;
}

export interface HqServices {
  agents: AgentService;
}
