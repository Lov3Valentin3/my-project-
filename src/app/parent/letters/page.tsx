import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { certificates, children, letters } from "@/db/schema";
import { getParent } from "@/lib/auth";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { BuyCertificateButton, LetterActions } from "@/components/parent-widgets";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Family Letters" };
export default async function ParentLettersPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const { child: filter } = await searchParams;
  const kids = await db.select().from(children).where(eq(children.parentId, parent.id));
  const ids = kids.map((kid) => kid.id);
  const mail = ids.length
    ? await db.select().from(letters).where(inArray(letters.childId, ids)).orderBy(desc(letters.createdAt))
    : [];
  const certs = ids.length
    ? await db.select().from(certificates).where(inArray(certificates.childId, ids))
    : [];
  const visible = filter ? mail.filter((row) => row.childId === filter) : mail;
  return (
    <PageShell>
      <ParentNav name={parent.name} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Every letter, in the open</h1>
      <p className="mt-2 text-[#fff6e5]/75">Approve AI drafts, write your own elf replies, or simply watch the friendship grow.</p>
      <div className="mt-6 grid gap-4">
        {visible.map((letter) => {
          const kid = kids.find((row) => row.id === letter.childId);
          const elf = getElf(letter.elfId);
          const waiting = letter.status === "awaiting_approval";
          const pendingChild = letter.status === "pending" && letter.fromRole === "child";
          return (
            <article key={letter.id} className="letter-paper rounded-[24px] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#9b1b30]">
                {kid?.firstName} · {letter.fromRole === "elf" ? elf.name : "Child"} · {letter.status}
              </p>
              <p className="font-display text-xl text-[#6d1020]">{letter.subject}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{letter.body}</p>
              {waiting && <LetterActions letterId={letter.id} draft={letter.body} />}
              {pendingChild && <LetterActions letterId={letter.id} draft={`Dear ${kid?.firstName},\n\n`} needsReply />}
            </article>
          );
        })}
        {!visible.length && <p>No letters yet.</p>}
      </div>
      {certs.some((cert) => cert.premium && !cert.purchased) && (
        <div className="card-glass mt-8 rounded-[24px] p-5">
          <h2 className="font-display text-2xl">Premium certificates waiting</h2>
          {certs
            .filter((cert) => cert.premium && !cert.purchased)
            .map((cert) => (
              <div key={cert.id} className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p>{cert.title}</p>
                <BuyCertificateButton id={cert.id} />
              </div>
            ))}
        </div>
      )}
    </PageShell>
  );
}
