/**
 * The HQ's own chibi characters, drawn in SVG: a big head, a small body and a
 * soft face. Each AI employee has their own hair, outfit and accessory, so
 * they can be told apart at a glance. Colours are fixed per character, the
 * way a person's hair and clothes don't change with the page theme.
 *
 * The art is drawn with the feet at (0, 0) and is about 38 units tall.
 */
export type ChibiId = "sophia" | "olivia" | "ava" | "chloe" | "mia" | "ethan" | "visitor-girl" | "visitor-boy";

interface Look {
  skin: string;
  hair: string;
  outfit: string;
  /** Collar, trim or shirt colour. */
  trim: string;
  style: "long-wavy" | "bob" | "bun" | "ponytail" | "long-straight" | "short" | "swept" | "pigtails";
  /** Trouser colour. Left out for characters in a skirt or dress, whose legs show. */
  legs?: string;
}

const GOLD = "#c9a86a";
const INK = "#2b2233";

const LOOKS: Record<ChibiId, Look> = {
  sophia: { skin: "#f7d9c6", hair: "#6b4534", outfit: "#8a6bb8", trim: "#f6f1fb", style: "long-wavy" },
  olivia: { skin: "#eec7a6", hair: "#2a2230", outfit: "#3b3550", trim: "#d9cbee", style: "bob" },
  ava: { skin: "#f5d2bb", hair: "#9a5440", outfit: "#c7b3e6", trim: "#ffffff", style: "bun" },
  chloe: { skin: "#e9c19f", hair: "#b07f45", outfit: "#2f3a55", trim: "#e6d2a8", style: "ponytail" },
  mia: { skin: "#f8dcc9", hair: "#3d2a4d", outfit: "#f4ecdf", trim: "#6b4f93", style: "long-straight" },
  ethan: { skin: "#e6b995", hair: "#3a2a22", outfit: "#39405a", trim: "#cdbdea", style: "swept", legs: "#252a3a" },
  "visitor-girl": { skin: "#f6d3bd", hair: "#7a4a36", outfit: "#755a9d", trim: GOLD, style: "pigtails" },
  "visitor-boy": { skin: "#f3cfb4", hair: "#4a3f55", outfit: "#755a9d", trim: GOLD, style: "short", legs: "#2f2a3d" },
};

/** Top of the head, shared by every hairstyle. */
const CAP = "M-9.9 -25 C-11.6 -38.6 11.6 -38.6 9.9 -25 C8 -29.6 4 -31.2 0 -31.2 C-4 -31.2 -8 -29.6 -9.9 -25 Z";
const BLUNT_FRINGE = "M-9.9 -25 C-9.6 -35.4 9.6 -35.4 9.9 -25 C6 -28.6 -6 -28.6 -9.9 -25 Z";

function BackHair({ look }: { look: Look }) {
  const f = look.hair;
  switch (look.style) {
    case "long-wavy":
      return <path fill={f} d="M-10.4 -27 C-13.6 -20 -12.6 -13 -9.6 -10 C-8 -12.6 -8.6 -16 -8.8 -20 L8.8 -20 C8.6 -16 8 -12.6 9.6 -10 C12.6 -13 13.6 -20 10.4 -27 Z" />;
    case "bob":
      return <path fill={f} d="M-10.7 -27 C-12 -21 -11 -17.4 -8.6 -16.4 L8.6 -16.4 C11 -17.4 12 -21 10.7 -27 Z" />;
    case "bun":
      return <circle fill={f} cx={0} cy={-36.6} r={3.9} />;
    case "ponytail":
      return <path fill={f} d="M8.4 -30.5 C15.6 -30.5 16 -20 12.8 -14 C12 -18 11.2 -22 9.4 -24.6 Z" />;
    case "long-straight":
      return <path fill={f} d="M-10.4 -27 C-12.2 -18 -11.6 -9 -10 -6.4 L-7.8 -6.4 L-8.2 -19 L8.2 -19 L7.8 -6.4 L10 -6.4 C11.6 -9 12.2 -18 10.4 -27 Z" />;
    case "pigtails":
      return (
        <g fill={f}>
          <ellipse cx={-11.8} cy={-21.4} rx={3.1} ry={5.6} transform="rotate(14 -11.8 -21.4)" />
          <ellipse cx={11.8} cy={-21.4} rx={3.1} ry={5.6} transform="rotate(-14 11.8 -21.4)" />
        </g>
      );
    default:
      return null;
  }
}

