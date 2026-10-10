import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { FURNITURE, GLASS_WALLS, WALL_HEIGHT } from "../data/furniture";
import { FLOOR, ZONES } from "../data/zones";
import { useMovement } from "../hooks/useMovement";
import { useHq } from "../store/hqStore";
import { TalkPrompt } from "../components/TalkPrompt";
import { AgentFigure } from "./AgentFigure";
import { Avatar } from "./Avatar";
import { agentRect, wallRect, type Rect } from "./engine";
import { Furniture } from "./Furniture";
import { project, rectPoints } from "./iso";
import { panelX, panelY, pt } from "./primitives";
import { WallDisplays } from "./WallDisplays";

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
        node: <AgentFigure key={agent.id} agent={agent} active={agent.id === openAgentId} />,
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
  }, [agents, openAgentId]);

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
    <div className="floor">
      <svg ref={svgRef} viewBox="-336 -84 736 468" className="floor-svg" aria-hidden="true" focusable="false">
        <g ref={cameraRef}>
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

        <WallDisplays />
        <g className="scene">
          {nodes.slice(0, slot)}
          <Avatar key="avatar" ref={avatarRef} />
          {nodes.slice(slot)}
        </g>
        </g>
      </svg>
      <TalkPrompt />
      {overview ? (
        <p className="floor-note">Showing the whole floor. Move to follow your avatar again.</p>
      ) : (
        <button type="button" className="floor-btn" onClick={() => setOverview(true)}>Reset view</button>
      )}
    </div>
  );
}
