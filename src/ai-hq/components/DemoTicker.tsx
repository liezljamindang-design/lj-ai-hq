import { resetDemo } from "../demo/runner";
import { DEMO_STEPS } from "../demo/script";
import { useHq } from "../store/hqStore";

/**
 * A one-line view of the live demo, laid over the office. It keeps the current
 * step in sight on phones, where the full demo panel sits below the floor, and
 * on desktop when the demo panel has been closed.
 */
export function DemoTicker() {
  const demo = useHq((s) => s.demo);
  const panelOpen = useHq((s) => s.openDashboard === "demo");
  const openDemoPanel = useHq((s) => s.openDemoPanel);
  if (demo.status === "idle") return null;

  const step = Math.max(0, demo.step);
  const done = demo.status === "completed";
  const progress = done ? 1 : (step + 1) / DEMO_STEPS.length;

  return (
    <div className={`demo-ticker${panelOpen ? " panel-open" : ""}`} role="status">
      <div className="ticker-text">
        <span className="ticker-count">{done ? "Demo complete" : `Step ${step + 1} of ${DEMO_STEPS.length}`}</span>
        <span className="ticker-title">{done ? "Maya K. is booked and followed up." : DEMO_STEPS[step].title}</span>
      </div>
      {done ? (
        <span className="ticker-actions">
          <button type="button" className="link-btn" onClick={openDemoPanel}>Results</button>
          <button type="button" className="link-btn" onClick={resetDemo}>Reset</button>
        </span>
      ) : null}
      <span className="ticker-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>
    </div>
  );
}
