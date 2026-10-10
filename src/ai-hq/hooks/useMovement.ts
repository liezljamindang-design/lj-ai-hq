import { useEffect, type RefObject } from "react";
import { project } from "../office/iso";
import { canStand, findPath, sceneToFloor, SPEED, START, zoneAt, zoneEntry, type Point, type Rect } from "../office/engine";
import { FLOOR } from "../data/zones";
import { useHq } from "../store/hqStore";

/** Centre of the drawing, in scene pixels. The camera pivots around it. */
const CENTRE = { x: 32, y: 150 };

const KEY_DIRS: Record<string, [number, number]> = {
  // Screen-relative: "up" walks toward the back wall, which is -x and -y on the floor.
  ArrowUp: [-1, -1], w: [-1, -1], W: [-1, -1],
  ArrowDown: [1, 1], s: [1, 1], S: [1, 1],
  ArrowLeft: [-1, 1], a: [-1, 1], A: [-1, 1],
  ArrowRight: [1, -1], d: [1, -1], D: [1, -1],
};

interface Options {
  svgRef: RefObject<SVGSVGElement | null>;
  cameraRef: RefObject<SVGGElement | null>;
  avatarRef: RefObject<SVGGElement | null>;
  /** Footprints of the scene objects, in draw order. Used to slot the avatar in front of or behind them. */
  boxes: (Rect & { depth: number })[];
  onSlot: (slot: number) => void;
}

/**
 * Drives the avatar and camera. Positions are written straight to the SVG each
 * frame, so walking never re-renders React. The loop stops when nothing moves.
 */
