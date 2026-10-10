import { AGENTS } from "../data/agents";
import { START } from "../office/engine";
import { clockTime } from "../services/mockActivityService";
import { useHq } from "../store/hqStore";
import type { ActivityEvent, Agent, CrmSnapshot } from "../types";
import { DEMO_LEAD, DEMO_LEAD_ID, DEMO_STEPS, STEP_MS } from "./script";

/** What the HQ looked like before the demo, so Reset can put it back exactly. */
let baseline: { agents: Agent[]; crm: CrmSnapshot; activity: ActivityEvent[] } | null = null;
let timers: number[] = [];
let eventId = 0;

const clearTimers = () => { timers.forEach((t) => window.clearTimeout(t)); timers = []; };

function tokenFor(at: string) {
  if (at === "entrance") return { x: START.x, y: START.y + 0.25 };
  const pos = AGENTS.find((a) => a.id === at)?.pos;
  return pos ? { x: pos.x + 0.3, y: pos.y + 0.3 } : null;
}

function applyStep(index: number) {
  const step = DEMO_STEPS[index];
  const time = clockTime();
  useHq.setState((s) => {
    // Work on a copy of the CRM so every subscriber sees one clean update.
    const crm = structuredClone(s.crm!);
    let lead = crm.leads.find((l) => l.id === DEMO_LEAD_ID);
    if (!lead) {
      lead = structuredClone(DEMO_LEAD);
      crm.leads.unshift(lead);
    }
    step.crm?.(crm, lead, time);

    const events: ActivityEvent[] = step.feed.map((text) => ({ id: `demo-${++eventId}`, time, text }));
    return {
      crm,
      agents: step.agents ? s.agents.map((a) => (step.agents![a.id] ? { ...a, status: step.agents![a.id] } : a)) : s.agents,
      nodeStates: { ...s.nodeStates, ...step.nodes },
      activity: [...events.reverse(), ...s.activity].slice(0, 40),
      token: tokenFor(step.at),
      holderId: step.at === "entrance" ? null : step.at,
      demo: { status: "running", step: index, wasReset: false },
    };
  });
}

function finish() {
  useHq.setState((s) => ({
    token: null,
    holderId: null,
    agents: s.agents.map((a) => (a.id === "chloe" ? { ...a, status: "available" } : a)),
    demo: { status: "completed", step: DEMO_STEPS.length - 1, wasReset: false },
  }));
}

/** Starts the simulated lead journey. Returns false if the demo data has not loaded yet. */
export function startDemo(): boolean {
  const s = useHq.getState();
  if (s.demo.status === "running") return true;
  if (s.demo.status === "completed") resetDemo();
  const now = useHq.getState();
  if (!now.crm || !now.workflow || now.agents.length === 0) return false;

  baseline = { agents: now.agents, crm: now.crm, activity: now.activity };
  clearTimers();
  useHq.setState({
    demo: { status: "running", step: -1, wasReset: false },
    nodeStates: {},
    openDashboard: "demo",
    openAgentId: null,
    openLeadId: null,
    overview: true, // show the whole floor so the lead can be followed across it
  });
  DEMO_STEPS.forEach((_, i) => timers.push(window.setTimeout(() => applyStep(i), 500 + i * STEP_MS)));
  timers.push(window.setTimeout(finish, 500 + DEMO_STEPS.length * STEP_MS));
  return true;
}

/** Stops the demo if it is running and restores the HQ to how it was. */
export function resetDemo() {
  clearTimers();
  const restore = baseline;
  baseline = null;
  useHq.setState((s) => ({
    ...(restore ?? {}),
    nodeStates: {},
    token: null,
    holderId: null,
    approvals: {},
    openLeadId: s.openLeadId === DEMO_LEAD_ID ? null : s.openLeadId,
    demo: { status: "idle", step: -1, wasReset: true },
  }));
}
