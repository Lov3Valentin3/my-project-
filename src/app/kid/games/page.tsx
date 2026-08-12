import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { achievements, gameScores } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { GAMES } from "@/lib/content";
export const dynamic = "force-dynamic";
export const metadata = { title: "Mini Games" };
export default async function GamesPage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const [scores, badges] = await Promise.all([
    db.select().from(gameScores).where(eq(gameScores.childId, kid.id)),
    db.select().from(achievements).where(eq(achievements.childId, kid.id)),
  ]);
  const best = new Map<string, number>();
  for (const score of scores) {
    best.set(score.gameSlug, Math.max(best.get(score.gameSlug) || 0, score.score));
  }
  return (
    <PageShell wide>
      <KidNav name={kid.firstName} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-[#f4d03f]">Workshop games</h1>
          <p className="mt-2 text-[#fff6e5]/75">Play, earn badges, and unlock the Kindness Certificate.</p>
        </div>
        <p className="rounded-full bg-white/10 px-4 py-2 text-sm">{badges.length} badges collected</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Link
            key={game.slug}
            href={`/kid/games/${game.slug}`}
            className="card-glass rounded-[28px] p-5 no-underline transition hover:-translate-y-1"
          >
            <div className="text-4xl">{game.icon}</div>
            <h2 className="font-display mt-3 text-2xl">{game.title}</h2>
            <p className="mt-2 text-sm text-[#fff6e5]/75">{game.description}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[#f4d03f]">
              {game.difficulty}
              {best.has(game.slug) ? ` · best ${best.get(game.slug)}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
