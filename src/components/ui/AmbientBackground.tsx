import type { CSSProperties } from "react";

const W = 1440;
const H = 900;

/** Fan of fine threads rising from the bottom-left toward the centre. */
function fanThreads(n: number): string[] {
  const paths: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const t = i / (n - 1);
    const sx = -60;
    const sy = 540 + t * 130;
    const ex = 580 + t * 300;
    const ey = 788 - t * 96;
    const c1x = 120 + t * 150;
    const c1y = 735 + t * 26;
    const c2x = 360 + t * 200;
    const c2y = 790 - t * 40;
    paths.push(`M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`);
  }
  return paths;
}

/** Arc of fine threads sweeping up from centre-bottom to the right edge. */
function arcThreads(n: number): string[] {
  const paths: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const t = i / (n - 1);
    const sx = 560 + t * 70;
    const sy = 815 - t * 14;
    const ex = 1500;
    const ey = 440 - t * 180;
    const c1x = 1040 - t * 10;
    const c1y = 805 - t * 70;
    const c2x = 1340;
    const c2y = 600 - t * 180;
    paths.push(`M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`);
  }
  return paths;
}

const BANDS = [
  "M -80 702 C 360 742, 780 712, 1520 690",
  "M -80 726 C 380 762, 820 732, 1520 712",
  "M -80 752 C 420 784, 860 756, 1520 740",
];

interface Glow {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  op: number;
  dur: string;
  delay: string;
}

// Soft upper glows (no straight edges); drift slowly. Keep the centre faint.
const GLOWS: Glow[] = [
  { cx: 200, cy: 110, rx: 520, ry: 430, fill: "url(#au-glow-c)", op: 0.4, dur: "17s", delay: "0s" },
  {
    cx: 1270,
    cy: 150,
    rx: 560,
    ry: 450,
    fill: "url(#au-glow-t)",
    op: 0.4,
    dur: "20s",
    delay: "-9s",
  },
  {
    cx: 720,
    cy: -40,
    rx: 640,
    ry: 320,
    fill: "url(#au-glow-c)",
    op: 0.14,
    dur: "23s",
    delay: "-15s",
  },
];

const anim = (dur: string, delay: string): CSSProperties =>
  ({ animationDuration: dur, animationDelay: delay }) as CSSProperties;

export function AmbientBackground() {
  const fan = fanThreads(28);
  const arc = arcThreads(11);

  return (
    <div className="ambient-bg" aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ isolation: "isolate" }}
      >
        <defs>
          <linearGradient id="au-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#04080e" />
            <stop offset="0.5" stopColor="#05141b" />
            <stop offset="0.82" stopColor="#061f28" />
            <stop offset="1" stopColor="#082c35" />
          </linearGradient>
          <radialGradient id="au-glow-c" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(10,200,185,0.5)" />
            <stop offset="1" stopColor="rgba(10,200,185,0)" />
          </radialGradient>
          <radialGradient id="au-glow-t" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(74,140,255,0.42)" />
            <stop offset="1" stopColor="rgba(74,140,255,0)" />
          </radialGradient>
          <radialGradient id="au-flash" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(210,250,250,0.8)" />
            <stop offset="0.3" stopColor="rgba(110,225,220,0.42)" />
            <stop offset="1" stopColor="rgba(10,200,185,0)" />
          </radialGradient>
          <radialGradient id="au-center-dark" cx="50%" cy="26%" r="58%">
            <stop offset="0" stopColor="rgba(3,6,12,0.6)" />
            <stop offset="1" stopColor="rgba(3,6,12,0)" />
          </radialGradient>
          <radialGradient id="au-ll-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(10,200,185,0.2)" />
            <stop offset="1" stopColor="rgba(10,200,185,0)" />
          </radialGradient>
          <linearGradient id="au-fan-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="0.12" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.62" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="0.86" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="au-fan-mask">
            <rect width={W} height={H} fill="url(#au-fan-fade)" />
          </mask>
          <linearGradient id="au-arc-fade" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.3" />
          </linearGradient>
          <mask id="au-arc-mask">
            <rect width={W} height={H} fill="url(#au-arc-fade)" />
          </mask>
          <filter id="au-blur-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="au-blur-band" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="au-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <filter id="au-blur-flash" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#au-base)" />

        {/* Soft upper glows */}
        <g style={{ mixBlendMode: "screen" }}>
          {GLOWS.map((g, i) => (
            <g key={i} className="au-anim au-beam" style={anim(g.dur, g.delay)}>
              <ellipse
                cx={g.cx}
                cy={g.cy}
                rx={g.rx}
                ry={g.ry}
                fill={g.fill}
                opacity={g.op}
                filter="url(#au-blur-glow)"
              />
            </g>
          ))}
        </g>

        {/* Keep the upper centre dark for legible text */}
        <rect width={W} height={H} fill="url(#au-center-dark)" />

        {/* Bottom bands */}
        <g className="au-anim au-band" style={{ ...anim("17s", "0s"), mixBlendMode: "screen" }}>
          {BANDS.map((d, i) => (
            <path
              key={`bw${i}`}
              d={d}
              fill="none"
              stroke="rgba(10,200,185,0.16)"
              strokeWidth={26 - i * 4}
              strokeLinecap="round"
              filter="url(#au-blur-band)"
            />
          ))}
          {BANDS.map((d, i) => (
            <path
              key={`bf${i}`}
              d={d}
              fill="none"
              stroke="rgba(170,245,240,0.4)"
              strokeWidth={0.8}
              strokeLinecap="round"
              filter="url(#au-blur-soft)"
            />
          ))}
        </g>

        {/* Bottom-left luminous region */}
        <ellipse
          cx={190}
          cy={772}
          rx={430}
          ry={250}
          fill="url(#au-ll-glow)"
          filter="url(#au-blur-band)"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Bottom-left fan */}
        <g
          className="au-anim au-fan"
          mask="url(#au-fan-mask)"
          style={{ ...anim("20s", "-6s"), mixBlendMode: "screen" }}
        >
          <g filter="url(#au-blur-soft)">
            {fan.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={i % 4 === 0 ? "rgba(150,240,235,0.5)" : "rgba(14,210,195,0.42)"}
                strokeWidth={i % 4 === 0 ? 1 : 0.6}
              />
            ))}
          </g>
        </g>

        {/* Bottom-right arc */}
        <g
          className="au-anim au-arc"
          mask="url(#au-arc-mask)"
          style={{ ...anim("22s", "-15s"), mixBlendMode: "screen" }}
        >
          <g filter="url(#au-blur-soft)">
            {arc.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(90,210,255,0.42)"
                strokeWidth={i % 3 === 0 ? 1.1 : 0.7}
              />
            ))}
          </g>
        </g>

        {/* Crossing flash */}
        <g className="au-anim au-flash" style={{ ...anim("11s", "0s"), mixBlendMode: "screen" }}>
          <ellipse
            cx={760}
            cy={752}
            rx={210}
            ry={80}
            fill="url(#au-flash)"
            filter="url(#au-blur-flash)"
          />
        </g>
      </svg>
    </div>
  );
}
