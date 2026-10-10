import { create } from "zustand";
import type { Agent, ThemeChoice, ZoneId } from "../types";

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

function initialTheme(): ThemeChoice {
  const saved = read(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

  agents: [],
  agentsState: "loading",
  setAgents: (agents) => set({ agents, agentsState: "ready" }),
  setAgentsState: (agentsState) => set({ agentsState }),
}));
