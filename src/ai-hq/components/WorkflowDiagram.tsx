import type { NodeRunState, WorkflowDefinition, WorkflowNode } from "../types";

// Diagram geometry, in pixels. Two columns: the main path and one branch.
const W = 320;
const NODE_H = 42;
const ROW_GAP = 30;
const COL = [
  { x: 8, w: 168 },
  { x: 204, w: 108 },
] as const;
const top = (n: WorkflowNode) => 6 + n.row * (NODE_H + ROW_GAP);
const centreX = (n: WorkflowNode) => COL[n.col].x + COL[n.col].w / 2;

const KIND_LABEL: Record<WorkflowNode["kind"], string> = {
  trigger: "Trigger",
  action: "Action",
  ai: "AI step",
  condition: "Condition",
  end: "Sequence",
};

interface Props {
  workflow: WorkflowDefinition;
  states: Record<string, NodeRunState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** The workflow as connected steps. Each step is a button; the connecting lines are drawn behind them. */
export function WorkflowDiagram({ workflow, states, selectedId, onSelect }: Props) {
  const byId = new Map(workflow.nodes.map((n) => [n.id, n]));
  const rows = Math.max(...workflow.nodes.map((n) => n.row)) + 1;
  const height = 6 + rows * NODE_H + (rows - 1) * ROW_GAP + 6;

  return (
    <div className="flow-scroll">
      <div className="flow" style={{ width: W, height }}>
        <svg className="flow-wires" width={W} height={height} viewBox={`0 0 ${W} ${height}`} aria-hidden="true">
          <defs>
            <marker id="flow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0.5 L7 4 L0 7.5 Z" className="flow-arrowhead" />
            </marker>
          </defs>
          {workflow.edges.map((e) => {
            const a = byId.get(e.from)!;
            const b = byId.get(e.to)!;
            // A wire lights up once the step it leads to has started.
            const lit = (states[e.to] ?? "idle") !== "idle" && states[e.to] !== "skipped";
            const straight = a.col === b.col;
            const d = straight
              ? `M${centreX(a)} ${top(a) + NODE_H} V${top(b) - 2}`
              : `M${COL[a.col].x + COL[a.col].w} ${top(a) + NODE_H / 2} H${centreX(b)} V${top(b) - 2}`;
            const lx = straight ? centreX(a) + 8 : centreX(b) - 44;
            const ly = straight ? top(a) + NODE_H + 19 : top(a) + NODE_H / 2 - 7;
            return (
              <g key={`${e.from}-${e.to}`} className={`flow-wire${lit ? " is-lit" : ""}`}>
                <path d={d} markerEnd="url(#flow-arrow)" />
                {e.label && <text x={lx} y={ly}>{e.label}</text>}
              </g>
            );
          })}
        </svg>

        {workflow.nodes.map((n) => {
          const state = states[n.id] ?? "idle";
          return (
            <button
              key={n.id}
              type="button"
              className={`flow-node kind-${n.kind} run-${state}${selectedId === n.id ? " is-selected" : ""}`}
              style={{ left: COL[n.col].x, top: top(n), width: COL[n.col].w, height: NODE_H }}
              aria-pressed={selectedId === n.id}
              onClick={() => onSelect(n.id)}
            >
              <span className="flow-kind">{KIND_LABEL[n.kind]}</span>
              <span className="flow-title">{n.title}</span>
              {state === "active" && <span className="sr-only"> (running)</span>}
              {state === "done" && <span className="sr-only"> (completed)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
