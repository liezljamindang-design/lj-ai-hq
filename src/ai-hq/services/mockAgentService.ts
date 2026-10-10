import { AGENT_ACTIVITY, AGENT_GREETING, AGENT_SCRIPTS, AGENT_TASKS, CHAT_FALLBACK } from "../data/agentContent";
import { AGENTS } from "../data/agents";
import type { AgentService } from "./types";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Demo implementation. Chat replies are scripted, not generated: a typed
 * question is matched to the closest prepared answer by keyword. A future
 * realAgentService keeps these same method signatures and calls a backend.
 */
export const mockAgentService: AgentService = {
  async listAgents() {
    return AGENTS.map((a) => ({ ...a }));
  },
  async getTasks(agentId) {
    return (AGENT_TASKS[agentId] ?? []).map((t) => ({ ...t }));
  },
  async getActivity(agentId) {
    return (AGENT_ACTIVITY[agentId] ?? []).map((a) => ({ ...a }));
  },
  getGreeting(agentId) {
    return AGENT_GREETING[agentId] ?? "Hello.";
  },
  getSuggestions(agentId) {
    return (AGENT_SCRIPTS[agentId] ?? []).map((s) => s.q);
  },
  async sendMessage(agentId, text) {
    await wait(650); // a short pause so the reply reads as a turn in a conversation
    const scripts = AGENT_SCRIPTS[agentId] ?? [];
    const exact = scripts.find((s) => s.q === text);
    if (exact) return exact.a;
    const lower = text.toLowerCase();
    let best: { score: number; a: string } | null = null;
    for (const s of scripts) {
      const score = s.keywords.filter((k) => lower.includes(k)).length;
      if (score > 0 && (!best || score > best.score)) best = { score, a: s.a };
    }
    return best ? best.a : CHAT_FALLBACK;
  },
};
