"use client";

import { useEffect, useRef } from "react";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
}

export function LogoMark({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const eyeRef = useRef<SVGGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const eye = eyeRef.current;
    const pupil = pupilRef.current;
    if (!svg || !eye || !pupil) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = svg.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = (Math.min(dist, 160) / 160) * 2.4;
        pupil.style.transform = `translate(${(dx / dist) * reach}px, ${(dy / dist) * reach}px)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let blinkTimer: ReturnType<typeof setTimeout>;
    let openTimer: ReturnType<typeof setTimeout>;
    const blink = () => {
      eye.style.transform = "scaleY(0.1)";
      openTimer = setTimeout(() => {
        eye.style.transform = "scaleY(1)";
      }, 95);
      blinkTimer = setTimeout(blink, 2800 + Math.random() * 4200);
    };
    blinkTimer = setTimeout(blink, 2000 + Math.random() * 3000);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      clearTimeout(blinkTimer);
      clearTimeout(openTimer);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="scryer-gold" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0" stopColor="#f0e6d2" />
          <stop offset="1" stopColor="#c8aa6e" />
        </linearGradient>
        <linearGradient id="scryer-iris" x1="0" y1="0" x2="0" y2="48">
          <stop offset="0" stopColor="#0ac8b9" />
          <stop offset="1" stopColor="#0596aa" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 44 24 24 46 4 24Z"
        stroke="url(#scryer-gold)"
        strokeWidth="1.6"
        fill="rgba(10,200,185,0.05)"
      />
      <path
        d="M8 24c5-7 11-10.5 16-10.5S35 17 40 24c-5 7-11 10.5-16 10.5S13 31 8 24Z"
        stroke="url(#scryer-gold)"
        strokeWidth="1.6"
        fill="rgba(5,9,18,0.6)"
      />
      <g
        ref={eyeRef}
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          transition: "transform 95ms ease",
        }}
      >
        <circle cx="24" cy="24" r="6.5" fill="url(#scryer-iris)" />
        <g ref={pupilRef} style={{ transition: "transform 140ms ease-out" }}>
          <circle cx="24" cy="24" r="2.6" fill="#04060d" />
          <circle cx="21.8" cy="21.8" r="1.1" fill="#f0e6d2" />
        </g>
      </g>
    </svg>
  );
}

export function Logo({ className, withWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8" />
      {withWordmark && (
        <span className="font-display text-gold-bright text-xl font-bold tracking-wide">
          Scryer
        </span>
      )}
    </span>
  );
}
