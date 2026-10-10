import { useMemo, type ReactNode } from "react";
import { FURNITURE, GLASS_WALLS, WALL_HEIGHT } from "../data/furniture";
import { FLOOR, ZONES } from "../data/zones";
import { useHq } from "../store/hqStore";
import { Furniture } from "./Furniture";
import { project, rectPoints } from "./iso";
import { panelX, panelY, pt } from "./primitives";
import { WallDisplays } from "./WallDisplays";

const SLAB = 14; // visible thickness of the floor slab, in screen pixels

/**
 * The isometric office. Rooms are selectable; the directory is the keyboard path.
 * Furniture and glass are sorted back to front (painter's order) by the sum of
 * their floor coordinates, which is the depth axis in this projection.
 */
export function FloorMap() {
  const selected = useHq((s) => s.selectedZone);
  const selectZone = useHq((s) => s.selectZone);
  const { width: W, depth: D } = FLOOR;

  // Static scene: built once, never re-rendered when a room is selected.
  const scene = useMemo(() => {
    const layers: { depth: number; node: ReactNode }[] = [];
    for (const item of FURNITURE) {
      layers.push({
        depth: item.x + item.w / 2 + item.y + item.h / 2,
        node: <Furniture key={item.id} item={item} />,
      });
    }
    for (const wall of GLASS_WALLS) {
      const mid = (wall.from + wall.to) / 2;
      const points =
        wall.axis === "x"
          ? panelX(wall.at, wall.from, wall.to, 0, wall.height)
          : panelY(wall.at, wall.from, wall.to, 0, wall.height);
      layers.push({ depth: wall.at + mid, node: <polygon key={wall.id} className="glass" points={points} /> });
    }
    return layers.sort((a, b) => a.depth - b.depth).map((l) => l.node);
  }, []);

  const leftFace = `${pt(0, D)} ${pt(W, D)} ${pt(W, D, -SLAB)} ${pt(0, D, -SLAB)}`;
  const rightFace = `${pt(W, 0)} ${pt(W, D)} ${pt(W, D, -SLAB)} ${pt(W, 0, -SLAB)}`;
  const [doorX, doorY] = project(8.25, D);

  return (
    <div className="floor">
      <svg viewBox="-336 -84 736 468" className="floor-svg" aria-hidden="true" focusable="false">
        <polygon className="slab-side slab-side-left" points={leftFace} />
        <polygon className="slab-side slab-side-right" points={rightFace} />
        <polygon className="slab-top" points={rectPoints(0, 0, W, D)} />

        {/* Solid outer walls along the two back edges */}
        <polygon className="wall wall-right" points={panelY(0, 0, W, 0, WALL_HEIGHT)} />
        <polygon className="wall wall-left" points={panelX(0, 0, D, 0, WALL_HEIGHT)} />
        <polyline className="wall-cap" points={`${pt(0, D, WALL_HEIGHT)} ${pt(0, 0, WALL_HEIGHT)} ${pt(W, 0, WALL_HEIGHT)}`} />

        {/* Entrance threshold on the front edge, in front of Reception */}
        <polyline className="entrance" points={`${pt(7.5, D)} ${pt(9, D)}`} />
        <text className="entrance-label" x={doorX - 6} y={doorY + 30} textAnchor="end">
          Entrance
        </text>

        {ZONES.map((zone) => {
          const { x, y, w, h } = zone.rect;
          const isSelected = selected === zone.id;
          const [kx, ky] = project(x + 0.42, y + h - 0.42);
          const [tx, ty] = project(x + 0.78, y + h - 0.3);
          return (
            <g
              key={zone.id}
              className={`zone${isSelected ? " is-selected" : ""}`}
              onClick={() => selectZone(isSelected ? null : zone.id)}
            >
              <polygon className="zone-plate" points={rectPoints(x, y, w, h, 0, 0.1)} />
              {/* Room name printed flat on the floor along the front edge */}
              <text className="zone-name" transform={`matrix(0.894 0.447 -0.894 0.447 ${tx} ${ty})`}>
                {zone.floorLabel ?? zone.name}
              </text>
              <circle className="zone-key" cx={kx} cy={ky} r={8.5} />
              <text className="zone-key-text" x={kx} y={ky + 3.4} textAnchor="middle">
                {zone.key}
              </text>
            </g>
          );
        })}

        <WallDisplays />
        <g className="scene">{scene}</g>
      </svg>
    </div>
  );
}
