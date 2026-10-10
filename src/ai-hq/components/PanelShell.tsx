import { useEffect, useRef, type ReactNode } from "react";
import { useHq } from "../store/hqStore";

interface Props {
  eyebrow: string;
  title: string;
  closeLabel: string;
  /** Called on Escape before closing. Return true to keep the panel open (for example, to step back a level). */
  onEscape?: () => boolean;
  /** Changes when the panel should take focus again, such as when its content switches. */
  focusKey?: string | null;
  children: ReactNode;
}

/** Shared frame for the dashboards in the side panel: heading, close button, Escape and focus. */
export function PanelShell({ eyebrow, title, closeLabel, onEscape, focusKey, children }: Props) {
  const close = useHq((s) => s.closeDashboard);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => { ref.current?.focus(); }, [focusKey]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || useHq.getState().helpOpen) return;
      if (onEscape?.()) return;
      close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, onEscape]);

  return (
    <aside className="side-panel" ref={ref} tabIndex={-1} aria-labelledby="panel-title">
      <header className="panel-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="panel-title">{title}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={close} aria-label={closeLabel}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </header>
      <div className="panel-scroll">{children}</div>
    </aside>
  );
}
