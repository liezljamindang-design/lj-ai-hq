import type { Agent } from "../types";
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
      <rect className="agent-hit" x={-16} y={-58} width={32} height={66} />
      <ellipse className="ag-ring" cx={0} cy={0} rx={14} ry={7} />
      <ellipse className="av-shadow" cx={0} cy={0} rx={8.5} ry={4.2} />
      <g transform="scale(1.25)">
        <rect className="ag-torso" x={-5} y={-21} width={10} height={19} rx={5} />
        <rect className="ag-band" x={-5} y={-12} width={10} height={1.8} />
        <circle className="ag-head" cx={0} cy={-26.5} r={5} />
      </g>
      <g className="ag-tag" transform="translate(0 -44)">
        <rect className="ag-tag-bg" x={-21} y={-8} width={42} height={12} rx={6} />
        <circle className="ag-status" cx={-14.5} cy={-2} r={2.4} />
        <text className="ag-name" x={3} y={1} textAnchor="middle">{agent.name}</text>
      </g>
    </g>
  );
}
