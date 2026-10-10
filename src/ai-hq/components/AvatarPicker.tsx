import { ChibiPortrait } from "../office/Chibi";
import { useHq } from "../store/hqStore";

const OPTIONS = [
  { value: "girl", label: "Girl", chibi: "visitor-girl" },
  { value: "boy", label: "Boy", chibi: "visitor-boy" },
] as const;

/** Lets the visitor choose which chibi they walk around as. The choice is remembered. */
export function AvatarPicker() {
  const avatar = useHq((s) => s.avatar);
  const setAvatar = useHq((s) => s.setAvatar);

  return (
    <fieldset className="avatar-pick">
      <legend>Your avatar</legend>
      <div className="avatar-options">
        {OPTIONS.map((o) => (
          <button key={o.value} type="button" className="avatar-option" aria-pressed={avatar === o.value} onClick={() => setAvatar(o.value)}>
            <ChibiPortrait id={o.chibi} size={44} />
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
