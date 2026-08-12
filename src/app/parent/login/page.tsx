import Link from "next/link";
import { BrandMark, PageShell } from "@/components/site-chrome";
import { ParentAuthForm } from "@/components/auth-forms";
export const metadata = { title: "Parent Login" };
export default function ParentLoginPage() {
  return (
    <PageShell>
      <BrandMark />
      <section className="mx-auto mt-8 grid max-w-5xl items-center gap-8 lg:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/santa-office.jpg" alt="Santa's office" className="h-80 w-full rounded-[28px] object-cover" />
        <div className="letter-paper rounded-[28px] p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">Parent portal</p>
          <h1 className="font-display mt-2 text-4xl text-[#6d1020]">Welcome back to the workshop.</h1>
          <p className="mt-2 text-sm text-[#3b2416]/75">
            View letters, choose AI or parent replies, and keep every friendship safe.
          </p>
          <div className="mt-6">
            <ParentAuthForm mode="login" />
          </div>
          <p className="mt-4 text-center text-sm">
            <Link href="/kid/login">Kid login</Link> · Demo: parent@northpole.mail / ChristmasMagic
          </p>
        </div>
      </section>
    </PageShell>
  );
}
