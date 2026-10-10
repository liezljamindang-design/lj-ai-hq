import { AGENT_ACTIVITY, AGENT_TASKS } from "../data/agentContent";
import { AGENTS } from "../data/agents";
import { GREETING } from "../data/knowledge";
import { answer, suggestions } from "./knowledgeMatcher";
import type { AgentService } from "./types";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Demo implementation. Chat replies come from a written knowledge base, not
 * from an AI model: each question is matched to the closest prepared answer.
 * Replies are in English, and in conyo Taglish when the visitor writes in Tagalog.
 * A future realAgentService keeps these same method signatures and calls a
 * backend, or hands the chat to a GoHighLevel Conversation AI bot.
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
    return GREETING[agentId] ?? "Hello!";
  },
  getSuggestions(agentId, language) {
    return suggestions(agentId, language);
  },
  async sendMessage(agentId, text) {
    await wait(650); // a short pause so the reply reads as a turn in a conversation
    return answer(agentId, text);
  },
};
