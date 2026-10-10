import { HQ_CONFIG } from "../config";
import { useHq } from "../store/hqStore";
import { AvatarPicker } from "./AvatarPicker";
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
        <div><dt>Move</dt><dd><span className="only-desktop">WASD or arrow keys. You can also click the floor to walk there.</span><span className="only-mobile">Tap the floor and your avatar walks there.</span></dd></div>
        <div><dt>Rooms</dt><dd>Walk into a room, or pick one in the directory, to see what it does.</dd></div>
        <div><dt>Employees</dt><dd>Tap an AI employee<span className="only-desktop">, or walk up and press E</span>. They answer from a prepared knowledge base, for any business niche. Write in Tagalog and they reply in Taglish.</dd></div>
        <div><dt>Wall screens</dt><dd>Tap any wall screen to open it: the CRM, the workflow, the projects, the Strategy Room and the Executive Office.</dd></div>
        <div><dt>Live demo</dt><dd>Run live demo simulates one lead from first inquiry to booked appointment. Reset demo puts everything back.</dd></div>
        <div><dt>Camera</dt><dd>Reset view shows the whole floor.</dd></div>
        <div><dt>Music</dt><dd>The play button starts soft ambient music. It is off until you turn it on.</dd></div>
        <div><dt>Theme</dt><dd>Use the sun or moon button to switch between light and dark.</dd></div>
        <div><dt>Leave</dt><dd>Exit HQ returns you to the portfolio.</dd></div>
      </dl>
      <AvatarPicker />
      <p className="muted">All contacts, businesses, messages and numbers are fictional.</p>
      <div className="dialog-actions">
        <button type="button" className="btn-primary" onClick={close} autoFocus>Close</button>
      </div>
    </Dialog>
  );
}
