import { mockAgentService } from "./mockAgentService";
import type { HqServices } from "./types";

/** The single place where mock services are swapped for real ones. */
export const services: HqServices = {
  agents: mockAgentService,
};

export type { HqServices, AgentService } from "./types";
