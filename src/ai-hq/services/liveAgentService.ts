import { detectLanguage } from "./knowledgeMatcher";
import { mockAgentService } from "./mockAgentService";
import type { AgentService } from "./types";

/**
 * Chat with live AI when it is available. Messages go to this site's own
 * /api/chat endpoint, which holds the AI key on the server. If that endpoint
 * is not configured, is rate-limiting, or fails, the reply comes from the
 * written knowledge base instead, so the chat always answers.
 */
let liveAvailable = true; // set to false for the rest of the visit once the server says AI is not set up

export const liveAgentService: AgentService = {
  ...mockAgentService,

  async sendMessage(agentId, text, history = []) {
    if (liveAvailable) {
      try {
        const messages = [
          ...history.slice(-7).map((m) => ({ role: m.from === "agent" ? "assistant" : "user", content: m.text })),
          { role: "user", content: text },
        ];
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId, messages }),
          signal: AbortSignal.timeout(20_000),
        });
        if (res.ok) {
          const data = (await res.json()) as { text?: string };
          if (data.text) return { text: data.text, language: detectLanguage(text), source: "ai" };
        } else if (res.status === 503 || res.status === 404) {
          liveAvailable = false;
        }
      } catch {
        /* offline, timed out or blocked: fall through to the knowledge base */
      }
    }
    return mockAgentService.sendMessage(agentId, text, history);
  },
};
