import type { CSSProperties } from "react";

const CYAN = "10,200,185";
const TEAL = "5,150,170";
const BLUE = "74,140,255";

interface Bubble {
  left: string;
  top: string;
  size: number;
  c: string;
  dx: string;
  dy: string;
  s: number;
  dur: string;
  delay: string;
}

const BUBBLES: Bubble[] = [
  {
    left: "4%",
    top: "56%",
    size: 360,
    c: CYAN,
    dx: "40px",
    dy: "-30px",
    s: 1.08,
    dur: "27s",
    delay: "0s",
  },
  {
    left: "68%",
    top: "58%",
    size: 430,
    c: BLUE,
    dx: "-52px",
    dy: "-22px",
    s: 1.1,
    dur: "33s",
    delay: "-6s",
  },
  {
    left: "40%",
    top: "14%",
    size: 210,
    c: CYAN,
    dx: "30px",
    dy: "44px",
    s: 1.12,
    dur: "24s",
    delay: "-3s",
  },
  {
    left: "84%",
    top: "8%",
    size: 170,
    c: TEAL,
    dx: "-28px",
    dy: "48px",
    s: 1.09,
    dur: "29s",
    delay: "-11s",
  },
  {
    left: "18%",
    top: "76%",
    size: 260,
    c: TEAL,
    dx: "48px",
    dy: "-40px",
    s: 1.07,
    dur: "31s",
    delay: "-15s",
  },
  {
    left: "54%",
    top: "72%",
    size: 150,
    c: CYAN,
    dx: "-22px",
    dy: "-50px",
    s: 1.14,
    dur: "22s",
    delay: "-8s",
  },
];

interface Dot {
  left: string;
  top: string;
  size: number;
  c: string;
  dx: string;
  dy: string;
  dur: string;
  delay: string;
}

const BOKEH: Dot[] = [
  { left: "10%", top: "28%", size: 9, c: CYAN, dx: "14px", dy: "-20px", dur: "9s", delay: "0s" },
  { left: "22%", top: "44%", size: 5, c: CYAN, dx: "-10px", dy: "16px", dur: "7s", delay: "-2s" },
  { left: "33%", top: "62%", size: 12, c: TEAL, dx: "12px", dy: "-14px", dur: "11s", delay: "-4s" },
  { left: "44%", top: "36%", size: 6, c: CYAN, dx: "-16px", dy: "-12px", dur: "8s", delay: "-1s" },
  { left: "48%", top: "80%", size: 8, c: BLUE, dx: "10px", dy: "-18px", dur: "10s", delay: "-6s" },
  { left: "58%", top: "26%", size: 5, c: CYAN, dx: "-12px", dy: "18px", dur: "7.5s", delay: "-3s" },
  { left: "64%", top: "48%", size: 14, c: CYAN, dx: "16px", dy: "-16px", dur: "12s", delay: "-7s" },
  { left: "72%", top: "32%", size: 6, c: TEAL, dx: "-14px", dy: "14px", dur: "8.5s", delay: "-2s" },
  {
    left: "78%",
    top: "66%",
    size: 10,
    c: CYAN,
    dx: "12px",
    dy: "-20px",
    dur: "10.5s",
    delay: "-5s",
  },
  { left: "88%", top: "40%", size: 7, c: BLUE, dx: "-10px", dy: "16px", dur: "9.5s", delay: "-8s" },
  { left: "15%", top: "68%", size: 6, c: CYAN, dx: "14px", dy: "12px", dur: "8s", delay: "-4s" },
  { left: "30%", top: "20%", size: 8, c: TEAL, dx: "-12px", dy: "-16px", dur: "11s", delay: "-9s" },
  { left: "52%", top: "54%", size: 5, c: CYAN, dx: "10px", dy: "14px", dur: "7s", delay: "-1s" },
  { left: "66%", top: "76%", size: 7, c: CYAN, dx: "-14px", dy: "-12px", dur: "9s", delay: "-3s" },
  { left: "82%", top: "22%", size: 6, c: CYAN, dx: "12px", dy: "16px", dur: "8.5s", delay: "-6s" },
  { left: "92%", top: "58%", size: 9, c: TEAL, dx: "-10px", dy: "-18px", dur: "10s", delay: "-2s" },
];

export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-tint" />
      {BUBBLES.map((b, i) => (
        <span
          key={`b${i}`}
          className="bubble"
          style={
            {
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              "--c": b.c,
              "--dx": b.dx,
              "--dy": b.dy,
              "--s": b.s,
              animationDuration: b.dur,
              animationDelay: b.delay,
            } as CSSProperties
          }
        />
      ))}
      {BOKEH.map((d, i) => (
        <span
          key={`d${i}`}
          className="bokeh"
          style={
            {
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              "--c": d.c,
              "--dx": d.dx,
              "--dy": d.dy,
              animationDuration: d.dur,
              animationDelay: d.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
