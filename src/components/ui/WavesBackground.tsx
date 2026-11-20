/** Builds a seamless sine-wave band path, two tiles wide (0..2880), filled to
 *  the bottom. The wavelength divides 1440 so a -1440px scroll loops cleanly. */
function wave(cy: number, amp: number, wavelength: number): string {
  let d = `M 0 ${cy}`;
  for (let x = 0; x <= 2880; x += 24) {
    const y = cy + amp * Math.sin((2 * Math.PI * x) / wavelength);
    d += ` L ${x} ${Math.round(y * 10) / 10}`;
  }
  return `${d} L 2880 700 L 0 700 Z`;
}

const LAYERS = [
  { d: wave(180, 30, 720), fill: "#1e5fd0", opacity: 0.1, scroll: "44s", bob: "11s", delay: "0s" },
  { d: wave(300, 26, 480), fill: "#0596aa", opacity: 0.13, scroll: "33s", bob: "9s", delay: "-3s" },
  { d: wave(420, 32, 360), fill: "#0ac8b9", opacity: 0.13, scroll: "25s", bob: "7s", delay: "-5s" },
];

export function WavesBackground() {
  return (
    <div className="waves-bg" aria-hidden="true">
      <svg viewBox="0 0 1440 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="wave-surface-light" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(10,200,185,0.55)" />
            <stop offset="1" stopColor="rgba(10,200,185,0)" />
          </radialGradient>
        </defs>

        <g className="wave-light" style={{ animationDuration: "28s" }}>
          <ellipse cx="420" cy="120" rx="460" ry="190" fill="url(#wave-surface-light)" />
        </g>
        <g className="wave-light" style={{ animationDuration: "36s", animationDelay: "-9s" }}>
          <ellipse cx="1040" cy="180" rx="520" ry="220" fill="url(#wave-surface-light)" />
        </g>

        {LAYERS.map((layer, i) => (
          <g
            key={i}
            className="wave-bob"
            style={{ animationDuration: layer.bob, animationDelay: layer.delay }}
          >
            <g className="wave-scroll" style={{ animationDuration: layer.scroll }}>
              <path d={layer.d} fill={layer.fill} fillOpacity={layer.opacity} />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
