import { ZONES } from "../data/zones";
import { ChibiPortrait } from "../office/Chibi";
import { useHq } from "../store/hqStore";
import { ActivityFeed } from "./ActivityFeed";
import { StatusDot, STATUS_LABEL } from "./StatusDot";

/** Keyboard-friendly list of rooms. Choosing one walks the avatar there and shows who works in it. */
export function ZoneDirectory({ onRetryAgents, onRetryActivity }: { onRetryAgents: () => void; onRetryActivity: () => void }) {
  const selected = useHq((s) => s.selectedZone);
  const selectZone = useHq((s) => s.selectZone);
  const walkToZone = useHq((s) => s.walkToZone);
  const openAgent = useHq((s) => s.openAgent);
  const openCrm = useHq((s) => s.openCrm);
  const openAutomation = useHq((s) => s.openAutomation);
  const openPanel = useHq((s) => s.openPanel);
  const agents = useHq((s) => s.agents);
  const agentsState = useHq((s) => s.agentsState);

  return (
    <aside className="directory" id="hq-directory" tabIndex={-1} aria-labelledby="directory-title">
      <h2 id="directory-title" className="panel-title">Floor directory</h2>
      <ul className="directory-list">
        {ZONES.map((zone) => {
          const open = selected === zone.id;
          const team = agents.filter((a) => a.zone === zone.id);
          return (
            <li key={zone.id} className={`directory-item${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="directory-row"
                id={`zone-btn-${zone.id}`}
                aria-expanded={open}
                aria-controls={`zone-panel-${zone.id}`}
                onClick={() => (open ? selectZone(null) : walkToZone(zone.id))}
              >
                <span className="directory-key">{zone.key}</span>
                <span className="directory-name">{zone.name}</span>
              </button>

              {open && (
                <div className="directory-detail" id={`zone-panel-${zone.id}`} role="region" aria-labelledby={`zone-btn-${zone.id}`}>
                  <p>{zone.summary}</p>
                  <ul className="tag-list">
                    {zone.contains.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  {zone.id === "sales" && (
                    <button type="button" className="btn-secondary" onClick={() => openCrm()}>Open the CRM dashboard</button>
                  )}

                  {zone.id === "ai-lab" && (
                    <button type="button" className="btn-secondary" onClick={() => openAgent("sophia")}>Talk to Sophia, the AI receptionist</button>
                  )}
                  {zone.id === "executive" && (
                    <button type="button" className="btn-secondary" onClick={() => openPanel("executive")}>Meet Liezl</button>
                  )}
                  {zone.id === "studio" && (
                    <button type="button" className="btn-secondary" onClick={() => openPanel("projects")}>View the projects</button>
                  )}
                  {zone.id === "meeting" && (
                    <button type="button" className="btn-secondary" onClick={() => openPanel("strategy")}>Open the Strategy Room</button>
                  )}
                  {zone.id === "automation" && (
                    <button type="button" className="btn-secondary" onClick={openAutomation}>Open the workflow</button>
                  )}

                  {agentsState === "loading" && <p className="muted">Loading the team…</p>}
                  {agentsState === "error" && (
                    <p className="muted">
                      The team list didn't load.{" "}
                      <button type="button" className="link-btn" onClick={onRetryAgents}>Try again</button>
                    </p>
                  )}
                  {team.map((agent) => (
                    <button key={agent.id} type="button" className="agent-line" onClick={() => openAgent(agent.id)}>
                      <span className="agent-avatar"><ChibiPortrait id={agent.id} size={40} /></span>
                      <span className="agent-id">
                        <strong>{agent.name}</strong>
                        <span>{agent.title}</span>
                      </span>
                      <span className="agent-status">
                        <StatusDot status={agent.status} />
                        {STATUS_LABEL[agent.status]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <h2 className="panel-title panel-title-gap">Live activity</h2>
      <div className="directory-feed"><ActivityFeed limit={7} onRetry={onRetryActivity} /></div>
    </aside>
  );
}
