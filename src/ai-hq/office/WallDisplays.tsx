import { project } from "./iso";
import { panelX, panelY, pt } from "./primitives";

/**
 * Screens mounted on the two outer walls. They are set dressing in Phase 2;
 * the CRM, automation and demo phases will drive them with live demo state.
 */
export function WallDisplays() {
  const [lx, ly] = project(1.0, 0, 30);
  const wave = [6.7, 6.9, 7.05, 7.2, 7.35, 7.5, 7.65, 7.8, 7.95, 8.1, 8.3]
    .map((x, i) => pt(x, 0, 36 + [0, 5, -4, 8, -7, 10, -6, 7, -3, 4, 0][i]))
    .join(" ");

  return (
    <g className="displays">
      {/* Executive Office: monogram plaque */}
      <polygon className="plaque" points={panelY(0, 0.55, 2.45, 16, 52)} />
      <text className="plaque-text" transform={`matrix(0.894 0.447 0 1 ${lx} ${ly})`} x={0} y={0}>
        LJ
      </text>

      {/* Meeting Room: strategy screen */}
      <polygon className="frame" points={panelY(0, 3.5, 5.5, 14, 54)} />
      <polygon className="screen" points={panelY(0, 3.58, 5.42, 17, 51)} />
      <polygon className="screen-line" points={panelY(0, 3.75, 4.9, 43, 46)} />
      {[3.8, 4.15, 4.5, 4.85].map((x, i) => (
        <polygon key={x} className={i === 3 ? "screen-gold" : "screen-line"} points={panelY(0, x, x + 0.22, 21, 21 + [8, 12, 15, 19][i])} />
      ))}

      {/* AI Lab: voice waveform */}
      <polygon className="frame" points={panelY(0, 6.5, 8.5, 14, 54)} />
      <polygon className="screen" points={panelY(0, 6.58, 8.42, 17, 51)} />
      <polyline className="wave" points={wave} />

      {/* Automation Lab: workflow nodes */}
      <polygon className="frame" points={panelY(0, 9.4, 11.7, 12, 56)} />
      <polygon className="screen" points={panelY(0, 9.48, 11.62, 15, 53)} />
      <polyline className="wire" points={`${pt(10.0, 0, 42)} ${pt(10.35, 0, 42)}`} />
      <polyline className="wire" points={`${pt(10.75, 0, 42)} ${pt(10.9, 0, 42)} ${pt(10.9, 0, 46)} ${pt(11.05, 0, 46)}`} />
      <polyline className="wire" points={`${pt(10.9, 0, 42)} ${pt(10.9, 0, 26)} ${pt(11.05, 0, 26)}`} />
      <polygon className="node" points={panelY(0, 9.6, 10.0, 38, 46)} />
      <polygon className="node" points={panelY(0, 10.35, 10.75, 38, 46)} />
      <polygon className="node node-gold" points={panelY(0, 11.05, 11.45, 42, 50)} />
      <polygon className="node" points={panelY(0, 11.05, 11.45, 22, 30)} />

      {/* Sales & CRM: pipeline board, five stages */}
      <polygon className="frame" points={panelX(0, 3.8, 6.2, 12, 56)} />
      <polygon className="screen" points={panelX(0, 3.88, 6.12, 15, 53)} />
      {[0, 1, 2, 3, 4].map((col) => {
        const y = 5.72 - col * 0.43;
        return (
          <g key={col}>
            <polygon className="screen-line" points={panelX(0, y, y + 0.3, 46, 48.5)} />
            {Array.from({ length: [3, 3, 2, 2, 1][col] }, (_, row) => (
              <polygon
                key={row}
                className={col === 4 ? "node node-gold" : "node"}
                points={panelX(0, y, y + 0.3, 36 - row * 8, 42 - row * 8)}
              />
            ))}
          </g>
        );
      })}

      {/* Clicking the workflow screen opens the Automation Lab */}
      <polygon className="display-hit" data-open="automation" points={panelY(0, 9.4, 11.7, 12, 56)} />

      {/* Clicking the pipeline board opens the CRM dashboard */}
      <polygon className="display-hit" data-open="crm" points={panelX(0, 3.8, 6.2, 12, 56)} />

      {/* Website & Funnel Studio: three site previews */}
      {[9.0, 8.2, 7.4].map((y) => (
        <g key={y}>
          <polygon className="frame" points={panelX(0, y - 0.06, y + 0.66, 14, 54)} />
          <polygon className="screen" points={panelX(0, y, y + 0.6, 17, 51)} />
          <polygon className="screen-gold" points={panelX(0, y, y + 0.6, 46, 51)} />
          <polygon className="screen-line" points={panelX(0, y + 0.08, y + 0.52, 33, 42)} />
          <polygon className="screen-line" points={panelX(0, y + 0.08, y + 0.4, 26, 28)} />
          <polygon className="screen-line" points={panelX(0, y + 0.08, y + 0.3, 21, 23)} />
        </g>
      ))}
    </g>
  );
}
