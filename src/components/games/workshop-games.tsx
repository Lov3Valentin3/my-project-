"use client";
import { useEffect, useMemo, useState } from "react";
async function saveScore(gameSlug: string, score: number, stars: number) {
  await fetch("/api/games/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameSlug, score, stars }),
  });
}
function WinBanner({ score, onAgain }: { score: number; onAgain: () => void }) {
  return (
    <div className="mt-4 rounded-2xl bg-[#1b6b4a] p-4 text-center">
      <p className="font-display text-2xl">You did it! Score {score}</p>
      <button className="magical-btn mt-3" type="button" onClick={onAgain}>
        Play again
      </button>
    </div>
  );
}
export function SpotTheDifference() {
  const diffs = [
    { id: 1, top: "18%", left: "72%", label: "missing star" },
    { id: 2, top: "62%", left: "20%", label: "extra present" },
    { id: 3, top: "40%", left: "58%", label: "different mug" },
    { id: 4, top: "78%", left: "76%", label: "moved candy cane" },
    { id: 5, top: "28%", left: "12%", label: "extra holly" },
  ];
  const [found, setFound] = useState<number[]>([]);
  useEffect(() => {
    if (found.length === diffs.length) void saveScore("spot-the-difference", 100, 3);
  }, [found.length]);
  return (
    <div>
      <p className="mb-3">Tap the five differences on the right-hand workshop.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {["left", "right"].map((side) => (
          <div key={side} className="relative overflow-hidden rounded-3xl border border-[#f4d03f]/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/workshop.jpg" alt="" className="h-72 w-full object-cover" />
            {side === "right" &&
              diffs.map((diff) => (
                <button
                  key={diff.id}
                  type="button"
                  onClick={() => setFound((prev) => (prev.includes(diff.id) ? prev : [...prev, diff.id]))}
                  className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ top: diff.top, left: diff.left }}
                  aria-label={diff.label}
                >
                  {found.includes(diff.id) && (
                    <span className="grid h-full w-full place-items-center rounded-full bg-[#f4d03f] text-lg text-[#3b2416]">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            {side === "right" && (
              <>
                <span className="absolute left-[12%] top-[28%] text-xl">🌿</span>
                <span className="absolute left-[20%] top-[62%] text-xl">🎁</span>
                <span className="absolute left-[76%] top-[78%] rotate-12 text-xl">🍬</span>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3">Found {found.length} / {diffs.length}</p>
      {found.length === diffs.length && <WinBanner score={100} onAgain={() => setFound([])} />}
    </div>
  );
}
const WORDS = ["ELF", "SNOW", "SANTA", "GIFT", "TREE", "BELL"];
export function WordSearchGame() {
  const grid = [
    ["S", "A", "N", "T", "A", "Q"],
    ["N", "E", "L", "F", "B", "W"],
    ["O", "G", "I", "F", "T", "O"],
    ["W", "P", "T", "R", "E", "E"],
    ["B", "E", "L", "L", "Z", "X"],
    ["M", "Y", "K", "J", "H", "S"],
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  function toggle(r: number, c: number) {
    const key = `${r}-${c}-${grid[r][c]}`;
    setSelected((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  }
  useEffect(() => {
    const letters = selected.map((item) => item.split("-")[2]).join("");
    for (const word of WORDS) {
      if (!found.includes(word) && (letters.includes(word) || letters.includes([...word].reverse().join("")))) {
        setFound((prev) => [...prev, word]);
      }
    }
  }, [selected, found]);
  useEffect(() => {
    if (found.length === WORDS.length) void saveScore("word-search", 120, 3);
  }, [found.length]);
  return (
    <div>
      <p className="mb-3">Find: {WORDS.map((word) => (found.includes(word) ? `✓ ${word}` : word)).join(" · ")}</p>
      <div className="inline-grid grid-cols-6 gap-2">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}-${cell}`;
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(r, c)}
                className={`h-12 w-12 rounded-xl font-display text-lg ${selected.includes(key) ? "bg-[#c41e3a]" : "bg-white/10"}`}
              >
                {cell}
              </button>
            );
          }),
        )}
      </div>
      {found.length === WORDS.length && <WinBanner score={120} onAgain={() => { setFound([]); setSelected([]); }} />}
    </div>
  );
}
export function ElfMaze() {
  const maze = [
    [0, 0, 1, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0],
  ];
  const [pos, setPos] = useState({ r: 0, c: 0 });
  const won = pos.r === 6 && pos.c === 7;
  useEffect(() => {
    if (won) void saveScore("elf-maze", 90, 3);
  }, [won]);
  function move(dr: number, dc: number) {
    const r = pos.r + dr;
    const c = pos.c + dc;
    if (r < 0 || c < 0 || r >= maze.length || c >= maze[0].length) return;
    if (maze[r][c] === 1) return;
    setPos({ r, c });
  }
  return (
    <div>
      <p className="mb-3">Guide the elf to the present. Use the arrows.</p>
      <div className="inline-grid grid-cols-8 gap-1 rounded-3xl bg-black/20 p-3">
        {maze.map((row, r) =>
          row.map((cell, c) => {
            const here = pos.r === r && pos.c === c;
            const end = r === 6 && c === 7;
            return (
              <div
                key={`${r}-${c}`}
                className={`grid h-10 w-10 place-items-center rounded-md ${cell === 1 ? "bg-[#0f3d2e]" : "bg-[#fff6e5]/20"}`}
              >
                {here ? "🧝" : end ? "🎁" : ""}
              </div>
            );
          }),
        )}
      </div>
      <div className="mt-4 grid w-40 grid-cols-3 gap-2">
        <span />
        <button className="magical-btn" type="button" onClick={() => move(-1, 0)}>↑</button>
        <span />
        <button className="magical-btn" type="button" onClick={() => move(0, -1)}>←</button>
        <button className="magical-btn" type="button" onClick={() => move(1, 0)}>↓</button>
        <button className="magical-btn" type="button" onClick={() => move(0, 1)}>→</button>
      </div>
      {won && <WinBanner score={90} onAgain={() => setPos({ r: 0, c: 0 })} />}
    </div>
  );
}
export function HiddenObjects() {
  const items = [
    { id: "bell", emoji: "🔔", top: "22%", left: "18%" },
    { id: "mug", emoji: "☕", top: "70%", left: "30%" },
    { id: "gift", emoji: "🎁", top: "55%", left: "78%" },
    { id: "star", emoji: "⭐", top: "16%", left: "68%" },
    { id: "cane", emoji: "🍬", top: "80%", left: "60%" },
    { id: "sock", emoji: "🧦", top: "40%", left: "48%" },
  ];
  const [found, setFound] = useState<string[]>([]);
  useEffect(() => {
    if (found.length === items.length) void saveScore("hidden-objects", 110, 3);
  }, [found.length]);
  return (
    <div>
      <p className="mb-3">Find: {items.map((item) => `${found.includes(item.id) ? "✓" : ""} ${item.emoji}`).join("  ")}</p>
      <div className="relative overflow-hidden rounded-[28px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/santa-office.jpg" alt="" className="h-[380px] w-full object-cover" />
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="absolute text-2xl"
            style={{ top: item.top, left: item.left }}
            onClick={() => setFound((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]))}
          >
            {found.includes(item.id) ? "✅" : item.emoji}
          </button>
        ))}
      </div>
      {found.length === items.length && <WinBanner score={110} onAgain={() => setFound([])} />}
    </div>
  );
}
export function FindTheElf() {
  const cells = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        glyph: i === 27 ? "🧝" : ["🎁", "🎄", "⛄", "🔔", "🦌"][i % 5],
      })),
    [],
  );
  const [found, setFound] = useState(false);
  useEffect(() => {
    if (found) void saveScore("find-the-elf", 80, 2);
  }, [found]);
  return (
    <div>
      <p className="mb-3">Where&apos;s the elf hiding among the village clutter?</p>
      <div className="grid grid-cols-8 gap-2">
        {cells.map((cell) => (
          <button
            key={cell.id}
            type="button"
            onClick={() => cell.glyph === "🧝" && setFound(true)}
            className="grid h-14 place-items-center rounded-xl bg-white/10 text-2xl"
          >
            {cell.glyph}
          </button>
        ))}
      </div>
      {found && <WinBanner score={80} onAgain={() => setFound(false)} />}
    </div>
  );
}
function MemoryBoard({
  slug,
  icons,
}: {
  slug: string;
  icons: string[];
}) {
  const deck = useMemo(() => {
    const pairs = [...icons, ...icons].map((icon, index) => ({ id: index, icon }));
    return pairs.sort(() => Math.random() - 0.5);
  }, [icons]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  function flip(id: number, icon: string) {
    if (open.includes(id) || matched.includes(icon) || open.length === 2) return;
    const next = [...open, id];
    setOpen(next);
    if (next.length === 2) {
      const [a, b] = next.map((item) => deck.find((card) => card.id === item)!);
      if (a.icon === b.icon) {
        setMatched((prev) => [...prev, a.icon]);
        setOpen([]);
      } else {
        window.setTimeout(() => setOpen([]), 700);
      }
    }
  }
  useEffect(() => {
    if (matched.length === icons.length) void saveScore(slug, 100, 3);
  }, [matched.length, icons.length, slug]);
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {deck.map((card) => {
          const show = open.includes(card.id) || matched.includes(card.icon);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(card.id, card.icon)}
              className="grid h-20 place-items-center rounded-2xl bg-[#9b1b30] text-3xl"
            >
              {show ? card.icon : "🎀"}
            </button>
          );
        })}
      </div>
      {matched.length === icons.length && (
        <WinBanner score={100} onAgain={() => { setMatched([]); setOpen([]); }} />
      )}
    </div>
  );
}
export function MatchPresents() {
  return <MemoryBoard slug="match-presents" icons={["🎁", "🧸", "🚂", "🪀", "🎈", "📚"]} />;
}
export function SantaMemory() {
  return <MemoryBoard slug="santa-memory" icons={["🎅", "🤶", "🦌", "⛄", "🎄", "⭐"]} />;
}
export function SnowballPuzzle() {
  const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const [tiles, setTiles] = useState(() => [...solved].sort(() => Math.random() - 0.4));
  const won = tiles.every((tile, index) => tile === solved[index]);
  useEffect(() => {
    if (won) void saveScore("snowball-puzzle", 150, 3);
  }, [won]);
  function click(index: number) {
    const zero = tiles.indexOf(0);
    const zr = Math.floor(zero / 3);
    const zc = zero % 3;
    const r = Math.floor(index / 3);
    const c = index % 3;
    if (Math.abs(zr - r) + Math.abs(zc - c) !== 1) return;
    const next = [...tiles];
    [next[zero], next[index]] = [next[index], next[zero]];
    setTiles(next);
  }
  return (
    <div>
      <p className="mb-3">Slide the snowy tiles back into a perfect square.</p>
      <div className="grid w-64 grid-cols-3 gap-2">
        {tiles.map((tile, index) => (
          <button
            key={`${tile}-${index}`}
            type="button"
            onClick={() => click(index)}
            className={`grid h-20 place-items-center rounded-2xl text-2xl ${tile === 0 ? "bg-white/5" : "bg-[#1b6b4a]"}`}
          >
            {tile === 0 ? "" : tile}
          </button>
        ))}
      </div>
      {won && <WinBanner score={150} onAgain={() => setTiles([...solved].sort(() => Math.random() - 0.4))} />}
    </div>
  );
}
export function ColoringPage() {
  const [color, setColor] = useState("#c41e3a");
  const [fills, setFills] = useState<Record<string, string>>({
    tree: "#1b6b4a",
    star: "#f4d03f",
    ornament: "#c41e3a",
    trunk: "#6d4c12",
    sky: "#12352c",
  });
  useEffect(() => {
    void saveScore("coloring", 40, 1);
  }, []);
  const palette = ["#c41e3a", "#1b6b4a", "#f4d03f", "#6ec6ff", "#fff6e5", "#7b2cbf", "#e67e22"];
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {palette.map((swatch) => (
          <button
            key={swatch}
            type="button"
            onClick={() => setColor(swatch)}
            className="h-10 w-10 rounded-full border-2"
            style={{ background: swatch, borderColor: color === swatch ? "white" : "transparent" }}
          />
        ))}
      </div>
      <svg viewBox="0 0 300 300" className="w-full max-w-md rounded-[28px] bg-[#07151c]">
        <rect width="300" height="300" fill={fills.sky} onClick={() => setFills({ ...fills, sky: color })} />
        <polygon points="150,30 250,220 50,220" fill={fills.tree} onClick={() => setFills({ ...fills, tree: color })} />
        <rect x="130" y="220" width="40" height="40" fill={fills.trunk} onClick={() => setFills({ ...fills, trunk: color })} />
        <polygon points="150,20 160,45 140,45" fill={fills.star} onClick={() => setFills({ ...fills, star: color })} />
        <circle cx="120" cy="140" r="12" fill={fills.ornament} onClick={() => setFills({ ...fills, ornament: color })} />
        <circle cx="180" cy="160" r="12" fill={fills.ornament} onClick={() => setFills({ ...fills, ornament: color })} />
        <circle cx="150" cy="190" r="12" fill={fills.ornament} onClick={() => setFills({ ...fills, ornament: color })} />
      </svg>
      <p className="mt-3 text-sm">Tap the tree, sky, star, or ornaments to paint them.</p>
    </div>
  );
}
const TRIVIA = [
  { q: "Who checks the Nice List with quiet care?", a: "Frost", options: ["Frost", "Dash", "Ruby"] },
  { q: "Which elf bakes cookies and feeds reindeer?", a: "Holly", options: ["Holly", "Spark", "Glimmer"] },
  { q: "What do we call letters from the North Pole?", a: "Elf Mail", options: ["Elf Mail", "Snow Fax", "Sleigh Text"] },
  { q: "How many reindeer usually pull the sleigh?", a: "Nine with Rudolph", options: ["Two", "Nine with Rudolph", "Twenty"] },
  { q: "What makes Christmas magic grow?", a: "Kindness", options: ["Hurrying", "Kindness", "Louder bells"] },
];
export function ElfTrivia() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  function answer(choice: string) {
    const correct = choice === TRIVIA[index].a;
    const nextScore = score + (correct ? 20 : 0);
    if (index === TRIVIA.length - 1) {
      setScore(nextScore);
      setDone(true);
      void saveScore("elf-trivia", nextScore, nextScore >= 80 ? 3 : 2);
    } else {
      setScore(nextScore);
      setIndex(index + 1);
    }
  }
  if (done) return <WinBanner score={score} onAgain={() => { setIndex(0); setScore(0); setDone(false); }} />;
  const item = TRIVIA[index];
  return (
    <div>
      <p className="text-sm text-[#f4d03f]">Question {index + 1} / {TRIVIA.length}</p>
      <h2 className="font-display mt-2 text-3xl">{item.q}</h2>
      <div className="mt-4 grid gap-3">
        {item.options.map((option) => (
          <button key={option} className="magical-btn ghost" type="button" onClick={() => answer(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
export function GameSwitch({ slug }: { slug: string }) {
  switch (slug) {
    case "spot-the-difference":
      return <SpotTheDifference />;
    case "word-search":
      return <WordSearchGame />;
    case "elf-maze":
      return <ElfMaze />;
    case "hidden-objects":
      return <HiddenObjects />;
    case "find-the-elf":
      return <FindTheElf />;
    case "match-presents":
      return <MatchPresents />;
    case "santa-memory":
      return <SantaMemory />;
    case "snowball-puzzle":
      return <SnowballPuzzle />;
    case "coloring":
      return <ColoringPage />;
    case "elf-trivia":
      return <ElfTrivia />;
    default:
      return <p>That game is still being wrapped.</p>;
  }
}