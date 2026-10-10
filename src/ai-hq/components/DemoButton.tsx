import { resetDemo, startDemo } from "../demo/runner";
import { DEMO_STEPS } from "../demo/script";
import { useHq } from "../store/hqStore";

/** Run Live Demo, and Reset Demo once it has finished. */
export function DemoButton() {
  const demo = useHq((s) => s.demo);
  const ready = useHq((s) => s.crmState === "ready" && s.workflowState === "ready" && s.agentsState === "ready");
  const failed = useHq((s) => s.crmState === "error" || s.workflowState === "error" || s.agentsState === "error");
  const openDemoPanel = useHq((s) => s.openDemoPanel);

  if (demo.status === "running") {
    return (
      <div className="demo-cta">
        <button type="button" className="btn-primary" onClick={openDemoPanel}>
          Demo running: step {Math.max(1, demo.step + 1)} of {DEMO_STEPS.length}
        </button>
        <span className="demo-caption">Simulated lead journey</span>
      </div>
    );
  }
  if (demo.status === "completed") {
    return (
      <div className="demo-cta">
        <button type="button" className="btn-secondary" onClick={resetDemo}>Reset demo</button>
        <span className="demo-caption">Demo complete</span>
      </div>
    );
  }
  return (
    <div className="demo-cta">
      <button type="button" className="btn-primary" disabled={!ready} onClick={() => startDemo()}>
        Run live demo
      </button>
      <span className="demo-caption">
        {failed ? "Demo data did not load. Reload the page." : ready ? "A simulation. No real data." : "Loading demo data…"}
      </span>
    </div>
  );
}
