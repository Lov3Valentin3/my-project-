import { BrandMark, PageShell, SiteFooter } from "@/components/site-chrome";
export const metadata = {
  title: "Safety & Privacy",
  description: "How NorthPole Pal keeps children safe with parent controls, visible letters, and family-first design.",
};
export default function SafetyPage() {
  return (
    <PageShell>
      <BrandMark />
      <article className="letter-paper mx-auto mt-8 max-w-3xl rounded-[32px] p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">Family-first workshop</p>
        <h1 className="font-display text-4xl text-[#6d1020]">Safety & privacy</h1>
        <div className="mt-5 space-y-4 leading-relaxed">
          <p>
            NorthPole Pal is designed for children ages 3–12 and the grown-ups who love them. Every letter can be read by a parent. Conversations can be paused in one tap.
          </p>
          <p>
            Parents choose how replies are written: instantly by the AI elf, drafted for approval, or written entirely by the parent while staying in the elf&apos;s voice.
          </p>
          <p>
            We never ask children for a home address, school name, or photos. Secret words are hashed. Sessions use httpOnly cookies. Premium checkout is handled through the parent portal.
          </p>
          <p>
            Elf personalities stay kind, encouraging, and age-aware. The workshop never breaks character to talk about adult topics.
          </p>
        </div>
      </article>
      <SiteFooter />
    </PageShell>
  );
}
