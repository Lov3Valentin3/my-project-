import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Inbox" };
export default async function InboxPage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const elf = getElf(kid.elfId);
  const rows = await db
    .select()
    .from(letters)
    .where(eq(letters.childId, kid.id))
    .orderBy(desc(letters.createdAt));
  const visible = rows.filter((row) => row.status === "delivered");
  return (
    <PageShell>
      <KidNav name={kid.firstName} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Magical envelopes</h1>
      <p className="mt-2 text-[#fff6e5]/75">Every letter between you and {elf.name}.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((letter) => (
          <Link
            key={letter.id}
            href={`/kid/inbox/${letter.id}`}
            className="envelope relative overflow-hidden rounded-[24px] p-5 no-underline"
          >
            <div className="absolute right-4 top-4 text-3xl">{letter.fromRole === "elf" ? "🧝" : "✉️"}</div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#6d1020]">
              {letter.fromRole === "elf" ? `From ${elf.name}` : `From ${kid.firstName}`}
            </p>
            <p className="font-display mt-2 text-xl text-[#3b2416]">{letter.subject}</p>
            <p className="mt-2 line-clamp-3 text-sm text-[#3b2416]/80">{letter.body}</p>
            <p className="mt-4 text-xs text-[#3b2416]/60">
              {new Date(letter.createdAt).toLocaleDateString()} · stamp: {letter.stamp}
            </p>
          </Link>
        ))}
        {!visible.length && <p>No envelopes yet. Write the first letter!</p>}
      </div>
    </PageShell>
  );
}
