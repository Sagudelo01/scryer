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

interface Beam {
  x: number;
  rot: number;
  w: number;
  fill: string;
  op: number;
  dur: string;
  delay: string;
}

const BEAMS: Beam[] = [
  { x: 110, rot: -13, w: 170, fill: "url(#au-beam-c)", op: 0.66, dur: "30s", delay: "0s" },
  { x: 350, rot: -6, w: 130, fill: "url(#au-beam-t)", op: 0.5, dur: "26s", delay: "-7s" },
  { x: 650, rot: 3, w: 200, fill: "url(#au-beam-c)", op: 0.26, dur: "34s", delay: "-13s" },
  { x: 960, rot: 11, w: 150, fill: "url(#au-beam-t)", op: 0.52, dur: "28s", delay: "-4s" },
  { x: 1220, rot: 17, w: 190, fill: "url(#au-beam-c)", op: 0.62, dur: "32s", delay: "-18s" },
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
            <stop offset="0" stopColor="#05121a" />
            <stop offset="0.45" stopColor="#06222e" />
            <stop offset="0.8" stopColor="#083947" />
            <stop offset="1" stopColor="#0b5261" />
          </linearGradient>
          <linearGradient id="au-beam-c" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(10,200,185,0)" />
            <stop offset="0.18" stopColor="rgba(10,200,185,0.55)" />
            <stop offset="0.7" stopColor="rgba(10,200,185,0.08)" />
            <stop offset="1" stopColor="rgba(10,200,185,0)" />
          </linearGradient>
          <linearGradient id="au-beam-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(74,140,255,0)" />
            <stop offset="0.18" stopColor="rgba(74,140,255,0.4)" />
            <stop offset="0.7" stopColor="rgba(74,140,255,0.06)" />
            <stop offset="1" stopColor="rgba(74,140,255,0)" />
          </linearGradient>
          <radialGradient id="au-flash" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(220,255,255,0.95)" />
            <stop offset="0.28" stopColor="rgba(120,235,230,0.6)" />
            <stop offset="1" stopColor="rgba(10,200,185,0)" />
          </radialGradient>
          <radialGradient id="au-center-dark" cx="50%" cy="26%" r="58%">
            <stop offset="0" stopColor="rgba(4,8,15,0.6)" />
            <stop offset="1" stopColor="rgba(4,8,15,0)" />
          </radialGradient>
          <radialGradient id="au-ll-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(10,200,185,0.32)" />
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
          <filter id="au-blur-beam" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="au-blur-band" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="au-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <filter id="au-blur-flash" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <rect width={W} height={H} fill="url(#au-base)" />

        {/* Upper beams */}
        <g style={{ mixBlendMode: "screen" }}>
          {BEAMS.map((b, i) => (
            <g key={i} className="au-anim au-beam" style={anim(b.dur, b.delay)}>
              <rect
                x={b.x - b.w / 2}
                y={-120}
                width={b.w}
                height={760}
                rx={b.w / 2}
                fill={b.fill}
                opacity={b.op}
                filter="url(#au-blur-beam)"
                transform={`rotate(${b.rot} ${b.x} 120)`}
              />
            </g>
          ))}
          {/* Thin bright streaks, kept in the upper sky above the title */}
          <g className="au-anim au-beam" style={anim("24s", "-9s")}>
            <rect
              x={519}
              y={-120}
              width={2.4}
              height={380}
              fill="rgba(180,248,242,0.75)"
              filter="url(#au-blur-soft)"
              transform="rotate(-5 520 120)"
            />
          </g>
          <g className="au-anim au-beam" style={anim("31s", "-16s")}>
            <rect
              x={360}
              y={-120}
              width={1.6}
              height={330}
              fill="rgba(150,235,230,0.45)"
              filter="url(#au-blur-soft)"
              transform="rotate(-9 360 120)"
            />
          </g>
        </g>

        {/* Keep the upper centre dark for legible text */}
        <rect width={W} height={H} fill="url(#au-center-dark)" />

        {/* Bottom bands */}
        <g className="au-anim au-band" style={{ ...anim("30s", "0s"), mixBlendMode: "screen" }}>
          {BANDS.map((d, i) => (
            <path
              key={`bw${i}`}
              d={d}
              fill="none"
              stroke="rgba(10,200,185,0.22)"
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
              stroke="rgba(180,250,245,0.5)"
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
          style={{ ...anim("34s", "-6s"), mixBlendMode: "screen" }}
        >
          <g filter="url(#au-blur-soft)">
            {fan.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={i % 4 === 0 ? "rgba(150,240,235,0.7)" : "rgba(14,210,195,0.6)"}
                strokeWidth={i % 4 === 0 ? 1 : 0.6}
              />
            ))}
          </g>
        </g>

        {/* Bottom-right arc */}
        <g
          className="au-anim au-arc"
          mask="url(#au-arc-mask)"
          style={{ ...anim("38s", "-15s"), mixBlendMode: "screen" }}
        >
          <g filter="url(#au-blur-soft)">
            {arc.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="rgba(90,210,255,0.55)"
                strokeWidth={i % 3 === 0 ? 1.1 : 0.7}
              />
            ))}
          </g>
        </g>

        {/* Crossing flash */}
        <g className="au-anim au-flash" style={{ ...anim("16s", "0s"), mixBlendMode: "screen" }}>
          <ellipse
            cx={760}
            cy={752}
            rx={250}
            ry={92}
            fill="url(#au-flash)"
            filter="url(#au-blur-flash)"
          />
        </g>
      </svg>
    </div>
  );
}
