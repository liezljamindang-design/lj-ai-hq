import { mockAgentService } from "./mockAgentService";
import { mockCRMService } from "./mockCRMService";
import type { HqServices } from "./types";

/** The single place where mock services are swapped for real ones. */
export const services: HqServices = {
  agents: mockAgentService,
  crm: mockCRMService,
};

export type { HqServices, AgentService, CrmService } from "./types";
