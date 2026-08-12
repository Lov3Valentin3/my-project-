import { eq } from "drizzle-orm";
import { db } from "@/db";
import { gameScores } from "@/db/schema";
import { getKid, newId } from "@/lib/auth";
import { grantAchievement, unlockForChild } from "@/lib/actions";
export async function POST(request: Request) {
  const kid = await getKid();
  if (!kid) return Response.json({ error: "Kid login needed." }, { status: 401 });
  const body = (await request.json()) as { gameSlug?: string; score?: number; stars?: number };
  if (!body.gameSlug) return Response.json({ error: "Missing game." }, { status: 400 });
  await db.insert(gameScores).values({
    id: newId(),
    childId: kid.id,
    gameSlug: body.gameSlug,
    score: Number(body.score || 0),
    stars: Math.min(3, Math.max(1, Number(body.stars || 1))),
  });
  const played = await db.select().from(gameScores).where(eq(gameScores.childId, kid.id));
  const unique = new Set(played.map((row) => row.gameSlug)).size;
  await grantAchievement(
    kid.id,
    `game-${body.gameSlug}`,
    "Workshop Player",
    `Finished ${body.gameSlug.replaceAll("-", " ")}.`,
    "🎮",
  );
  if (unique >= 3) {
    await grantAchievement(kid.id, "gamer", "Workshop Champion", "Played three different North Pole games.", "🏆");
  }
  await unlockForChild(kid.id, 1, unique);
  return Response.json({ ok: true, unique });
}