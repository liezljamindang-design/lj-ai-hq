import { useEffect, useState, type ComponentType } from "react";

/**
 * Code-split loading for the side panels. Each panel is its own chunk, fetched
 * on first use or when warmPanels() runs. Once a chunk is in the cache its panel
 * renders immediately, with no loading flash.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPanel = ComponentType<any>;

const LOADERS = {
  agent: () => import("../components/AgentPanel").then((m) => m.AgentPanel),
  automation: () => import("../components/AutomationPanel").then((m) => m.AutomationPanel),
  crm: () => import("../components/CrmPanel").then((m) => m.CrmPanel),
  demo: () => import("../components/DemoPanel").then((m) => m.DemoPanel),
  executive: () => import("../components/ExecutivePanel").then((m) => m.ExecutivePanel),
  projects: () => import("../components/ProjectsPanel").then((m) => m.ProjectsPanel),
  strategy: () => import("../components/StrategyPanel").then((m) => m.StrategyPanel),
} satisfies Record<string, () => Promise<AnyPanel>>;

export type PanelName = keyof typeof LOADERS;

const cache = new Map<PanelName, AnyPanel>();
const pending = new Map<PanelName, Promise<AnyPanel>>();

function load(name: PanelName): Promise<AnyPanel> {
  let p = pending.get(name);
  if (!p) {
    p = (LOADERS[name]() as Promise<AnyPanel>).then((panel) => {
      cache.set(name, panel);
      return panel;
    });
    // A failed download is forgotten, so the next attempt tries again.
    p.catch(() => pending.delete(name));
    pending.set(name, p);
  }
  return p;
}

/** Fetches every panel in the background. Call when the browser is idle. */
export function warmPanels() {
  (Object.keys(LOADERS) as PanelName[]).forEach((name) => void load(name).catch(() => {}));
}

/** The component for a panel, "loading" while its code downloads, or "error" if that failed. */
export function usePanel(name: PanelName | null): { Panel: AnyPanel | "loading" | "error" | null; retry: () => void } {
  const [, setTick] = useState(0);
  const [failed, setFailed] = useState<PanelName | null>(null);

  useEffect(() => {
    if (!name || cache.has(name)) return;
    let live = true;
    load(name)
      .then(() => live && setTick((n) => n + 1))
      .catch(() => live && setFailed(name));
    return () => { live = false; };
  }, [name, failed]);

  const retry = () => setFailed(null);
  if (!name) return { Panel: null, retry };
  if (failed === name) return { Panel: "error", retry };
  return { Panel: cache.get(name) ?? "loading", retry };
}
