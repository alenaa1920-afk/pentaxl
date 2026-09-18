/**
 * One illustration per delivery stage. Hand-authored SVG rather than stock imagery:
 * it carries the site's tokens, scales without artefacts, costs a couple of kB, and
 * says something true about the stage instead of showing people pointing at a laptop.
 *
 * All five are decorative — the stage text carries the meaning — so they are
 * aria-hidden, and every animation stops under reduced motion.
 */

const VIEW = "0 0 260 150"

const frame = "text-accent/70 w-full"

function Converge() {
  // Stage 1: scattered inputs resolving into a single written problem statement.
  const dots = [
    [18, 24],
    [56, 12],
    [22, 118],
    [70, 136],
    [232, 28],
    [212, 124],
  ]
  return (
    <svg viewBox={VIEW} className={frame} aria-hidden="true">
      <circle cx="130" cy="75" r="16" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="130" cy="75" r="4" fill="currentColor" />
      {dots.map(([x, y], i) => (
        <g
          key={`${x}-${y}`}
          className="converge"
          style={
            {
              "--dx": `${x - 130}px`,
              "--dy": `${y - 75}px`,
              animationDelay: `${i * 260}ms`,
            } as React.CSSProperties
          }
        >
          <circle cx="130" cy="75" r="3.5" fill="currentColor" />
        </g>
      ))}
    </svg>
  )
}

function Architecture() {
  // Stage 2: the problem given a technical shape — layers and the links between them.
  const cols = [30, 112, 194]
  return (
    <svg viewBox={VIEW} className={frame} aria-hidden="true">
      {cols.map((x, c) =>
        [28, 62, 96].map((y, r) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="36"
            height="24"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
            className="tick-in"
            style={{ animationDelay: `${(c * 3 + r) * 160}ms` }}
          />
        )),
      )}
      {[40, 74, 108].map((y, i) => (
        <line
          key={y}
          x1="66"
          y1={y}
          x2="112"
          y2={y}
          stroke="currentColor"
          strokeWidth="1.1"
          className="trace"
          style={{ "--len": 46, animationDelay: `${i * 200}ms` } as React.CSSProperties}
        />
      ))}
      {[40, 74, 108].map((y, i) => (
        <line
          key={`b-${y}`}
          x1="148"
          y1={y}
          x2="194"
          y2={y}
          stroke="currentColor"
          strokeWidth="1.1"
          className="trace"
          style={{ "--len": 46, animationDelay: `${400 + i * 200}ms` } as React.CSSProperties}
        />
      ))}
    </svg>
  )
}

function Scope() {
  // Stage 3: what is in, and — the useful half — what is explicitly out.
  return (
    <svg viewBox={VIEW} className={frame} aria-hidden="true">
      <rect
        x="18"
        y="16"
        width="104"
        height="118"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <rect
        x="138"
        y="16"
        width="104"
        height="118"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="4 4"
        opacity="0.6"
      />
      {[40, 66, 92, 114].map((y, i) => (
        <g key={y} className="tick-in" style={{ animationDelay: `${i * 220}ms` }}>
          <path
            d={`M32 ${y} l6 6 l10 -12`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <line
            x1="56"
            y1={y + 2}
            x2="108"
            y2={y + 2}
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.55"
          />
        </g>
      ))}
      {[40, 66, 92].map((y, i) => (
        <g
          key={`o-${y}`}
          className="tick-in"
          style={{ animationDelay: `${600 + i * 220}ms` }}
          opacity="0.5"
        >
          <path
            d={`M152 ${y - 4} l10 10 M162 ${y - 4} l-10 10`}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="176"
            y1={y + 2}
            x2="228"
            y2={y + 2}
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.55"
          />
        </g>
      ))}
    </svg>
  )
}

function Delivery() {
  // Stage 4: milestones, each ending in something usable.
  const bars = [
    { y: 26, w: 150 },
    { y: 58, w: 190 },
    { y: 90, w: 120 },
    { y: 122, w: 170 },
  ]
  return (
    <svg viewBox={VIEW} className={frame} aria-hidden="true">
      {bars.map((bar, i) => (
        <g key={bar.y}>
          <line
            x1="22"
            y1={bar.y}
            x2="238"
            y2={bar.y}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.25"
          />
          <rect
            x="22"
            y={bar.y - 4}
            width={bar.w}
            height="8"
            rx="4"
            fill="currentColor"
            className="fill-bar"
            style={{ animationDelay: `${i * 320}ms` }}
          />
          <circle
            cx={22 + bar.w}
            cy={bar.y}
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </g>
      ))}
    </svg>
  )
}

function Production() {
  // Stage 5: live traffic, watched — with a pulse travelling the trace.
  const path = "M22 112 L62 96 L96 104 L132 62 L166 76 L200 40 L238 52"
  return (
    <svg viewBox={VIEW} className={frame} aria-hidden="true">
      {[40, 70, 100].map((y) => (
        <line
          key={y}
          x1="22"
          y1={y}
          x2="238"
          y2={y}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.18"
        />
      ))}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className="trace"
        style={{ "--len": 300 } as React.CSSProperties}
      />
      <circle
        r="4"
        fill="currentColor"
        className="travel"
        style={{ "--path": `path("${path}")` } as React.CSSProperties}
      />
    </svg>
  )
}

const ART = [Converge, Architecture, Scope, Delivery, Production]

export function StageArt({ index }: { index: number }) {
  const Art = ART[index] ?? Converge
  return <Art />
}
