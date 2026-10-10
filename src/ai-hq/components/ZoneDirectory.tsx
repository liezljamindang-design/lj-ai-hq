import { ZONES } from "../data/zones";
import { useHq } from "../store/hqStore";
import { StatusDot, STATUS_LABEL } from "./StatusDot";

/** Keyboard-friendly list of rooms. Selecting one highlights it on the floor and shows who works there. */
export function ZoneDirectory({ onRetryAgents }: { onRetryAgents: () => void }) {
  const selected = useHq((s) => s.selectedZone);
  const selectZone = useHq((s) => s.selectZone);
  const agents = useHq((s) => s.agents);
  const agentsState = useHq((s) => s.agentsState);

  return (
    <aside className="directory" aria-labelledby="directory-title">
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
                onClick={() => selectZone(open ? null : zone.id)}
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

                  {agentsState === "loading" && <p className="muted">Loading the team…</p>}
                  {agentsState === "error" && (
                    <p className="muted">
                      The team list didn't load.{" "}
                      <button type="button" className="link-btn" onClick={onRetryAgents}>Try again</button>
                    </p>
                  )}
                  {agentsState === "ready" && team.length === 0 && (
                    <p className="muted">No AI employee is stationed here.</p>
                  )}
                  {team.map((agent) => (
                    <div key={agent.id} className="agent-line">
                      <span className="agent-avatar" aria-hidden="true">{agent.name[0]}</span>
                      <span className="agent-id">
                        <strong>{agent.name}</strong>
                        <span>{agent.title}</span>
                      </span>
                      <span className="agent-status">
                        <StatusDot status={agent.status} />
                        {STATUS_LABEL[agent.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
