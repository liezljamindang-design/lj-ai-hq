import { create } from "zustand";
import type {
  ActivityEvent, Agent, ApprovalDecision, ChatMessage, CrmSnapshot, DashboardId, DemoStatus, NodeRunState, ThemeChoice,
  WorkflowDefinition, ZoneId,
} from "../types";

const ONBOARDED_KEY = "ljhq.onboarded";
const THEME_KEY = "ljhq.theme";

/** Storage can be blocked or empty, so every read and write is guarded. */
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* preference simply isn't remembered */
  }
}

/** Light is the default. A visitor's own choice is remembered and wins on later visits. */
function initialTheme(): ThemeChoice {
  const saved = read(THEME_KEY);
  const theme: ThemeChoice = saved === "dark" ? "dark" : "light";
  // Set before first paint so a dark-mode device doesn't flash the dark palette.
  document.documentElement.dataset.theme = theme;
  return theme;
}

type LoadState = "loading" | "ready" | "error";

interface HqState {
  theme: ThemeChoice;
  toggleTheme: () => void;

  onboardingOpen: boolean;
  helpOpen: boolean;
  finishOnboarding: () => void;
  setHelpOpen: (open: boolean) => void;

  selectedZone: ZoneId | null;
  selectZone: (id: ZoneId | null) => void;
  /** Set by the directory to ask the avatar to walk to a room. A new object each time, so repeats still fire. */
  walkRequest: { zone: ZoneId } | null;
  walkToZone: (id: ZoneId) => void;

  /** When true the camera shows the whole floor instead of following the avatar. */
  overview: boolean;
  setOverview: (overview: boolean) => void;

  /** The employee whose side panel is open. */
  openAgentId: string | null;
  openAgent: (id: string) => void;
  closeAgent: () => void;
  /** A dashboard open in the side panel. Opening one closes any employee panel, and the reverse. */
  openDashboard: DashboardId | null;
  /** Opens any dashboard in the side panel. */
  openPanel: (id: DashboardId) => void;
  /** The project being inspected in the project showcase. */
  openProjectId: string | null;
  setOpenProject: (id: string | null) => void;
  /** The lead being inspected inside the CRM dashboard. */
  openLeadId: string | null;
  openCrm: (leadId?: string | null) => void;
  setOpenLead: (id: string | null) => void;
  closeDashboard: () => void;
  openAutomation: () => void;
  openDemoPanel: () => void;

  /** Global Live Activity feed, newest first. */
  activity: ActivityEvent[];
  activityState: LoadState;
  setActivity: (activity: ActivityEvent[]) => void;
  setActivityState: (state: LoadState) => void;

  /** Run Live Demo. The runner in demo/runner.ts writes these. */
  demo: { status: DemoStatus; step: number; wasReset: boolean };
  /** Floor position of the travelling lead marker, or null when hidden. */
  token: { x: number; y: number } | null;
  /** The employee currently holding the demo lead. */
  holderId: string | null;

  /** Decisions on simulated approval requests, by request id. */
  approvals: Record<string, ApprovalDecision>;
  decideApproval: (id: string, decision: ApprovalDecision) => void;

  workflow: WorkflowDefinition | null;
  workflowState: LoadState;
  setWorkflow: (workflow: WorkflowDefinition) => void;
  setWorkflowState: (state: LoadState) => void;
  /** Live state of each workflow step during a demo run. Steps not listed are idle. */
  nodeStates: Record<string, NodeRunState>;
  setNodeStates: (states: Record<string, NodeRunState>) => void;

  crm: CrmSnapshot | null;
  crmState: LoadState;
  setCrm: (crm: CrmSnapshot) => void;
  setCrmState: (state: LoadState) => void;
  /** The employee the avatar is standing next to, if any. */
  nearAgentId: string | null;
  setNearAgent: (id: string | null) => void;
  /** Chat transcripts, kept per employee for the length of the visit. */
  chats: Record<string, ChatMessage[]>;
  addChat: (agentId: string, message: ChatMessage) => void;
  /** Language of each employee's latest reply, which the suggestion chips follow. */
  chatLanguage: Record<string, "en" | "tl">;
  setChatLanguage: (agentId: string, language: "en" | "tl") => void;

  agents: Agent[];
  agentsState: LoadState;
  setAgents: (agents: Agent[]) => void;
  setAgentsState: (state: LoadState) => void;
}

export const useHq = create<HqState>((set, get) => ({
  theme: initialTheme(),
  toggleTheme: () => {
    const next: ThemeChoice = get().theme === "dark" ? "light" : "dark";
    write(THEME_KEY, next);
    set({ theme: next });
  },

  onboardingOpen: read(ONBOARDED_KEY) !== "1",
  helpOpen: false,
  finishOnboarding: () => {
    write(ONBOARDED_KEY, "1");
    set({ onboardingOpen: false });
  },
  setHelpOpen: (helpOpen) => set({ helpOpen }),

  selectedZone: null,
  selectZone: (selectedZone) => set({ selectedZone }),
  walkRequest: null,
  walkToZone: (zone) => set({ selectedZone: zone, walkRequest: { zone } }),

  overview: false,
  setOverview: (overview) => set({ overview }),

  openAgentId: null,
  openAgent: (openAgentId) => set({ openAgentId, openDashboard: null }),
  openDashboard: null,
  openPanel: (id) => set({ openDashboard: id, openLeadId: null, openProjectId: null, openAgentId: null }),
  openProjectId: null,
  setOpenProject: (openProjectId) => set({ openProjectId }),
  openLeadId: null,
  openCrm: (leadId = null) => set({ openDashboard: "crm", openLeadId: leadId, openAgentId: null }),
  setOpenLead: (openLeadId) => set({ openLeadId }),
  closeDashboard: () => set({ openDashboard: null, openLeadId: null, openProjectId: null }),
  openAutomation: () => set({ openDashboard: "automation", openLeadId: null, openAgentId: null }),
  openDemoPanel: () => set({ openDashboard: "demo", openLeadId: null, openAgentId: null }),

  activity: [],
  activityState: "loading",
  setActivity: (activity) => set({ activity, activityState: "ready" }),
  setActivityState: (activityState) => set({ activityState }),

  demo: { status: "idle", step: -1, wasReset: false },
  token: null,
  holderId: null,

  approvals: {},
  decideApproval: (id, decision) => set((s) => ({ approvals: { ...s.approvals, [id]: decision } })),

  workflow: null,
  workflowState: "loading",
  setWorkflow: (workflow) => set({ workflow, workflowState: "ready" }),
  setWorkflowState: (workflowState) => set({ workflowState }),
  nodeStates: {},
  setNodeStates: (nodeStates) => set({ nodeStates }),

  crm: null,
  crmState: "loading",
  setCrm: (crm) => set({ crm, crmState: "ready" }),
  setCrmState: (crmState) => set({ crmState }),
  closeAgent: () => set({ openAgentId: null }),
  nearAgentId: null,
  setNearAgent: (nearAgentId) => set({ nearAgentId }),
  chats: {},
  addChat: (agentId, message) =>
    set((s) => ({ chats: { ...s.chats, [agentId]: [...(s.chats[agentId] ?? []), message] } })),

  chatLanguage: {},
  setChatLanguage: (agentId, language) => set((s) => ({ chatLanguage: { ...s.chatLanguage, [agentId]: language } })),

  agents: [],
  agentsState: "loading",
  setAgents: (agents) => set({ agents, agentsState: "ready" }),
  setAgentsState: (agentsState) => set({ agentsState }),
}));
