import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { letters } from "@/db/schema";
import { getKid, getParent } from "@/lib/auth";
import { sendChildLetter } from "@/lib/actions";
import { ensureSeeded } from "@/lib/seed";
export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  const kid = await getKid();
  const parent = await getParent();
  const target = childId || kid?.id;
  if (!target) return Response.json({ error: "No child selected." }, { status: 401 });
  if (!kid && !parent) return Response.json({ error: "Please log in." }, { status: 401 });
  const rows = await db
    .select()
    .from(letters)
    .where(eq(letters.childId, target))
    .orderBy(desc(letters.createdAt));
  const visible = kid ? rows.filter((row) => row.status === "delivered") : rows;
  return Response.json({ letters: visible });
}
export async function POST(request: Request) {
  await ensureSeeded();
  const kid = await getKid();
  if (!kid) return Response.json({ error: "Kid login needed." }, { status: 401 });
  const body = (await request.json()) as { body?: string; stamp?: string };
  try {
    const result = await sendChildLetter({
      childId: kid.id,
      body: body.body || "",
      stamp: body.stamp,
    });
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Mail owl got lost." }, { status: 400 });
  }
}
