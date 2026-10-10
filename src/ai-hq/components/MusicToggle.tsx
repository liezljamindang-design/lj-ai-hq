import { useEffect, useState } from "react";
import { startAmbient, stopAmbient } from "../audio/ambient";

/** Play and pause for the ambient music. Always off until the visitor turns it on. */
export function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => stopAmbient, []); // stop if the HQ unmounts

  async function toggle() {
    if (playing) {
      stopAmbient();
      setPlaying(false);
      return;
    }
    const ok = await startAmbient();
    setPlaying(ok);
    setUnavailable(!ok);
  }

  return (
    <button
      type="button"
      className={`text-btn music-btn${playing ? " is-on" : ""}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Pause music" : "Play music"}
      title={unavailable ? "Music isn't available in this browser" : undefined}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M8 5.5v13a.6.6 0 0 0 .9.5l10.4-6.5a.6.6 0 0 0 0-1L8.9 5a.6.6 0 0 0-.9.5Z" fill="currentColor" />
        </svg>
      )}
      <span className="music-label">{unavailable ? "No audio" : playing ? "Music on" : "Music"}</span>
    </button>
  );
}
