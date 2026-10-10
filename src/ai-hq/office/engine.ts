import { AGENTS } from "../data/agents";
import { FURNITURE, GLASS_WALLS } from "../data/furniture";
import { FLOOR, ZONES } from "../data/zones";
import type { ZoneId } from "../types";

/**
 * Movement rules for the visitor avatar. No physics library: obstacles are the
 * furniture footprints and glass walls, the avatar is a small circle, and
 * tap-to-move uses A* over a coarse grid.
 */
export interface Point { x: number; y: number }
export interface Rect { x: number; y: number; w: number; h: number }

export const PLAYER_RADIUS = 0.2;
/** Floor units per second. A calm walking pace: the full floor takes about five seconds to cross. */
export const SPEED = 2.3;
export const START: Point = { x: 8.25, y: 9.55 };

export const wallRect = (w: (typeof GLASS_WALLS)[number]): Rect =>
  w.axis === "x"
    ? { x: w.at - 0.04, y: w.from, w: 0.08, h: w.to - w.from }
    : { x: w.from, y: w.at - 0.04, w: w.to - w.from, h: 0.08 };

/** Footprint of an AI employee: the avatar walks around them, not through them. */
export const agentRect = (pos: Point): Rect => ({ x: pos.x - 0.17, y: pos.y - 0.17, w: 0.34, h: 0.34 });

const OBSTACLES: Rect[] = [...FURNITURE, ...GLASS_WALLS.map(wallRect), ...AGENTS.map((a) => agentRect(a.pos))];

/** How close the avatar must be to an employee for the "talk to" prompt to appear. */
export const TALK_RANGE = 1.5;

/** Where a visitor stands to talk to an employee: in front of them if there is room, otherwise beside them. */
export function talkSpot(pos: Point): Point {
  const offsets = [[0, 0.7], [0, 1.2], [0.7, 0], [-0.7, 0], [0, -0.7]];
  for (const [dx, dy] of offsets) {
    if (canStand(pos.x + dx, pos.y + dy)) return { x: pos.x + dx, y: pos.y + dy };
  }
  return pos;
}

export function agentNear(x: number, y: number): string | null {
  let best: string | null = null;
  let bestD = TALK_RANGE;
  for (const a of AGENTS) {
    const d = Math.hypot(a.pos.x - x, a.pos.y - y);
    if (d < bestD) { bestD = d; best = a.id; }
  }
  return best;
}

/** True if the avatar's circle fits at this point without touching an obstacle or leaving the floor. */
export function canStand(x: number, y: number): boolean {
  const r = PLAYER_RADIUS;
  if (x < r || y < r || x > FLOOR.width - r || y > FLOOR.depth - r) return false;
  for (const o of OBSTACLES) {
    if (x > o.x - r && x < o.x + o.w + r && y > o.y - r && y < o.y + o.h + r) return false;
  }
  return true;
}

export function zoneAt(x: number, y: number): ZoneId | null {
  for (const z of ZONES) {
    const r = z.rect;
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return z.id;
  }
  return null;
}

/** Where the avatar walks to when a room is picked from the directory: the clear strip at its front. */
export function zoneEntry(id: ZoneId): Point {
  const r = ZONES.find((z) => z.id === id)!.rect;
  return { x: r.x + r.w / 2, y: r.y + r.h - 0.4 };
}

/** Inverse of the isometric projection: scene pixels back to floor units. */
export function sceneToFloor(sx: number, sy: number): Point {
  return { x: (sx / 32 + sy / 16) / 2, y: (sy / 16 - sx / 32) / 2 };
}

/* ---------- Pathfinding grid ---------- */
const CELL = 0.25;
const COLS = Math.round(FLOOR.width / CELL);
const ROWS = Math.round(FLOOR.depth / CELL);
const centre = (i: number): Point => ({ x: ((i % COLS) + 0.5) * CELL, y: (Math.floor(i / COLS) + 0.5) * CELL });
const BLOCKED = new Uint8Array(COLS * ROWS);
for (let i = 0; i < BLOCKED.length; i++) {
  const c = centre(i);
  BLOCKED[i] = canStand(c.x, c.y) ? 0 : 1;
}

/** Nearest walkable cell to a point, searching outward in rings. */
function nearestFreeCell(p: Point): number {
  const cx = Math.min(COLS - 1, Math.max(0, Math.floor(p.x / CELL)));
  const cy = Math.min(ROWS - 1, Math.max(0, Math.floor(p.y / CELL)));
  for (let ring = 0; ring < Math.max(COLS, ROWS); ring++) {
    let best = -1;
    let bestD = Infinity;
    for (let y = cy - ring; y <= cy + ring; y++) {
      for (let x = cx - ring; x <= cx + ring; x++) {
        if (x < 0 || y < 0 || x >= COLS || y >= ROWS) continue;
        if (Math.max(Math.abs(x - cx), Math.abs(y - cy)) !== ring) continue;
        const i = y * COLS + x;
        if (BLOCKED[i]) continue;
        const c = centre(i);
        const d = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
        if (d < bestD) { bestD = d; best = i; }
      }
    }
    if (best >= 0) return best;
  }
  return 0;
}

function astar(start: number, goal: number): number[] {
  const n = COLS * ROWS;
  const g = new Float32Array(n).fill(Infinity);
  const f = new Float32Array(n).fill(Infinity);
  const came = new Int32Array(n).fill(-1);
  const queued = new Uint8Array(n);
  const closed = new Uint8Array(n);
  const gx = goal % COLS;
  const gy = Math.floor(goal / COLS);
  const open = [start];
  g[start] = 0;
  f[start] = 0;

  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (f[open[i]] < f[open[bi]]) bi = i;
    const cur = open[bi];
    open[bi] = open[open.length - 1];
    open.pop();
    if (cur === goal) {
      const out: number[] = [];
      for (let c = cur; c !== -1; c = came[c]) out.push(c);
      return out.reverse();
    }
    closed[cur] = 1;
    const cx = cur % COLS;
    const cy = Math.floor(cur / COLS);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        const ni = ny * COLS + nx;
        if (BLOCKED[ni] || closed[ni]) continue;
        // No cutting across the corner of an obstacle.
        if (dx && dy && (BLOCKED[cy * COLS + nx] || BLOCKED[ny * COLS + cx])) continue;
        const t = g[cur] + (dx && dy ? Math.SQRT2 : 1);
        if (t < g[ni]) {
          came[ni] = cur;
          g[ni] = t;
          const hx = Math.abs(nx - gx);
          const hy = Math.abs(ny - gy);
          f[ni] = t + Math.max(hx, hy) + (Math.SQRT2 - 1) * Math.min(hx, hy);
          if (!queued[ni]) { queued[ni] = 1; open.push(ni); }
        }
      }
    }
  }
  return [];
}

function clearLine(a: Point, b: Point): boolean {
  const steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 0.08);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    if (!canStand(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
  }
  return true;
}

/** A walkable route from one point to (or as near as possible to) another, with needless zigzags removed. */
export function findPath(from: Point, to: Point): Point[] {
  const cells = astar(nearestFreeCell(from), nearestFreeCell(to));
  if (!cells.length) return [];
  const raw = cells.map(centre);
  if (canStand(to.x, to.y)) raw.push(to);

  const path: Point[] = [];
  let anchor = from;
  let i = 0;
  while (i < raw.length) {
    let far = i;
    for (let j = raw.length - 1; j > i; j--) {
      if (clearLine(anchor, raw[j])) { far = j; break; }
    }
    path.push(raw[far]);
    anchor = raw[far];
    i = far + 1;
  }
  return path;
}
