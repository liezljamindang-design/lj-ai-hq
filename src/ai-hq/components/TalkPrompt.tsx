import { useEffect } from "react";
import { useHq } from "../store/hqStore";

/** Appears when the avatar stands next to an employee. Press E or tap it to open their panel. */
export function TalkPrompt() {
  const nearId = useHq((s) => s.nearAgentId);
  const openId = useHq((s) => s.openAgentId);
  const agent = useHq((s) => s.agents.find((a) => a.id === nearId));
  const openAgent = useHq((s) => s.openAgent);
  const visible = !!agent && openId !== agent.id;

  useEffect(() => {
    if (!visible || !agent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "e" && e.key !== "E") return;
      const s = useHq.getState();
      if (s.onboardingOpen || s.helpOpen) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      openAgent(agent.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, agent, openAgent]);

  if (!visible || !agent) return null;
  return (
    <button type="button" className="talk-prompt" onClick={() => openAgent(agent.id)}>
      <span>Talk to {agent.name}</span>
      <span className="talk-sub">{agent.title}</span>
      <kbd className="only-desktop">E</kbd>
    </button>
  );
}
