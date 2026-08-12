import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { createWelcomeForChild } from "@/lib/actions";
import { getParent, hashSecret, newId } from "@/lib/auth";
import { getElf } from "@/lib/elves";
export async function GET() {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const rows = await db.select().from(children).where(eq(children.parentId, parent.id));
  return Response.json({ children: rows });
}
export async function POST(request: Request) {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const body = (await request.json()) as {
    firstName?: string;
    age?: number;
    favoriteColor?: string;
    favoriteActivity?: string;
    secretWord?: string;
    elfId?: string;
    birthday?: string;
  };
  const firstName = body.firstName?.trim() || "";
  const age = Number(body.age);
  if (firstName.length < 2 || Number.isNaN(age) || age < 3 || age > 12) {
    return Response.json({ error: "Kids need a name and an age between 3 and 12." }, { status: 400 });
  }
  const elf = getElf(body.elfId || "jingle");
  const id = newId();
  await db.insert(children).values({
    id,
    parentId: parent.id,
    firstName,
    age,
    favoriteColor: body.favoriteColor?.trim() || "Gold",
    favoriteActivity: body.favoriteActivity?.trim() || "Making paper snowflakes",
    birthday: body.birthday || null,
    secretWordHash: hashSecret(body.secretWord || "snowflake"),
    elfId: elf.id,
    avatarHue: 8,
    paused: false,
    responseMode: "ai",
  });
  await createWelcomeForChild({
    id,
    firstName,
    age,
    favoriteColor: body.favoriteColor?.trim() || "Gold",
    favoriteActivity: body.favoriteActivity?.trim() || "Making paper snowflakes",
    elfId: elf.id,
  });
  return Response.json({ ok: true, id });
}
