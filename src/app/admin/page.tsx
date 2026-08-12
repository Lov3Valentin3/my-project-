"use client";
import { useState } from "react";
import { BrandMark, PageShell } from "@/components/site-chrome";
type AdminPayload = {
  elves: { id: string; name: string; christmasJob?: string }[];
  children: { id: string; firstName: string; age: number; elfId: string }[];
  parents: { id: string; name: string; email: string }[];
  letters: { id: string; fromRole: string; status: string; body: string }[];
};
export default function AdminPage() {
  const [key, setKey] = useState("northpole-admin");
  const [data, setData] = useState<AdminPayload | null>(null);
  const [error, setError] = useState("");
  async function load() {
    setError("");
    const response = await fetch(`/api/admin?key=${encodeURIComponent(key)}`);
    const json = (await response.json()) as AdminPayload & { error?: string };
    if (!response.ok) {
      setError(json.error || "Could not open the workshop ledger.");
      return;
    }
    setData(json);
  }
  return (
    <PageShell wide>
      <BrandMark />
      <h1 className="font-display mt-6 text-4xl text-[#f4d03f]">Workshop admin</h1>
      <p className="mt-2 text-[#fff6e5]/75">Content desk for elves, families, and recent mail. Default key: northpole-admin</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <input value={key} onChange={(e) => setKey(e.target.value)} className="max-w-sm" />
        <button className="magical-btn" type="button" onClick={load}>
          Open ledger
        </button>
      </div>
      {error && <p className="mt-3">{error}</p>}
      {data && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <section className="card-glass rounded-[24px] p-5">
            <h2 className="font-display text-2xl">Elves ({data.elves.length})</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {data.elves.map((elf) => (
                <li key={elf.id}>
                  {elf.name} — {elf.christmasJob}
                </li>
              ))}
            </ul>
          </section>
          <section className="card-glass rounded-[24px] p-5">
            <h2 className="font-display text-2xl">Families</h2>
            <p className="mt-2 text-sm">{data.parents.length} parents · {data.children.length} children</p>
            <ul className="mt-3 space-y-1 text-sm">
              {data.children.map((kid) => (
                <li key={kid.id}>
                  {kid.firstName}, {kid.age} · {kid.elfId}
                </li>
              ))}
            </ul>
          </section>
          <section className="card-glass rounded-[24px] p-5 lg:col-span-2">
            <h2 className="font-display text-2xl">Recent letters</h2>
            <div className="mt-3 grid gap-3">
              {data.letters.map((letter) => (
                <article key={letter.id} className="rounded-2xl bg-black/20 p-3 text-sm">
                  <p className="text-[#f4d03f]">
                    {letter.fromRole} · {letter.status}
                  </p>
                  <p className="line-clamp-3">{letter.body}</p>
                </article>
              ))}
            </ul>
          </section>
        </div>
      )}
    </PageShell>
  );
}