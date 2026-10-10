import { HQ_CONFIG } from "../config";
import { useHq } from "../store/hqStore";
import { Dialog } from "./Dialog";

export function HelpDialog() {
  const open = useHq((s) => s.helpOpen);
  const setOpen = useHq((s) => s.setHelpOpen);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onClose={close} labelledBy="help-title">
      <h2 id="help-title">About this demo</h2>
      <p>
        This is an interactive demonstration of AI employees operating inside an automated CRM environment,
        designed by {HQ_CONFIG.ownerName}, {HQ_CONFIG.ownerTitle}.
      </p>
      <dl className="how-to">
        <div><dt>Move</dt><dd>WASD or arrow keys. You can also tap the floor to walk there.</dd></div>
        <div><dt>Rooms</dt><dd>Walk into a room, or pick one in the directory, to see what it does.</dd></div>
        <div><dt>Employees</dt><dd>Tap an AI employee, or walk up and press E. Chat replies are scripted.</dd></div>
        <div><dt>CRM</dt><dd>Tap the pipeline board in Sales &amp; CRM, or the CRM status in the top bar.</dd></div>
        <div><dt>Workflows</dt><dd>Tap the workflow screen in the Automation Lab, or the Workflows status in the top bar.</dd></div>
        <div><dt>Camera</dt><dd>Reset view shows the whole floor.</dd></div>
        <div><dt>Music</dt><dd>The play button starts soft ambient music. It is off until you turn it on.</dd></div>
        <div><dt>Theme</dt><dd>Use the sun or moon button to switch between light and dark.</dd></div>
        <div><dt>Leave</dt><dd>Exit HQ returns you to the portfolio.</dd></div>
      </dl>
      <p className="muted">All contacts, businesses, messages and numbers are fictional.</p>
      <div className="dialog-actions">
        <button type="button" className="btn-primary" onClick={close} autoFocus>Close</button>
      </div>
    </Dialog>
  );
}
