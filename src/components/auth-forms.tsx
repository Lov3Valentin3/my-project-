"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ElfAvatar } from "@/components/elf-avatar";
import { ELF_PROFILES } from "@/lib/elves";
async function postJson(url: string, payload: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error || "Something snowy went wrong.");
  return data;
}
export function ParentAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      await postJson(mode === "login" ? "/api/auth/parent/login" : "/api/auth/parent/register", {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
      router.push("/parent/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form action={onSubmit} className="grid gap-4">
      {mode === "register" && (
        <div>
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" required placeholder="Alex Rivera" />
        </div>
      )}
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required placeholder="parent@northpole.mail" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} placeholder="At least 6 letters" />
      </div>
      {error && <p className="rounded-2xl bg-[#9b1b30]/20 p-3 text-sm text-[#ffd7d7]">{error}</p>}
      <button className="magical-btn" disabled={busy} type="submit">
        {busy ? "Opening the workshop..." : mode === "login" ? "Enter the workshop" : "Create parent account"}
      </button>
      <p className="text-center text-sm text-[#3b2416]/70">
        {mode === "login" ? (
          <>
            New here? <Link href="/parent/register">Register</Link>
          </>
        ) : (
          <>
            Already have a key? <Link href="/parent/login">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
export function KidLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError("");
    try {
      await postJson("/api/auth/kid/login", {
        firstName: formData.get("firstName"),
        secretWord: formData.get("secretWord"),
      });
      router.push("/kid/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form action={onSubmit} className="grid gap-4">
      <div>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" name="firstName" required placeholder="Emma" />
      </div>
      <div>
        <label htmlFor="secretWord">Secret word</label>
        <input id="secretWord" name="secretWord" type="password" required placeholder="jinglebells" />
      </div>
      {error && <p className="rounded-2xl bg-[#9b1b30]/20 p-3 text-sm text-[#6d1020]">{error}</p>}
      <button className="magical-btn green" disabled={busy} type="submit">
        {busy ? "Checking the Nice List..." : "Open my mailbox"}
      </button>
    </form>
  );
}
export function KidRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [elfId, setElfId] = useState("holly");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({
    firstName: "",
    age: "7",
    favoriteColor: "",
    favoriteActivity: "",
    secretWord: "",
    parentEmail: "",
    birthday: "",
  });
  async function finish() {
    setBusy(true);
    setError("");
    try {
      await postJson("/api/auth/kid/register", { ...draft, age: Number(draft.age), elfId });
      router.push("/kid/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-5">
      {step === 1 && (
        <div className="grid gap-4">
          <div>
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={draft.firstName}
              onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
              placeholder="Your first name"
            />
          </div>
          <div>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              min={3}
              max={12}
              value={draft.age}
              onChange={(e) => setDraft({ ...draft, age: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="favoriteColor">Favorite color</label>
            <input
              id="favoriteColor"
              value={draft.favoriteColor}
              onChange={(e) => setDraft({ ...draft, favoriteColor: e.target.value })}
              placeholder="Ruby red, pine green..."
            />
          </div>
          <div>
            <label htmlFor="favoriteActivity">Favorite Christmas activity</label>
            <input
              id="favoriteActivity"
              value={draft.favoriteActivity}
              onChange={(e) => setDraft({ ...draft, favoriteActivity: e.target.value })}
              placeholder="Baking cookies, decorating..."
            />
          </div>
          <div>
            <label htmlFor="secretWord">Secret word</label>
            <input
              id="secretWord"
              type="password"
              value={draft.secretWord}
              onChange={(e) => setDraft({ ...draft, secretWord: e.target.value })}
              placeholder="A word only you know"
            />
          </div>
          <div>
            <label htmlFor="parentEmail">Parent email (optional)</label>
            <input
              id="parentEmail"
              type="email"
              value={draft.parentEmail}
              onChange={(e) => setDraft({ ...draft, parentEmail: e.target.value })}
              placeholder="So a grown-up can join"
            />
          </div>
          <button className="magical-btn" type="button" onClick={() => setStep(2)}>
            Choose my elf friend
          </button>
        </div>
      )}
      {step === 2 && (
        <div>
          <p className="font-display mb-3 text-2xl text-[#6d1020]">Choose your elf friend</p>
          <div className="grid max-h-[420px] gap-3 overflow-auto pr-1 sm:grid-cols-2">
            {ELF_PROFILES.map((elf) => (
              <button
                key={elf.id}
                type="button"
                onClick={() => setElfId(elf.id)}
                className={`rounded-2xl border p-3 text-left ${elfId === elf.id ? "border-[#d4af37] bg-[#fff6e5]" : "border-black/10 bg-white/50"}`}
              >
                <div className="flex items-center gap-3">
                  <ElfAvatar elf={elf} size={64} />
                  <div>
                    <p className="font-display text-lg text-[#6d1020]">{elf.name}</p>
                    <p className="text-xs text-[#3b2416]/70">{elf.christmasJob}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#3b2416]/80">{elf.bio}</p>
              </button>
            ))}
          </div>
          {error && <p className="mt-3 rounded-2xl bg-[#9b1b30]/15 p-3 text-sm">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button className="magical-btn ghost" type="button" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="magical-btn green" type="button" disabled={busy} onClick={finish}>
              {busy ? "Sending snowy mail..." : "Begin our friendship"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
