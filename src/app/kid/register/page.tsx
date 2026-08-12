import { BrandMark, PageShell } from "@/components/site-chrome";
import { KidRegisterForm } from "@/components/auth-forms";
export const metadata = { title: "Kid Register" };
export default function KidRegisterPage() {
  return (
    <PageShell>
      <BrandMark />
      <section className="mx-auto mt-6 max-w-3xl">
        <div className="letter-paper rounded-[28px] p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">Become a pen pal</p>
          <h1 className="font-display mt-2 text-4xl text-[#6d1020]">Tell us about you, then pick an elf.</h1>
          <p className="mt-2 text-sm text-[#3b2416]/75">
            Ages 3–12. Your elf will remember your favorite color, Christmas activity, and every letter.
          </p>
          <div className="mt-6">
            <KidRegisterForm />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
