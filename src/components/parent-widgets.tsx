"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ELF_PROFILES } from "@/lib/elves";
import { ADDONS, PLANS } from "@/lib/content";
async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error || "Please try again.");
}
export function AddChildForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      await postJson("/api/children", {
        firstName: formData.get("firstName"),
        age: Number(formData.get("age")),
        favoriteColor: formData.get("favoriteColor"),
        favoriteActivity: formData.get("favoriteActivity"),
        secretWord: formData.get("secretWord"),
        elfId: formData.get("elfId"),
        birthday: formData.get("birthday"),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form action={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" required />
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input id="age" name="age" type="number" min={3} max={12} required defaultValue={7} />
        </div>
        <div>
          <label htmlFor="favoriteColor">Favorite color</label>
          <input id="favoriteColor" name="favoriteColor" required />
        </div>
        <div>
          <label htmlFor="favoriteActivity">Favorite activity</label>
          <input id="favoriteActivity" name="favoriteActivity" required />
        </div>
        <div>
          <label htmlFor="secretWord">Kid secret word</label>
          <input id="secretWord" name="secretWord" required minLength={4} />
        </div>
        <div>
          <label htmlFor="birthday">Birthday (MM-DD)</label>
          <input id="birthday" name="birthday" placeholder="12-20" />
        </div>
      </div>
      <div>
        <label htmlFor="elfId">Elf friend</label>
        <select id="elfId" name="elfId" defaultValue="jingle">
          {ELF_PROFILES.map((elf) => (
            <option key={elf.id} value={elf.id}>
              {elf.name} — {elf.christmasJob}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-[#ffd7d7]">{error}</p>}
      <button className="magical-btn" disabled={busy} type="submit">
        {busy ? "Adding..." : "Add child profile"}
      </button>
    </form>
  );
}
export function ChildControls({
  child,
}: {
  child: {
    id: string;
    firstName: string;
    paused: boolean;
    responseMode: string;
    elfId: string;
  };
}) {
  const router = useRouter();
  async function update(payload: Record<string, unknown>) {
    await fetch(`/api/children/${child.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    router.refresh();
  }
  return (
    <div className="grid gap-3 rounded-2xl bg-black/20 p-4">
      <p className="font-display text-xl">{child.firstName}</p>
      <label className="flex items-center gap-2 normal-case tracking-normal">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={child.paused}
          onChange={(e) => update({ paused: e.target.checked })}
        />
        Pause conversations
      </label>
      <div>
        <label htmlFor={`mode-${child.id}`}>Response mode</label>
        <select
          id={`mode-${child.id}`}
          value={child.responseMode}
          onChange={(e) => update({ responseMode: e.target.value })}
        >
          <option value="ai">AI Elf replies instantly</option>
          <option value="both">AI drafts, parent approves</option>
          <option value="parent">Only parent-written replies</option>
        </select>
      </div>
      <div>
        <label htmlFor={`elf-${child.id}`}>Switch elf</label>
        <select id={`elf-${child.id}`} value={child.elfId} onChange={(e) => update({ elfId: e.target.value })}>
          {ELF_PROFILES.map((elf) => (
            <option key={elf.id} value={elf.id}>
              {elf.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
export function LetterActions({
  letterId,
  draft,
  needsReply,
}: {
  letterId: string;
  draft?: string;
  needsReply?: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState(draft || "");
  async function act(action: string) {
    await fetch(`/api/letters/${letterId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, text }),
    });
    router.refresh();
  }
  return (
    <div className="mt-3 grid gap-2">
      {draft !== undefined && (
        <textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} className="text-sm" />
      )}
      <div className="flex flex-wrap gap-2">
        {needsReply ? (
          <button className="magical-btn" type="button" onClick={() => act("reply")}>
            Send parent reply
          </button>
        ) : (
          <>
            <button className="magical-btn green" type="button" onClick={() => act("approve")}>
              Approve
            </button>
            <button className="magical-btn" type="button" onClick={() => act("edit")}>
              Save edits & send
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export function CheckoutBoard({
  currentPlan,
  currentAddons,
}: {
  currentPlan: string;
  currentAddons: string[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  async function buy(payload: { plan?: string; addon?: string }) {
    setStatus("Wrapping your purchase in gold ribbon...");
    await postJson("/api/subscriptions", payload);
    setStatus("The workshop ledger is updated. Magic unlocked!");
    router.refresh();
  }
  return (
    <div>
      <p className="mb-4 text-sm text-[#fff6e5]/70">Current plan: {currentPlan}</p>
      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.id} className="card-glass rounded-[24px] p-5">
            <h3 className="font-display text-2xl text-[#f4d03f]">{plan.name}</h3>
            <p className="mt-1 text-3xl">${plan.price}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {plan.perks.map((perk) => (
                <li key={perk}>✦ {perk}</li>
              ))}
            </ul>
            <button className="magical-btn mt-4 w-full" type="button" onClick={() => buy({ plan: plan.id })}>
              {currentPlan === plan.id ? "Active" : "Choose plan"}
            </button>
          </article>
        ))}
      </div>
      <h3 className="font-display mt-8 text-2xl">Optional add-ons</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {ADDONS.map((addon) => (
          <div key={addon.id} className="rounded-2xl border border-white/10 p-4">
            <p className="font-semibold">{addon.name}</p>
            <p className="text-sm text-[#fff6e5]/70">{addon.blurb}</p>
            <button className="magical-btn ghost mt-3" type="button" onClick={() => buy({ addon: addon.id })}>
              {currentAddons.includes(addon.id) ? "Added" : `Add · $${addon.price}`}
            </button>
          </div>
        ))}
      </div>
      {status && <p className="mt-4 text-[#f4d03f]">{status}</p>}
    </div>
  );
}
export function ShareMagic({ childName, elfName }: { childName: string; elfName: string }) {
  const message = `My child ${childName} has a magical North Pole pen pal named ${elfName}! Letters, games, and Christmas wonder from NorthPole Pal.`;
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://northpolepal.app";
    return window.location.origin;
  }, []);
  async function share() {
    if (navigator.share) {
      await navigator.share({ title: "NorthPole Pal", text: message, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(`${message} ${shareUrl}`);
      setCopied(true);
    }
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-[28px] border border-[#f4d03f]/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/og-share.jpg" alt="" className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-black/35 p-6">
          <p className="font-display text-3xl text-[#f4d03f]">My child has a magical North Pole pen pal!</p>
          <p className="mt-3 max-w-md text-[#fff6e5]">{childName} writes to {elfName} all season long.</p>
        </div>
      </div>
      <div className="card-glass rounded-[28px] p-6">
        <p className="text-sm leading-relaxed">{message}</p>
        <button className="magical-btn mt-4" type="button" onClick={share}>
          {copied ? "Copied!" : "Share the magic"}
        </button>
      </div>
    </div>
  );
}
export function MarkReadButton() {
  const router = useRouter();
  return (
    <button
      className="magical-btn ghost"
      type="button"
      onClick={async () => {
        await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
        router.refresh();
      }}
    >
      Mark all read
    </button>
  );
}
export function BuyCertificateButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      className="magical-btn"
      type="button"
      onClick={async () => {
        await fetch("/api/certificates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ certificateId: id }),
        });
        router.refresh();
      }}
    >
      Purchase premium certificate
    </button>
  );
}