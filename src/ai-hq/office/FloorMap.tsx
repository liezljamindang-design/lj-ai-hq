import { FLOOR, ZONES } from "../data/zones";
import { useHq } from "../store/hqStore";
import { project, rectPoints } from "./iso";

const SLAB = 14; // visible thickness of the floor slab, in screen pixels

/** Isometric plan of the single HQ floor. Rooms are selectable; the directory is the keyboard path. */
export function FloorMap() {
  const selected = useHq((s) => s.selectedZone);
  const selectZone = useHq((s) => s.selectZone);
  const { width: W, depth: D } = FLOOR;

  const pt = (x: number, y: number, z = 0) => project(x, y, z).join(",");
  const leftFace = `${pt(0, D)} ${pt(W, D)} ${pt(W, D, -SLAB)} ${pt(0, D, -SLAB)}`;
  const rightFace = `${pt(W, 0)} ${pt(W, D)} ${pt(W, D, -SLAB)} ${pt(W, 0, -SLAB)}`;
  const [doorX, doorY] = project(8.25, D);

  return (
    <div className="floor">
      <svg viewBox="-336 -16 736 400" className="floor-svg" aria-hidden="true" focusable="false">
        <polygon className="slab-side slab-side-left" points={leftFace} />
        <polygon className="slab-side slab-side-right" points={rightFace} />
        <polygon className="slab-top" points={rectPoints(0, 0, W, D)} />

        {/* Entrance threshold on the front edge, in front of Reception */}
        <polyline className="entrance" points={`${pt(7.5, D)} ${pt(9, D)}`} />
        <text className="entrance-label" x={doorX - 6} y={doorY + 30} textAnchor="end">
          Entrance
        </text>

        {ZONES.map((zone) => {
          const { x, y, w, h } = zone.rect;
          const [cx, cy] = project(x + w / 2, y + h / 2);
          const isSelected = selected === zone.id;
          return (
            <g
              key={zone.id}
              className={`zone${isSelected ? " is-selected" : ""}`}
              onClick={() => selectZone(isSelected ? null : zone.id)}
            >
              <polygon className="zone-plate" points={rectPoints(x, y, w, h, 0, 0.14)} />
              <circle className="zone-key" cx={cx} cy={cy - 6} r={12} />
              <text className="zone-key-text" x={cx} y={cy - 1.5} textAnchor="middle">
                {zone.key}
              </text>
              <text className="zone-name" x={cx} y={cy + 20} textAnchor="middle">
                {zone.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
