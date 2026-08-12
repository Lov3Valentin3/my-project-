import Link from "next/link";
import { BrandMark, PageShell } from "@/components/site-chrome";
import { KidLoginForm } from "@/components/auth-forms";
export const metadata = { title: "Kid Login" };
export default function KidLoginPage() {
  return (
    <PageShell>
      <BrandMark />
      <section className="mx-auto mt-8 grid max-w-5xl items-center gap-8 lg:grid-cols-2">
        <div className="letter-paper rounded-[28px] p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">Kid login</p>
          <h1 className="font-display mt-2 text-4xl text-[#6d1020]">Your elf is waiting.</h1>
          <p className="mt-2 text-sm text-[#3b2416]/75">Type your first name and secret word to open your mailbox.</p>
          <div className="mt-6">
            <KidLoginForm />
          </div>
          <p className="mt-4 text-center text-sm">
            New friend? <Link href="/kid/register">Kid register</Link> · Demo Emma / jinglebells
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/workshop.jpg" alt="Workshop" className="h-80 w-full rounded-[28px] object-cover" />
      </section>
    </PageShell>
  );
}
