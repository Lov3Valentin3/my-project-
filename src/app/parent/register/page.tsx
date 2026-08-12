import { BrandMark, PageShell } from "@/components/site-chrome";
import { ParentAuthForm } from "@/components/auth-forms";
export const metadata = { title: "Parent Register" };
export default function ParentRegisterPage() {
  return (
    <PageShell>
      <BrandMark />
      <section className="mx-auto mt-8 max-w-xl">
        <div className="letter-paper rounded-[28px] p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">Create a family key</p>
          <h1 className="font-display mt-2 text-4xl text-[#6d1020]">Register as a parent.</h1>
          <p className="mt-2 text-sm text-[#3b2416]/75">
            You will be able to add children, approve letters, and choose subscription magic.
          </p>
          <div className="mt-6">
            <ParentAuthForm mode="register" />
          </div>
        </div>
      </section>
    </PageShell>
  );
}