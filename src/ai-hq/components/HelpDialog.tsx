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
        <div><dt>Camera</dt><dd>Reset view shows the whole floor.</dd></div>
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
