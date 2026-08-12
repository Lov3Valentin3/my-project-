import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { GameSwitch } from "@/components/games/workshop-games";
import { GAMES } from "@/lib/content";
export const dynamic = "force-dynamic";
export default async function GamePlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const { slug } = await params;
  const game = GAMES.find((item) => item.slug === slug);
  if (!game) notFound();
  return (
    <PageShell>
      <KidNav name={kid.firstName} />
      <Link href="/kid/games" className="text-sm text-[#f4d03f]">
        ← All games
      </Link>
      <h1 className="font-display mt-2 text-4xl">
        {game.icon} {game.title}
      </h1>
      <p className="mt-2 text-[#fff6e5]/75">{game.description}</p>
      <div className="card-glass mt-6 rounded-[28px] p-5">
        <GameSwitch slug={slug} />
      </div>
    </PageShell>
  );
}