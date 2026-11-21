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
    left: "13%",
    width: "3px",
    c: CYAN,
    x0: "-80px",
    x1: "170px",
    r0: "-14deg",
    r1: "-6deg",
    o0: 0.24,
    o1: 0.5,
    dur: "21s",
    delay: "0s",
  },
  {
    left: "26%",
    width: "5px",
    c: TEAL,
    x0: "70px",
    x1: "-90px",
    r0: "-9deg",
    r1: "-3deg",
    o0: 0.18,
    o1: 0.4,
    dur: "24s",
    delay: "-6s",
  },
  {
    left: "41%",
    width: "2px",
    c: CYAN,
    x0: "90px",
    x1: "-110px",
    r0: "5deg",
    r1: "11deg",
    o0: 0.14,
    o1: 0.32,
    dur: "19s",
    delay: "-7s",
  },
  {
    left: "55%",
    width: "4px",
    c: CYAN,
    x0: "-70px",
    x1: "100px",
    r0: "9deg",
    r1: "16deg",
    o0: 0.16,
    o1: 0.36,
    dur: "23s",
    delay: "-11s",
  },
  {
    left: "70%",
    width: "6px",
    c: TEAL,
    x0: "120px",
    x1: "-110px",
    r0: "-4deg",
    r1: "5deg",
    o0: 0.2,
    o1: 0.46,
    dur: "25s",
    delay: "-13s",
  },
  {
    left: "84%",
    width: "3px",
    c: CYAN,
    x0: "-60px",
    x1: "130px",
    r0: "-11deg",
    r1: "-2deg",
    o0: 0.2,
    o1: 0.44,
    dur: "27s",
    delay: "-4s",
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
