import type { Agent } from "../types";
import { ChibiArt, type ChibiId } from "./Chibi";
import { project } from "./iso";

/** An AI employee standing at their workstation, with a name tag and a status light. */
export function AgentFigure({ agent, active, holding }: { agent: Agent; active: boolean; holding: boolean }) {
  const [sx, sy] = project(agent.pos.x, agent.pos.y);
  return (
    <g
      className={`agent agent-${agent.status}${active ? " is-active" : ""}${holding ? " has-lead" : ""}`}
      data-agent={agent.id}
      transform={`translate(${sx.toFixed(2)} ${sy.toFixed(2)})`}
    >
      {/* Generous invisible target so the figure is easy to tap */}
      <rect className="agent-hit" x={-18} y={-66} width={36} height={74} />
      <ellipse className="ag-ring" cx={0} cy={0} rx={15} ry={7.5} />
      <ellipse className="av-shadow" cx={0} cy={0} rx={9.5} ry={4.6} />
      <g transform="scale(1.3)">
        <ChibiArt id={agent.id as ChibiId} />
      </g>
      <g className="ag-tag" transform="translate(0 -60)">
        <rect className="ag-tag-bg" x={-21} y={-8} width={42} height={12} rx={6} />
        <circle className="ag-status" cx={-14.5} cy={-2} r={2.4} />
        <text className="ag-name" x={3} y={1} textAnchor="middle">{agent.name}</text>
      </g>
    </g>
  );
}
