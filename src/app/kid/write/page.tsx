import { redirect } from "next/navigation";
import { getKid } from "@/lib/auth";
import { canSendLetter } from "@/lib/actions";
import { KidNav, PageShell } from "@/components/site-chrome";
import { LetterWriter } from "@/components/letter-writer";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Write a Letter" };
export default async function WritePage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const elf = getElf(kid.elfId);
  const allowance = await canSendLetter(kid);
  return (
    <PageShell>
      <KidNav name={kid.firstName} />
      <div className="letter-paper rounded-[32px] p-6 sm:p-8">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">Write a letter</p>
            <h1 className="font-display text-4xl text-[#6d1020]">Dear {elf.name},</h1>
            <p className="mt-2 text-sm text-[#3b2416]/75">
              Tell {elf.name} about your day. Mention a pet, a joke, or a wish — elves remember.
            </p>
          </div>
          <span className="stamp">North Pole</span>
        </div>
        <LetterWriter elfName={elf.name} paused={kid.paused} remaining={allowance.remaining} />
      </div>
    </PageShell>
  );
}
