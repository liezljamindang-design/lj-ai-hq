import { mockAgentService } from "./mockAgentService";
import { mockCRMService } from "./mockCRMService";
import { mockWorkflowService } from "./mockWorkflowService";
import type { HqServices } from "./types";

/** The single place where mock services are swapped for real ones. */
export const services: HqServices = {
  agents: mockAgentService,
  crm: mockCRMService,
  workflows: mockWorkflowService,
};

export type { HqServices, AgentService, CrmService, WorkflowService } from "./types";
