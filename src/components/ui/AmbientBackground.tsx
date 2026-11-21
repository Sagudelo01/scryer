import type { CSSProperties } from "react";

const CYAN = "10,200,185";
const TEAL = "5,150,170";

interface Beam {
  left: string;
  width: string;
  c: string;
  x0: string;
  x1: string;
  r0: string;
  r1: string;
  o0: number;
  o1: number;
  dur: string;
  delay: string;
}

const BEAMS: Beam[] = [
  {
    left: "12%",
    width: "300px",
    c: CYAN,
    x0: "-80px",
    x1: "170px",
    r0: "-12deg",
    r1: "-2deg",
    o0: 0.24,
    o1: 0.58,
    dur: "21s",
    delay: "0s",
  },
  {
    left: "44%",
    width: "240px",
    c: TEAL,
    x0: "90px",
    x1: "-110px",
    r0: "7deg",
    r1: "15deg",
    o0: 0.13,
    o1: 0.35,
    dur: "19s",
    delay: "-7s",
  },
  {
    left: "72%",
    width: "340px",
    c: CYAN,
    x0: "120px",
    x1: "-110px",
    r0: "-4deg",
    r1: "6deg",
    o0: 0.22,
    o1: 0.54,
    dur: "25s",
    delay: "-13s",
  },
];

export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      {BEAMS.map((b, i) => (
        <span
          key={i}
          className="aurora-beam"
          style={
            {
              left: b.left,
              width: b.width,
              "--c": b.c,
              "--x0": b.x0,
              "--x1": b.x1,
              "--r0": b.r0,
              "--r1": b.r1,
              "--o0": b.o0,
              "--o1": b.o1,
              animationDuration: b.dur,
              animationDelay: b.delay,
            } as CSSProperties
          }
        />
      ))}
      <span className="aurora-glow" style={{ animationDuration: "15s" }} />
    </div>
  );
}
