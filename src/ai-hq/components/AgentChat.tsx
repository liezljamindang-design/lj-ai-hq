import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "../services";
import { useHq } from "../store/hqStore";
import type { Agent, ChatMessage } from "../types";

let nextId = 0;
const msg = (from: ChatMessage["from"], text: string): ChatMessage => ({ id: `m${++nextId}`, from, text });

/** Simulated chat. Replies come from the agent service, which is scripted in V1. */
export function AgentChat({ agent }: { agent: Agent }) {
  const stored = useHq((s) => s.chats[agent.id]);
  const addChat = useHq((s) => s.addChat);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const greeting = services.agents.getGreeting(agent.id);
  const messages = stored ?? [];
  const suggestions = services.agents.getSuggestions(agent.id);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, pending]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || pending) return;
    setDraft("");
    setFailed(false);
    addChat(agent.id, msg("visitor", clean));
    setPending(true);
    try {
      const reply = await services.agents.sendMessage(agent.id, clean);
      addChat(agent.id, msg("agent", reply));
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  return (
    <div className="chat">
      <p className="chat-note">Scripted demo replies. This chat is not connected to a live AI.</p>

      <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-label={`Conversation with ${agent.name}`}>
        <p className="bubble bubble-agent">{greeting}</p>
        {messages.map((m) => (
          <p key={m.id} className={`bubble bubble-${m.from}`}>{m.text}</p>
        ))}
        {pending && <p className="bubble bubble-agent bubble-pending">{agent.name} is replying…</p>}
        {failed && <p className="chat-error">{agent.name} is unavailable right now. Send your message again.</p>}
      </div>

      <ul className="chat-suggestions" aria-label="Suggested questions">
        {suggestions.map((q) => (
          <li key={q}>
            <button type="button" disabled={pending} onClick={() => void send(q)}>{q}</button>
          </li>
        ))}
      </ul>

      <form className="chat-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor={`chat-input-${agent.id}`}>Message {agent.name}</label>
        <input
          id={`chat-input-${agent.id}`}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Ask ${agent.name} a question`}
          autoComplete="off"
          maxLength={200}
        />
        <button type="submit" className="btn-primary" disabled={pending || !draft.trim()}>Send</button>
      </form>
    </div>
  );
}
