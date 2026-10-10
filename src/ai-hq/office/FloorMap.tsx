import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { FURNITURE, GLASS_WALLS, RUGS, WALL_HEIGHT } from "../data/furniture";
import { FLOOR, ZONES } from "../data/zones";
import { useMovement } from "../hooks/useMovement";
import { useHq } from "../store/hqStore";
import { DemoTicker } from "../components/DemoTicker";
import { TalkPrompt } from "../components/TalkPrompt";
import { AgentFigure } from "./AgentFigure";
import { Avatar } from "./Avatar";
import { agentRect, wallRect, type Rect } from "./engine";
import { Furniture } from "./Furniture";
import { project, rectPoints } from "./iso";
import { panelX, panelY, pt } from "./primitives";
import { WallDisplays } from "./WallDisplays";

/** Marble veins, as paths in floor units. Fixed, so the floor looks the same on every visit. */
const VEINS: [number, number][][] = [
  [[0.4, 3.2], [1.6, 3.35], [2.5, 3.1], [3.9, 3.3], [5.2, 3.15]],
  [[4.3, 4.2], [5.1, 5.0], [5.4, 5.9], [6.3, 6.6], [7.1, 6.9]],
  [[6.2, 3.3], [7.4, 3.2], [8.1, 3.35], [9.6, 3.1], [11.7, 3.3]],
  [[4.2, 7.4], [4.35, 8.3], [4.2, 9.0], [4.4, 9.8]],
  [[5.6, 4.0], [6.6, 4.5], [7.5, 4.4], [7.9, 5.3]],
  [[0.3, 6.75], [1.5, 6.6], [2.6, 6.8], [4.0, 6.7]],
];

const SLAB = 14; // visible thickness of the floor slab, in screen pixels

/**
 * The isometric office. The visitor walks with the keyboard or by tapping the
 * floor; the directory is the screen-reader path. Furniture and glass are sorted
 * back to front (painter's order) by the sum of their floor coordinates, the
 * depth axis in this projection, and the avatar is slotted into that order.
 */
