import type { CSSProperties } from "react";

interface Blob {
  color: string; // "r,g,b"
  left: string;
  top: string;
  size: number;
  dx: string;
  dy: string;
  dur: string;
  delay: string;
}

// Three large colour fields (blue, teal, cyan) — no white — drifting with
// visible amplitude on long, offset cycles.
const BLOBS: Blob[] = [
  {
    color: "30,95,208",
    left: "-12%",
    top: "-14%",
    size: 920,
    dx: "110px",
    dy: "80px",
    dur: "22s",
    delay: "0s",
  },
  {
    color: "5,150,170",
    left: "58%",
    top: "6%",
    size: 880,
    dx: "-120px",
    dy: "96px",
    dur: "26s",
    delay: "-8s",
  },
  {
    color: "10,200,185",
    left: "24%",
    top: "52%",
    size: 820,
    dx: "84px",
    dy: "-112px",
    dur: "19s",
    delay: "-13s",
  },
];

export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      {BLOBS.map((b, i) => (
        <span
          key={i}
          className="mesh-blob"
          style={
            {
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle, rgba(${b.color},0.6), rgba(${b.color},0) 70%)`,
              "--dx": b.dx,
              "--dy": b.dy,
              animationDuration: b.dur,
              animationDelay: b.delay,
            } as CSSProperties
          }
        />
      ))}
      <div className="mesh-grid" />
      <div className="mesh-sweep" />
      <div className="mesh-vignette" />
    </div>
  );
}
