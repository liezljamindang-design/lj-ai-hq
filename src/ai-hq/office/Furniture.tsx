import type { FurnitureItem } from "../types";
import { project } from "./iso";
import { Box, panelY } from "./primitives";

const DESK_TOP = 15;

function Desk({ x, y, w, h, monitors = 1 }: FurnitureItem) {
  const slot = w / monitors;
  return (
    <>
      <Box x={x + 0.06} y={y + 0.08} w={0.1} h={h - 0.16} z1={DESK_TOP - 3} m="gold" />
      <Box x={x + w - 0.16} y={y + 0.08} w={0.1} h={h - 0.16} z1={DESK_TOP - 3} m="gold" />
      <Box x={x} y={y} w={w} h={h} z0={DESK_TOP - 3} z1={DESK_TOP} m="desk" />
      {Array.from({ length: monitors }, (_, i) => {
        const mx = x + slot * i + slot / 2 - 0.22;
        const my = y + 0.12;
        return (
          <g key={i}>
            <Box x={mx + 0.19} y={my} w={0.06} h={0.06} z0={DESK_TOP} z1={DESK_TOP + 5} m="dark" />
            <Box x={mx} y={my} w={0.44} h={0.05} z0={DESK_TOP + 4} z1={DESK_TOP + 21} m="dark" />
            <polygon className="screen" points={panelY(my + 0.05, mx + 0.03, mx + 0.41, DESK_TOP + 6, DESK_TOP + 19)} />
            <polygon className="screen-line" points={panelY(my + 0.05, mx + 0.07, mx + 0.3, DESK_TOP + 14, DESK_TOP + 15.5)} />
            <polygon className="screen-line" points={panelY(my + 0.05, mx + 0.07, mx + 0.22, DESK_TOP + 10, DESK_TOP + 11.5)} />
          </g>
        );
      })}
    </>
  );
}

function Chair({ x, y, w, h }: FurnitureItem) {
  return (
    <>
      <Box x={x + w / 2 - 0.04} y={y + h / 2 - 0.04} w={0.08} h={0.08} z1={7} m="gold" />
      <Box x={x} y={y} w={w} h={h} z0={7} z1={10} m="dark" />
      <Box x={x} y={y + h - 0.07} w={w} h={0.07} z0={10} z1={21} m="dark" />
    </>
  );
}

function Plant({ x, y, w, h }: FurnitureItem) {
  const [cx, cy] = project(x + w / 2, y + h / 2);
  return (
    <>
      <Box x={x} y={y} w={w} h={h} z1={10} m="pot" />
      <ellipse className="leaf-b" cx={cx - 5} cy={cy - 19} rx={7} ry={9} />
      <ellipse className="leaf-b" cx={cx + 6} cy={cy - 20} rx={7} ry={9} />
      <ellipse className="leaf-a" cx={cx} cy={cy - 26} rx={8} ry={11} />
    </>
  );
}

function Sofa({ x, y, w, h }: FurnitureItem) {
  const alongX = w >= h;
  return (
    <>
      {alongX ? (
        <Box x={x} y={y} w={w} h={0.16} z1={19} m="soft" />
      ) : (
        <Box x={x + w - 0.16} y={y} w={0.16} h={h} z1={19} m="soft" />
      )}
      {alongX ? (
        <Box x={x} y={y + 0.16} w={w} h={h - 0.16} z1={9} m="soft" />
      ) : (
        <Box x={x} y={y} w={w - 0.16} h={h} z1={9} m="soft" />
      )}
    </>
  );
}

function Table({ x, y, w, h }: FurnitureItem) {
  return (
    <>
      <Box x={x + w / 2 - 0.2} y={y + h / 2 - 0.15} w={0.4} h={0.3} z1={12} m="gold" />
      <Box x={x} y={y} w={w} h={h} z0={12} z1={15} m="desk" />
    </>
  );
}

function Rack({ x, y, w, h }: FurnitureItem) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} z1={46} m="dark" />
      {[36, 27, 18].map((z) => (
        <polygon key={z} className="screen-line" points={panelY(y + h, x + 0.06, x + w - 0.06, z, z + 2)} />
      ))}
    </>
  );
}

function Kiosk({ x, y, w, h }: FurnitureItem) {
  return (
    <>
      <Box x={x + 0.1} y={y + 0.1} w={w - 0.2} h={h - 0.2} z1={22} m="gold" />
      <Box x={x} y={y} w={w} h={h} z0={22} z1={26} m="dark" />
      <polygon className="screen" points={panelY(y + h, x + 0.04, x + w - 0.04, 22.6, 25.4)} />
    </>
  );
}

function Board({ x, y, w, h }: FurnitureItem) {
  return (
    <>
      <Box x={x + 0.1} y={y} w={0.08} h={h} z1={10} m="gold" />
      <Box x={x + w - 0.18} y={y} w={0.08} h={h} z1={10} m="gold" />
      <Box x={x} y={y} w={w} h={h} z0={10} z1={50} m="dark" />
      <polygon className="screen" points={panelY(y + h, x + 0.06, x + w - 0.06, 13, 47)} />
      {[40, 33, 26, 19].map((z, i) => (
        <polygon
          key={z}
          className={i === 2 ? "screen-alert" : "screen-line"}
          points={panelY(y + h, x + 0.16, x + 0.16 + [0.77, 0.54, 0.88, 0.42][i] * (w - 0.32), z, z + 2.4)}
        />
      ))}
    </>
  );
}

const Cabinet = ({ x, y, w, h }: FurnitureItem) => <Box x={x} y={y} w={w} h={h} z1={20} m="desk" />;
const LowTable = ({ x, y, w, h }: FurnitureItem) => <Box x={x} y={y} w={w} h={h} z0={5} z1={8} m="desk" />;

function Counter({ x, y, w, h }: FurnitureItem) {
  return (
    <>
      <Box x={x} y={y} w={w} h={h} z1={19} m="desk" />
      <Box x={x} y={y + h - 0.12} w={w} h={0.12} z0={19} z1={24} m="gold" />
    </>
  );
}

const RENDERERS = {
  desk: Desk,
  chair: Chair,
  plant: Plant,
  sofa: Sofa,
  table: Table,
  "low-table": LowTable,
  rack: Rack,
  kiosk: Kiosk,
  board: Board,
  cabinet: Cabinet,
  counter: Counter,
} as const;

export function Furniture({ item }: { item: FurnitureItem }) {
  const Render = RENDERERS[item.kind];
  return <Render {...item} />;
}
