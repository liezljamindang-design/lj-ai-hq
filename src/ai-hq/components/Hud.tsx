import { HQ_CONFIG } from "../config";
import { useHq } from "../store/hqStore";
import { MusicToggle } from "./MusicToggle";

/** Top bar: identity, demo badge, system status, and the theme, help and exit controls. */
export function Hud({ onRetryAgents }: { onRetryAgents: () => void }) {
  const theme = useHq((s) => s.theme);
  const toggleTheme = useHq((s) => s.toggleTheme);
  const setHelpOpen = useHq((s) => s.setHelpOpen);
  const agents = useHq((s) => s.agents);
  const agentsState = useHq((s) => s.agentsState);

  const online = agents.filter((a) => a.status !== "offline").length;

  return (
    <header className="hud">
      <div className="hud-brand">
        <span className="hud-mark" aria-hidden="true">LJ</span>
        <span className="hud-name">AI HQ</span>
        <span className="demo-badge">Demo environment</span>
      </div>

      <ul className="hud-status" aria-label="System status">
        <li>
          <span className="hud-label">AI employees</span>
          {agentsState === "ready" && <span className="hud-value"><i className="pip pip-ok" />{online} online</span>}
          {agentsState === "loading" && <span className="hud-value">Loading…</span>}
          {agentsState === "error" && (
            <button type="button" className="link-btn" onClick={onRetryAgents}>Unavailable. Retry</button>
          )}
        </li>
        <li>
          <span className="hud-label">Workflows</span>
          <span className="hud-value"><i className="pip pip-ok" />Active</span>
        </li>
        <li>
          <span className="hud-label">CRM</span>
          <span className="hud-value"><i className="pip pip-ok" />Connected (demo)</span>
        </li>
      </ul>

      <div className="hud-actions">
        <MusicToggle />
        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button type="button" className="text-btn" onClick={() => setHelpOpen(true)}>Help</button>
        <a className="text-btn text-btn-exit" href={HQ_CONFIG.portfolioUrl}>Exit HQ</a>
      </div>
    </header>
  );
}
