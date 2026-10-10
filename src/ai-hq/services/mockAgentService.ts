import { AGENTS } from "../data/agents";
import type { AgentService } from "./types";

export const mockAgentService: AgentService = {
  async listAgents() {
    return AGENTS.map((a) => ({ ...a }));
  },
};
