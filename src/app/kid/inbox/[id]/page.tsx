import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export default async function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const { id } = await params;
  const [letter] = await db
    .select()
    .from(letters)
    .where(and(eq(letters.id, id), eq(letters.childId, kid.id)));
  if (!letter || letter.status !== "delivered") notFound();
  const elf = getElf(kid.elfId);
  return (
    <PageShell>
      <KidNav name={kid.firstName} />
      <article className="letter-paper mx-auto max-w-3xl rounded-[32px] p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#9b1b30]">
              {letter.fromRole === "elf" ? `From ${elf.name}` : `To ${elf.name}`}
            </p>
            <h1 className="font-display text-3xl text-[#6d1020]">{letter.subject}</h1>
          </div>
          <span className="stamp">{letter.stamp}</span>
        </div>
        <div className="font-hand mt-6 whitespace-pre-wrap text-2xl leading-snug">{letter.body}</div>
        <Link href="/kid/write" className="magical-btn mt-8 inline-flex">
          Write back
        </Link>
      </article>
    </PageShell>
  );
}
