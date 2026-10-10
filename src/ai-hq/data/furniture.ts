import type { FurnitureItem, WallSegment, ZoneId } from "../types";

/**
 * A desk with its monitors, plus one chair on the visitor-facing side.
 * Pass staffed = true where an AI employee stands at the desk instead of a chair.
 */
function workstation(id: string, zone: ZoneId, x: number, y: number, w: number, monitors: number, staffed = false): FurnitureItem[] {
  const desk: FurnitureItem = { id, kind: "desk", zone, x, y, w, h: 0.6, monitors };
  if (staffed) return [desk];
  return [desk, { id: `${id}-chair`, kind: "chair", zone, x: x + w / 2 - 0.19, y: y + 0.76, w: 0.38, h: 0.38 }];
}

const plant = (id: string, zone: ZoneId, x: number, y: number): FurnitureItem => ({
  id, kind: "plant", zone, x, y, w: 0.34, h: 0.34,
});

/** Everything standing on the floor. Each room keeps its front strip clear for walking and its floor label. */
export const FURNITURE: FurnitureItem[] = [
  // Executive Office
  ...workstation("exec-desk", "executive", 0.9, 0.9, 1.5, 1),
  { id: "exec-cabinet", kind: "cabinet", zone: "executive", x: 0.18, y: 0.5, w: 0.4, h: 1.0 },
  plant("exec-plant", "executive", 2.45, 0.3),

  // Meeting Room
  { id: "meet-table", kind: "table", zone: "meeting", x: 3.75, y: 0.95, w: 1.5, h: 0.85 },
  { id: "meet-chair-1", kind: "chair", zone: "meeting", x: 3.95, y: 0.45, w: 0.36, h: 0.36 },
  { id: "meet-chair-2", kind: "chair", zone: "meeting", x: 4.7, y: 0.45, w: 0.36, h: 0.36 },
  { id: "meet-chair-3", kind: "chair", zone: "meeting", x: 3.95, y: 1.95, w: 0.36, h: 0.36 },
  { id: "meet-chair-4", kind: "chair", zone: "meeting", x: 4.7, y: 1.95, w: 0.36, h: 0.36 },

  // AI Lab
  ...workstation("ai-desk-1", "ai-lab", 6.4, 0.9, 0.95, 1),
  ...workstation("ai-desk-2", "ai-lab", 7.6, 0.9, 0.95, 1),
  { id: "ai-rack", kind: "rack", zone: "ai-lab", x: 8.45, y: 0.25, w: 0.4, h: 0.5 },

  // Automation Lab
  ...workstation("auto-desk", "automation", 9.6, 1.0, 1.5, 2, true),
  plant("auto-plant", "automation", 11.45, 0.3),

  // Sales & CRM
  ...workstation("sales-desk-1", "sales", 0.7, 4.3, 1.3, 2, true),
  ...workstation("sales-desk-2", "sales", 2.3, 4.3, 1.3, 2),
  plant("sales-plant", "sales", 3.5, 3.75),

  // Operations
  { id: "ops-board", kind: "board", zone: "operations", x: 8.9, y: 3.75, w: 1.2, h: 0.14 },
  ...workstation("ops-desk", "operations", 9.9, 4.5, 1.5, 2, true),
  plant("ops-plant", "operations", 8.2, 4.6),

  // Website & Funnel Studio
  ...workstation("studio-bench", "studio", 0.7, 7.75, 2.3, 3),
  plant("studio-plant", "studio", 3.5, 7.3),

  // Reception
  { id: "rec-counter", kind: "counter", zone: "reception", x: 6.5, y: 8.0, w: 1.9, h: 0.6 },
  { id: "rec-kiosk", kind: "kiosk", zone: "reception", x: 5.3, y: 8.6, w: 0.36, h: 0.36 },
  plant("rec-plant-1", "reception", 4.75, 7.25),
  { id: "lounge-sofa-1", kind: "sofa", zone: "reception", x: 9.5, y: 7.4, w: 1.6, h: 0.6 },
  { id: "lounge-sofa-2", kind: "sofa", zone: "reception", x: 11.25, y: 8.1, w: 0.6, h: 1.3 },
  { id: "lounge-table", kind: "low-table", zone: "reception", x: 9.85, y: 8.35, w: 0.9, h: 0.55 },
  plant("rec-plant-2", "reception", 11.45, 7.3),
];

export const WALL_HEIGHT = 64;
const GLASS = 44;

/** Interior glass partitions. The two solid outer walls are drawn separately as the backdrop. */
export const GLASS_WALLS: WallSegment[] = [
  { id: "g-exec-meet", axis: "x", at: 3, from: 0, to: 3, height: GLASS },
  { id: "g-meet-ai", axis: "x", at: 6, from: 0, to: 3, height: GLASS },
  { id: "g-ai-auto", axis: "x", at: 9, from: 0, to: 3, height: GLASS },
  { id: "g-exec-front", axis: "y", at: 3, from: 0, to: 2, height: GLASS },
  { id: "g-meet-front", axis: "y", at: 3, from: 3, to: 5, height: GLASS },
];