function FrontHair({ look }: { look: Look }) {
  const f = look.hair;
  return (
    <g fill={f} stroke="none">
      <path d={CAP} />
      {look.style === "long-wavy" && <path d="M-9.9 -25 C-9.2 -31.6 -2 -33.4 4.6 -30.4 C0 -29 -5 -27.2 -9.9 -25 Z" />}
      {(look.style === "bob" || look.style === "long-straight") && <path d={BLUNT_FRINGE} />}
      {look.style === "bun" && (
        <>
          <path d="M-9.9 -25 C-9.6 -31.8 -3 -32.8 -0.3 -31.2 C-3 -29.6 -7 -27.6 -9.9 -25 Z" />
          <path d="M9.9 -25 C9.6 -31.8 3 -32.8 0.3 -31.2 C3 -29.6 7 -27.6 9.9 -25 Z" />
          <path d="M-9.9 -25.4 C-11.2 -22 -10.8 -19.4 -9.5 -18.2 C-9 -21 -9.2 -23.2 -9.9 -25.4 Z" />
          <path d="M9.9 -25.4 C11.2 -22 10.8 -19.4 9.5 -18.2 C9 -21 9.2 -23.2 9.9 -25.4 Z" />
        </>
      )}
      {look.style === "pigtails" && (
        <>
          <path d="M-9.9 -25 C-9.6 -32.2 -3 -33.2 -0.3 -31.4 C-3 -29.8 -7 -27.6 -9.9 -25 Z" />
          <path d="M9.9 -25 C9.6 -32.2 3 -33.2 0.3 -31.4 C3 -29.8 7 -27.6 9.9 -25 Z" />
        </>
      )}
      {look.style === "swept" && (
        <>
          <path d="M-9.9 -25 C-9.6 -35 3 -37 9.9 -27.4 C6 -30.6 0 -30.2 -4 -27.8 C-6 -26.8 -8 -25.8 -9.9 -25 Z" />
          <path d="M-3 -35.6 Q1 -40.4 6.4 -36 Q2 -36.8 -3 -35.6 Z" />
        </>
      )}
      {look.style === "ponytail" && <path d="M-9.9 -25 C-9.2 -32.6 3 -33.6 9.9 -26 C5 -29.8 -3 -29.2 -9.9 -25 Z" />}
      {look.style === "short" && <path d="M-9.9 -25 C-9.4 -35 6 -36 9.9 -26.4 C5 -29.2 -4 -28.4 -9.9 -25 Z" />}
    </g>
  );
}

function Accessory({ id }: { id: ChibiId }) {
  switch (id) {
    case "sophia": // receptionist headset
      return (
        <g>
          <path d="M-9.9 -26 C-10.6 -39.6 10.6 -39.6 9.9 -26" fill="none" stroke={GOLD} strokeWidth={1.1} strokeLinecap="round" />
          <rect x={-11.6} y={-27.6} width={2.4} height={4.6} rx={1.2} fill={INK} />
          <path d="M-10.4 -23.2 Q-9.6 -19.2 -5.4 -19.4" fill="none" stroke={INK} strokeWidth={0.7} strokeLinecap="round" />
          <circle cx={-5.2} cy={-19.4} r={0.9} fill={INK} />
        </g>
      );
    case "olivia": // gold earrings
      return (<><circle cx={-9.4} cy={-21.6} r={0.9} fill={GOLD} /><circle cx={9.4} cy={-21.6} r={0.9} fill={GOLD} /></>);
    case "ava": // ribbon on the bun
      return <path d="M-3.4 -33.6 L0 -32.4 L3.4 -33.6 L3 -31 L0 -32 L-3 -31 Z" fill={GOLD} />;
    case "chloe": // scrunchie and round glasses
      return (
        <g>
          <circle cx={9.5} cy={-29} r={1.4} fill={GOLD} />
          <g fill="none" stroke={INK} strokeWidth={0.65}>
            <circle cx={-3.7} cy={-24} r={2.9} />
            <circle cx={3.7} cy={-24} r={2.9} />
            <path d="M-0.8 -24 H0.8" />
          </g>
        </g>
      );
    case "mia": // hair clip
      return <rect x={4.6} y={-30.6} width={3} height={1.2} rx={0.6} fill={GOLD} transform="rotate(18 6 -30)" />;
    case "ethan": // headphones resting around the neck
      return (
        <g>
          <path d="M-5 -17 Q0 -12.6 5 -17" fill="none" stroke={GOLD} strokeWidth={1.3} strokeLinecap="round" />
          <rect x={-6.3} y={-18.6} width={2.4} height={3.4} rx={1.1} fill={INK} />
          <rect x={3.9} y={-18.6} width={2.4} height={3.4} rx={1.1} fill={INK} />
        </g>
      );
    case "visitor-girl": // gold hair ties, and the visitor's pin
      return (
        <g fill={GOLD}>
          <circle cx={-9.9} cy={-27.2} r={1.3} />
          <circle cx={9.9} cy={-27.2} r={1.3} />
          <circle cx={-2.6} cy={-13} r={1} />
        </g>
      );
    default: // the visitor wears a small gold pin
      return <circle cx={-2.6} cy={-13} r={1} fill={GOLD} />;
  }
}

