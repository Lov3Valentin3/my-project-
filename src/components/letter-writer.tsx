"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
const STAMPS = [
  { id: "snowflake", label: "❄ Snowflake" },
  { id: "holly", label: "🌿 Holly" },
  { id: "bell", label: "🔔 Bell" },
  { id: "star", label: "⭐ Star" },
  { id: "candy", label: "🍬 Candy" },
];
export function LetterWriter({
  elfName,
  paused,
  remaining,
}: {
  elfName: string;
  paused: boolean;
  remaining: number;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [stamp, setStamp] = useState("snowflake");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState("");
  async function send() {
    if (paused) return;
    setBusy(true);
    setStatus("A reindeer is carrying your letter north...");
    setReply("");
    try {
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, stamp }),
      });
      const data = (await response.json()) as {
        error?: string;
        reply?: { body: string; status: string } | null;
      };
      if (!response.ok) throw new Error(data.error || "The mail owl circled twice.");
      if (data.reply?.status === "awaiting_approval") {
        setStatus("Your elf drafted a reply. A grown-up will stamp it soon.");
      } else if (data.reply?.body) {
        setStatus(`${elfName} wrote back!`);
        setReply(data.reply.body);
      } else {
        setStatus("Letter sent! Your elf will write when a grown-up helps.");
      }
      setBody("");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      {paused ? (
        <p className="rounded-3xl bg-[#f4d03f]/15 p-4">
          Your elf is busy helping Santa today. Letters will open again soon!
        </p>
      ) : (
        <>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Dear ${elfName},\n\nToday I...`}
            className="font-hand min-h-[240px] text-2xl leading-relaxed"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {STAMPS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStamp(item.id)}
                className={`rounded-full px-3 py-1 text-sm ${stamp === item.id ? "bg-[#9b1b30] text-white" : "bg-black/5"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="magical-btn" type="button" disabled={busy} onClick={send}>
              {busy ? "Flying north..." : "Send by reindeer mail"}
            </button>
            <p className="text-sm text-[#3b2416]/70">
              {remaining < 20 ? `${remaining} free letters left this month` : "Unlimited letters"}
            </p>
          </div>
        </>
      )}
      {status && <p className="mt-4 font-display text-[#6d1020]">{status}</p>}
      {reply && <div className="letter-paper mt-4 rounded-3xl p-5 font-hand text-2xl leading-snug whitespace-pre-wrap">{reply}</div>}
    </div>
  );
}
