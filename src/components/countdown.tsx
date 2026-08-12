"use client";
import { useEffect, useMemo, useState } from "react";
function nextChristmas(from: Date) {
  const year =
    from.getMonth() === 11 && from.getDate() > 25 ? from.getFullYear() + 1 : from.getFullYear();
  return new Date(year, 11, 25, 0, 0, 0);
}
export function Countdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const parts = useMemo(() => {
    const target = nextChristmas(now);
    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    const seconds = Math.floor((diff % 60_000) / 1000);
    return [
      { label: "Days", value: days },
      { label: "Hours", value: hours },
      { label: "Minutes", value: minutes },
      { label: "Seconds", value: seconds },
    ];
  }, [now]);
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {parts.map((part) => (
        <div key={part.label} className="countdown-cell">
          <div className="font-display text-3xl text-[#f4d03f]">{part.value}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#fff6e5]/80">
            {part.label}
          </div>
        </div>
      ))}
    </div>
  );
}
