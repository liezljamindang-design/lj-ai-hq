import { startDemo } from "../demo/runner";
import { useHq } from "../store/hqStore";
import { Dialog } from "./Dialog";

/** First-visit welcome. Kept to one screen. */
export function Onboarding() {
  const open = useHq((s) => s.onboardingOpen);
  const finish = useHq((s) => s.finishOnboarding);
  const ready = useHq((s) => s.crmState === "ready" && s.workflowState === "ready" && s.agentsState === "ready");

  return (
    <Dialog open={open} onClose={finish} labelledBy="onboarding-title">
      <p className="eyebrow">Portfolio demo</p>
      <h2 id="onboarding-title">Welcome to LJ AI Headquarters</h2>
      <p>Explore how AI employees, CRM systems and GoHighLevel automations can work together.</p>
      <dl className="how-to">
        <div><dt>Move</dt><dd><span className="only-desktop">WASD or arrow keys. You can also click the floor.</span><span className="only-mobile">Tap the floor and your avatar walks there.</span></dd></div>
        <div><dt>Explore</dt><dd>Walk into a room, or pick one in the directory.</dd></div>
        <div><dt>Interact</dt><dd>Tap an AI employee to chat and see their work.</dd></div>
        <div><dt>Try</dt><dd>Run live demo sends one lead through the whole system.</dd></div>
      </dl>
      <p className="muted">Everything here is fictional demo data. No real clients or contacts.</p>
      <div className="dialog-actions">
        <button type="button" className="btn-secondary" disabled={!ready} onClick={() => { finish(); startDemo(); }}>Run demo</button>
        <button type="button" className="btn-primary" onClick={finish} autoFocus>Start exploring</button>
      </div>
    </Dialog>
  );
}
