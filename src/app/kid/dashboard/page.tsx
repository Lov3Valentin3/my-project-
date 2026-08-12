import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { achievements, certificates, letters } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { Countdown } from "@/components/countdown";
import { ElfAvatar } from "@/components/elf-avatar";
import { getElf } from "@/lib/elves";
import { quoteForDate } from "@/lib/quotes";
export const dynamic = "force-dynamic";
export const metadata = { title: "Kid Dashboard" };
export default async function KidDashboardPage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const elf = getElf(kid.elfId);
  const quote = quoteForDate();
  const [mail, badges, certs] = await Promise.all([
    db.select().from(letters).where(eq(letters.childId, kid.id)).orderBy(desc(letters.createdAt)),
    db.select().from(achievements).where(eq(achievements.childId, kid.id)),
    db.select().from(certificates).where(eq(certificates.childId, kid.id)),
  ]);
  const visible = mail.filter((row) => row.status === "delivered");
  const unreadFromElf = visible.filter((row) => row.fromRole === "elf").slice(0, 1)[0];
  return (
    <PageShell wide>
      <KidNav name={kid.firstName} />
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-[32px] border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-northpole.jpg" alt="" className="h-56 w-full object-cover" />
          <div className="card-glass -mt-10 rounded-t-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#f4d03f]">Welcome back</p>
            <h1 className="font-display text-4xl">Hello, {kid.firstName}!</h1>
            <p className="mt-2 text-[#fff6e5]/80">
              {elf.name} is thinking of you in the {kid.favoriteColor.toLowerCase()} glow of the workshop.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/kid/write" className="magical-btn">
                Write a letter
              </Link>
              <Link href="/kid/inbox" className="magical-btn green">
                Open inbox
              </Link>
              <Link href="/kid/games" className="magical-btn ghost">
                Play games
              </Link>
            </div>
          </div>
        </div>
        <aside className="card-glass rounded-[32px] p-6 text-center">
          <ElfAvatar elf={elf} size={140} className="mx-auto" />
          <h2 className="font-display mt-3 text-2xl text-[#f4d03f]">{elf.name}</h2>
          <p className="text-sm text-[#fff6e5]/75">{elf.christmasJob}</p>
          <p className="font-hand mt-3 text-2xl">“{elf.catchphrase}”</p>
          <Link href="/kid/elf" className="mt-4 inline-block text-sm underline">
            Visit {elf.name}&apos;s nook
          </Link>
        </aside>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <article className="card-glass rounded-[28px] p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f4d03f]">Latest elf mail</p>
          {unreadFromElf ? (
            <div className="letter-paper mt-4 rounded-3xl p-5">
              <p className="font-hand text-2xl leading-snug">{unreadFromElf.body.slice(0, 280)}...</p>
              <Link href={`/kid/inbox/${unreadFromElf.id}`} className="magical-btn mt-4 inline-flex">
                Read the whole letter
              </Link>
            </div>
          ) : (
            <p className="mt-3">Write your first letter and watch an envelope fly north!</p>
          )}
        </article>
        <article className="rounded-[28px] bg-[linear-gradient(180deg,#9b1b30,#4a0c16)] p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f4d03f]">Countdown to Christmas</p>
          <div className="mt-4">
            <Countdown />
          </div>
        </article>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="card-glass rounded-[28px] p-6">
          <p className="text-[#f4d03f]">Daily inspiration</p>
          <p className="font-display mt-2 text-2xl">“{quote.text}”</p>
          <p className="mt-2 text-sm text-[#fff6e5]/70">— {quote.author}</p>
        </div>
        <div className="card-glass rounded-[28px] p-6">
          <p className="text-[#f4d03f]">Certificates</p>
          <p className="font-display mt-2 text-4xl">{certs.length}</p>
          <Link href="/kid/certificates" className="mt-3 inline-block text-sm underline">
            Print your awards
          </Link>
        </div>
        <div className="card-glass rounded-[28px] p-6">
          <p className="text-[#f4d03f]">Badges</p>
          <div className="mt-3 flex flex-wrap gap-2 text-2xl">
            {badges.length ? badges.map((badge) => <span key={badge.id}>{badge.icon}</span>) : "✨"}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