export function FloorMap() {
  const selected = useHq((s) => s.selectedZone);
  const overview = useHq((s) => s.overview);
  const setOverview = useHq((s) => s.setOverview);
  const agents = useHq((s) => s.agents);
  const openAgentId = useHq((s) => s.openAgentId);
  const holderId = useHq((s) => s.holderId);
  const token = useHq((s) => s.token);
  const demoRunning = useHq((s) => s.demo.status === "running");
  const svgRef = useRef<SVGSVGElement>(null);
  const cameraRef = useRef<SVGGElement>(null);
  const avatarRef = useRef<SVGGElement>(null);
  const { width: W, depth: D } = FLOOR;

  // Scene layers are sorted once per data change. Only the avatar's slot in the order moves while walking.
  const { nodes, boxes } = useMemo(() => {
    const layers: { depth: number; box: Rect; node: ReactNode }[] = [];
    for (const agent of agents) {
      layers.push({
        depth: agent.pos.x + agent.pos.y,
        box: agentRect(agent.pos),
        node: <AgentFigure key={agent.id} agent={agent} active={agent.id === openAgentId} holding={agent.id === holderId} />,
      });
    }
    for (const item of FURNITURE) {
      layers.push({
        depth: item.x + item.w / 2 + item.y + item.h / 2,
        box: item,
        node: <Furniture key={item.id} item={item} />,
      });
    }
    for (const wall of GLASS_WALLS) {
      const mid = (wall.from + wall.to) / 2;
      const points =
        wall.axis === "x"
          ? panelX(wall.at, wall.from, wall.to, 0, wall.height)
          : panelY(wall.at, wall.from, wall.to, 0, wall.height);
      layers.push({ depth: wall.at + mid, box: wallRect(wall), node: <polygon key={wall.id} className="glass" points={points} /> });
    }
    layers.sort((a, b) => a.depth - b.depth);
    return {
      nodes: layers.map((l) => l.node),
      boxes: layers.map((l) => ({ x: l.box.x, y: l.box.y, w: l.box.w, h: l.box.h, depth: l.depth })),
    };
  }, [agents, openAgentId, holderId]);

  const [slot, setSlot] = useState(nodes.length);
  const onSlot = useCallback((next: number) => setSlot(next), []);
  // The movement loop reads the footprints through a ref, so it keeps running when the scene updates.
  const boxesRef = useRef(boxes);
  boxesRef.current = boxes;
  useMovement({ svgRef, cameraRef, avatarRef, boxesRef, onSlot });

  const leftFace = `${pt(0, D)} ${pt(W, D)} ${pt(W, D, -SLAB)} ${pt(0, D, -SLAB)}`;
  const rightFace = `${pt(W, 0)} ${pt(W, D)} ${pt(W, D, -SLAB)} ${pt(W, 0, -SLAB)}`;
  const [doorX, doorY] = project(8.25, D);

  return (
    <div className={`floor${demoRunning ? " demo-running" : ""}`}>
      <svg ref={svgRef} viewBox="-336 -84 736 468" className="floor-svg" aria-hidden="true" focusable="false">
        <g ref={cameraRef}>
        <polygon className="slab-side slab-side-left" points={leftFace} />
        <polygon className="slab-side slab-side-right" points={rightFace} />
        <polygon className="slab-top" points={rectPoints(0, 0, W, D)} />

        {/* Polished marble: large tiles with a fine brass inlay, and a few soft veins */}
        <g className="marble">
          {[2, 4, 6, 8, 10].map((x) => <polyline key={`tx${x}`} className="tile-line" points={`${pt(x, 0)} ${pt(x, D)}`} />)}
          {[2, 4, 6, 8].map((y) => <polyline key={`ty${y}`} className="tile-line" points={`${pt(0, y)} ${pt(W, y)}`} />)}
          {VEINS.map((v, i) => <polyline key={i} className="vein" points={v.map(([x, y]) => pt(x, y)).join(" ")} />)}
        </g>

        {/* Solid outer walls along the two back edges */}
        <polygon className="wall wall-right" points={panelY(0, 0, W, 0, WALL_HEIGHT)} />
        <polygon className="wall wall-left" points={panelX(0, 0, D, 0, WALL_HEIGHT)} />
        <polyline className="wall-cap" points={`${pt(0, D, WALL_HEIGHT)} ${pt(0, 0, WALL_HEIGHT)} ${pt(W, 0, WALL_HEIGHT)}`} />
        {/* Brass molding: a baseboard line and a picture rail on both walls */}
        {[7, WALL_HEIGHT - 7].map((z) => (
          <polyline key={z} className="molding" points={`${pt(0, D, z)} ${pt(0, 0, z)} ${pt(W, 0, z)}`} />
        ))}

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
            <g key={zone.id} className={`zone${isSelected ? " is-selected" : ""}`}>
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

        {/* Rugs and the entrance runner lie on the floor, under the furniture */}
        <g className="rugs">
          {RUGS.map((r) => (
            <g key={r.id}>
              <polygon className="rug" points={rectPoints(r.x, r.y, r.w, r.h)} />
              <polygon className="rug-edge" points={rectPoints(r.x, r.y, r.w, r.h, 0, 0.12)} />
            </g>
          ))}
        </g>

        <WallDisplays />
        <g className="scene">
          {nodes.slice(0, slot)}
          <Avatar key="avatar" ref={avatarRef} />
          {nodes.slice(slot)}
        </g>
        {/* The demo lead: a gold marker that glides from one employee to the next */}
        {token && (() => {
          const [tx, ty] = project(token.x, token.y);
          return (
            <g className="lead-token" style={{ transform: `translate(${tx.toFixed(1)}px, ${(ty - 44).toFixed(1)}px)` }}>
              <circle className="token-halo" r={10} />
              <circle className="token-core" r={5} />
            </g>
          );
        })()}
        </g>
      </svg>
      <DemoTicker />
      <TalkPrompt />
      {overview ? (
        <p className="floor-note">Showing the whole floor. Move to follow your avatar again.</p>
      ) : (
        <button type="button" className="floor-btn" onClick={() => setOverview(true)}>Reset view</button>
      )}
    </div>
  );
}
