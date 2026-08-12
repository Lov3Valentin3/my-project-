"use client";
const FLAKES = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  left: `${(i * 17) % 100}%`,
  delay: `${(i % 12) * 0.45}s`,
  duration: `${9 + (i % 8)}s`,
  size: `${10 + (i % 10)}px`,
  glyph: i % 5 === 0 ? "✦" : "❄",
}));
export function Snowfall() {
  return (
    <div className="snow-layer" aria-hidden>
      {FLAKES.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            fontSize: flake.size,
          }}
        >
          {flake.glyph}
        </span>
      ))}
    </div>
  );
}
export function Twinkles() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    top: `${8 + ((i * 13) % 70)}%`,
    left: `${4 + ((i * 19) % 92)}%`,
    delay: `${(i % 7) * 0.3}s`,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="twinkle"
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
        />
      ))}
    </div>
  );
}
