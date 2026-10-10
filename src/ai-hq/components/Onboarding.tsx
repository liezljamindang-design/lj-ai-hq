import { useHq } from "../store/hqStore";
import { Dialog } from "./Dialog";

/** First-visit welcome. Kept to one screen. */
export function Onboarding() {
  const open = useHq((s) => s.onboardingOpen);
  const finish = useHq((s) => s.finishOnboarding);

  return (
    <Dialog open={open} onClose={finish} labelledBy="onboarding-title">
      <p className="eyebrow">Portfolio demo</p>
      <h2 id="onboarding-title">Welcome to LJ AI Headquarters</h2>
      <p>Explore how AI employees, CRM systems and GoHighLevel automations can work together.</p>
      <dl className="how-to">
        <div><dt>Move</dt><dd>WASD or arrow keys. You can also tap the floor.</dd></div>
        <div><dt>Explore</dt><dd>Walk into a room, or pick one in the directory.</dd></div>
        <div><dt>Meet the team</dt><dd>Each room shows the AI employee who works there.</dd></div>
      </dl>
      <p className="muted">Everything here is fictional demo data. No real clients or contacts.</p>
      <div className="dialog-actions">
        <button type="button" className="btn-primary" onClick={finish} autoFocus>Start exploring</button>
      </div>
    </Dialog>
  );
}
