import { forwardRef } from "react";
import { ChibiArt } from "./Chibi";

/** The visitor. Its position is set by useMovement directly on the element, not through React state. */
export const Avatar = forwardRef<SVGGElement>(function Avatar(_, ref) {
  return (
    <g ref={ref} className="avatar">
      <ellipse className="av-ring" cx={0} cy={0} rx={13} ry={6.5} />
      <ellipse className="av-shadow" cx={0} cy={0} rx={9} ry={4.4} />
      <g className="av-body">
        <g transform="scale(1.3)">
          <ChibiArt id="visitor" />
        </g>
        <text className="av-tag" x={0} y={-54} textAnchor="middle">You</text>
      </g>
    </g>
  );
});
