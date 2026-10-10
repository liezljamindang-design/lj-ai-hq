import { forwardRef } from "react";

/** The visitor. Its position is set by useMovement directly on the element, not through React state. */
export const Avatar = forwardRef<SVGGElement>(function Avatar(_, ref) {
  return (
    <g ref={ref} className="avatar">
      <ellipse className="av-ring" cx={0} cy={0} rx={11} ry={5.5} />
      <ellipse className="av-shadow" cx={0} cy={0} rx={7} ry={3.5} />
      <g className="av-figure" transform="scale(1.25)">
      <g className="av-body">
        <rect className="av-torso" x={-5} y={-21} width={10} height={19} rx={5} />
        <rect className="av-band" x={-5} y={-12} width={10} height={1.8} />
        <circle className="av-head" cx={0} cy={-26.5} r={5} />
        <text className="av-tag" x={0} y={-36} textAnchor="middle">You</text>
      </g>
      </g>
    </g>
  );
});