/** One character, full body. Wrap it in a <g> to position and scale it. */
export function ChibiArt({ id }: { id: ChibiId }) {
  const look = LOOKS[id];
  return (
    <g className="chibi">
      <BackHair look={look} />
      {/* legs and shoes */}
      <rect x={-3.7} y={-5.4} width={2.9} height={4.6} rx={1.2} fill={look.legs ?? look.skin} />
      <rect x={0.8} y={-5.4} width={2.9} height={4.6} rx={1.2} fill={look.legs ?? look.skin} />
      <ellipse cx={-2.4} cy={-0.7} rx={2.5} ry={1.3} fill={INK} />
      <ellipse cx={2.4} cy={-0.7} rx={2.5} ry={1.3} fill={INK} />
      {/* arms, behind the body */}
      <ellipse cx={-6.1} cy={-11.6} rx={1.8} ry={3.8} fill={look.outfit} transform="rotate(12 -6.1 -11.6)" />
      <ellipse cx={6.1} cy={-11.6} rx={1.8} ry={3.8} fill={look.outfit} transform="rotate(-12 6.1 -11.6)" />
      <circle cx={-6.9} cy={-7.7} r={1.45} fill={look.skin} />
      <circle cx={6.9} cy={-7.7} r={1.45} fill={look.skin} />
      {/* body */}
      <path d="M-4.7 -16.2 Q0 -17.4 4.7 -16.2 L6.3 -5.3 Q0 -3.8 -6.3 -5.3 Z" fill={look.outfit} />
      <path d="M-2.5 -16.6 L0 -12.6 L2.5 -16.6 Z" fill={look.trim} />
      {id === "mia" && <path d="M-5.6 -9.8 Q0 -8.6 5.6 -9.8 L6.3 -5.3 Q0 -3.8 -6.3 -5.3 Z" fill={look.trim} />}
      {(id === "visitor-girl" || id === "visitor-boy") && <rect x={-5.3} y={-10.6} width={10.6} height={1.6} fill={look.trim} />}
      {/* head */}
      <rect x={-1.7} y={-17.8} width={3.4} height={2.6} fill={look.skin} />
      <circle cx={-9.3} cy={-24.4} r={1.6} fill={look.skin} />
      <circle cx={9.3} cy={-24.4} r={1.6} fill={look.skin} />
      <ellipse cx={0} cy={-25} rx={9.7} ry={8.9} fill={look.skin} />
      <FrontHair look={look} />
      {/* face */}
      <ellipse cx={-6.1} cy={-21.3} rx={1.9} ry={1.1} fill="#f29bb0" opacity={0.55} />
      <ellipse cx={6.1} cy={-21.3} rx={1.9} ry={1.1} fill="#f29bb0" opacity={0.55} />
      <g className="chibi-eyes">
        <ellipse cx={-3.7} cy={-24} rx={1.35} ry={2} fill={INK} />
        <ellipse cx={3.7} cy={-24} rx={1.35} ry={2} fill={INK} />
        <circle cx={-3.2} cy={-24.8} r={0.55} fill="#ffffff" />
        <circle cx={4.2} cy={-24.8} r={0.55} fill="#ffffff" />
      </g>
      <path d="M-1.5 -20.5 Q0 -19.1 1.5 -20.5" fill="none" stroke="#9a4b55" strokeWidth={0.75} strokeLinecap="round" />
      <Accessory id={id} />
    </g>
  );
}

/** Head-and-shoulders portrait, for panels and lists. */
export function ChibiPortrait({ id, size = 40 }: { id: string; size?: number }) {
  const known = (id in LOOKS ? id : "visitor-girl") as ChibiId;
  return (
    <svg className="chibi-portrait" viewBox="-14 -42 28 28" width={size} height={size} aria-hidden="true">
      <ChibiArt id={known} />
    </svg>
  );
}