export function useMovement({ svgRef, cameraRef, avatarRef, boxes, onSlot }: Options) {
  useEffect(() => {
    const svg = svgRef.current;
    const camera = cameraRef.current;
    const avatar = avatarRef.current;
    if (!svg || !camera || !avatar) return;

    const pos: Point = { ...START };
    let path: Point[] = [];
    const held = new Set<string>();
    let zone = zoneAt(pos.x, pos.y);
    let slot = -1;
    let raf = 0;
    let running = false;
    let last = 0;

    const mobile = window.matchMedia("(max-width: 900px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cam = { x: CENTRE.x, y: CENTRE.y, z: 1 };

    /** Where the camera wants to be. Desktop drifts a little toward the avatar; phones zoom in and follow. */
    function cameraGoal() {
      if (useHq.getState().overview) return { x: CENTRE.x, y: CENTRE.y, z: 1 };
      const [sx, sy] = project(pos.x, pos.y);
      if (mobile.matches) return { x: sx, y: sy - 14, z: 2.1 };
      const pull = reduce.matches ? 0 : 0.16;
      return { x: CENTRE.x + (sx - CENTRE.x) * pull, y: CENTRE.y + (sy - CENTRE.y) * pull, z: 1 };
    }

    function updateSlot() {
      let frontMax = -1;
      let behindMin = -1;
      boxes.forEach((b, i) => {
        const dx = Math.max(b.x - pos.x, 0, pos.x - (b.x + b.w));
        const dy = Math.max(b.y - pos.y, 0, pos.y - (b.y + b.h));
        if (dx > 1.5 || dy > 1.5) return;
        const inFront = pos.x > b.x + b.w || pos.y > b.y + b.h;
        const behind = pos.x < b.x || pos.y < b.y;
        if (inFront && !behind) frontMax = i;
        else if (behind && !inFront && behindMin < 0) behindMin = i;
      });
      let next: number;
      if (frontMax < 0 && behindMin < 0) {
        const d = pos.x + pos.y;
        next = boxes.findIndex((b) => b.depth > d);
        if (next < 0) next = boxes.length;
      } else if (behindMin >= 0 && frontMax < behindMin) next = behindMin;
      else next = frontMax + 1;
      if (next !== slot) { slot = next; onSlot(next); }
    }

    function draw() {
      const [sx, sy] = project(pos.x, pos.y);
      avatar!.setAttribute("transform", `translate(${sx.toFixed(2)} ${sy.toFixed(2)})`);
      camera!.setAttribute(
        "transform",
        `translate(${CENTRE.x} ${CENTRE.y}) scale(${cam.z.toFixed(4)}) translate(${(-cam.x).toFixed(2)} ${(-cam.y).toFixed(2)})`,
      );
    }

    function leaveOverview() {
      if (useHq.getState().overview) useHq.getState().setOverview(false);
    }

    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let moving = false;

      // Keyboard takes priority and cancels any tap-to-move route.
      let kx = 0;
      let ky = 0;
      for (const k of held) { kx += KEY_DIRS[k][0]; ky += KEY_DIRS[k][1]; }
      if (kx || ky) {
        path = [];
        const len = Math.hypot(kx, ky);
        const stepX = (kx / len) * SPEED * dt;
        const stepY = (ky / len) * SPEED * dt;
        // Try the full step, then each axis alone, so the avatar slides along walls and desks.
        if (canStand(pos.x + stepX, pos.y + stepY)) { pos.x += stepX; pos.y += stepY; moving = true; }
        else if (stepX && canStand(pos.x + stepX, pos.y)) { pos.x += stepX; moving = true; }
        else if (stepY && canStand(pos.x, pos.y + stepY)) { pos.y += stepY; moving = true; }
      } else if (path.length) {
        let budget = SPEED * dt;
        while (budget > 0 && path.length) {
          const t = path[0];
          const d = Math.hypot(t.x - pos.x, t.y - pos.y);
          if (d <= budget) { pos.x = t.x; pos.y = t.y; budget -= d; path.shift(); }
          else { pos.x += ((t.x - pos.x) / d) * budget; pos.y += ((t.y - pos.y) / d) * budget; budget = 0; }
        }
        moving = true;
      }

      if (moving) {
        updateSlot();
        const z = zoneAt(pos.x, pos.y);
        if (z !== zone) {
          zone = z;
          if (z) useHq.getState().selectZone(z);
        }
      }
      avatar!.classList.toggle("is-walking", moving);

      // Ease the camera toward its goal. Exponential smoothing keeps it gentle at any frame rate.
      const goal = cameraGoal();
      const k = reduce.matches ? 1 : 1 - Math.exp(-dt * 3.2);
      cam.x += (goal.x - cam.x) * k;
      cam.y += (goal.y - cam.y) * k;
      cam.z += (goal.z - cam.z) * k;
      const settled = Math.abs(goal.x - cam.x) < 0.2 && Math.abs(goal.y - cam.y) < 0.2 && Math.abs(goal.z - cam.z) < 0.002;

      draw();
      if (moving || held.size || path.length || !settled) raf = requestAnimationFrame(frame);
      else running = false;
    }

    function kick() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function walkTo(target: Point) {
      leaveOverview();
      path = findPath(pos, target);
      kick();
    }

    const dialogOpen = () => useHq.getState().onboardingOpen || useHq.getState().helpOpen;

    function onKeyDown(e: KeyboardEvent) {
      if (!(e.key in KEY_DIRS) || e.metaKey || e.ctrlKey || e.altKey || dialogOpen()) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault(); // arrow keys would otherwise scroll the page
      held.add(e.key);
      leaveOverview();
      kick();
    }
    const onKeyUp = (e: KeyboardEvent) => { held.delete(e.key); };
    const onBlur = () => held.clear();

    function onClick(e: MouseEvent) {
      const ctm = camera!.getScreenCTM();
      if (!ctm) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      const f = sceneToFloor(p.x, p.y);
      if (f.x < -0.6 || f.y < -0.6 || f.x > FLOOR.width + 0.6 || f.y > FLOOR.depth + 0.6) return;
      walkTo(f);
    }

    const unsubscribe = useHq.subscribe((s, prev) => {
      if (s.walkRequest && s.walkRequest !== prev.walkRequest) walkTo(zoneEntry(s.walkRequest.zone));
      if (s.overview !== prev.overview) kick();
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    svg.addEventListener("click", onClick);
    mobile.addEventListener("change", kick);

    // First frame: place everything without easing.
    Object.assign(cam, cameraGoal());
    updateSlot();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      svg.removeEventListener("click", onClick);
      mobile.removeEventListener("change", kick);
    };
  }, [svgRef, cameraRef, avatarRef, boxes, onSlot]);
}
