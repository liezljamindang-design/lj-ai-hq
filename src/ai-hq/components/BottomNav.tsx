import { startDemo } from "../demo/runner";
import { useHq } from "../store/hqStore";

const smooth = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

const ICONS = {
  office: "M4 20V8l8-4 8 4v12M9 20v-5h6v5M4 20h16",
  rooms: "M5 7h14M5 12h14M5 17h9",
  demo: "M8 5.5v13l11-6.5z",
  crm: "M5 5v14M12 5v9M19 5v11",
  about: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c1-3.5 4-5 7-5s6 1.5 7 5",
} as const;

/** Phone and tablet navigation, fixed to the bottom of the screen. Hidden on desktop. */
export function BottomNav() {
  const dashboard = useHq((s) => s.openDashboard);
  const agentOpen = useHq((s) => s.openAgentId !== null);
  const demoStatus = useHq((s) => s.demo.status);

  const closeAll = () => useHq.setState({ openDashboard: null, openAgentId: null, openLeadId: null, openProjectId: null });
  const toTop = () => window.scrollTo({ top: 0, behavior: smooth() });

  function office() { closeAll(); toTop(); }
  function rooms() {
    closeAll();
    // Wait a frame for the directory to render before scrolling to it.
    requestAnimationFrame(() => document.getElementById("directory-title")?.scrollIntoView({ behavior: smooth(), block: "start" }));
  }
  function demo() {
    if (demoStatus === "completed") {
      useHq.getState().openDemoPanel();
      requestAnimationFrame(() => document.getElementById("demo-title")?.scrollIntoView({ behavior: smooth(), block: "start" }));
      return;
    }
    if (demoStatus === "idle") startDemo();
    else useHq.getState().openDemoPanel();
    toTop(); // the office and the step ticker are at the top
  }

  const items = [
    { id: "office", label: "Office", onClick: office, current: !dashboard && !agentOpen },
    { id: "rooms", label: "Rooms", onClick: rooms, current: false },
    { id: "demo", label: demoStatus === "running" ? "Running" : "Demo", onClick: demo, current: dashboard === "demo" },
    { id: "crm", label: "CRM", onClick: () => useHq.getState().openCrm(), current: dashboard === "crm" },
    { id: "about", label: "Liezl", onClick: () => useHq.getState().openPanel("executive"), current: dashboard === "executive" },
  ] as const;

  return (
    <nav className="bottom-nav" aria-label="Sections">
      {items.map((item) => (
        <button key={item.id} type="button" onClick={item.onClick} aria-current={item.current ? "page" : undefined}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d={ICONS[item.id]} fill={item.id === "demo" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
