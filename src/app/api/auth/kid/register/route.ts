import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children, parents } from "@/db/schema";
import { createSession, hashSecret, newId } from "@/lib/auth";
import { createWelcomeForChild } from "@/lib/actions";
import { getElf } from "@/lib/elves";
import { ensureSeeded } from "@/lib/seed";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as {
    firstName?: string;
    age?: number;
    favoriteColor?: string;
    favoriteActivity?: string;
    secretWord?: string;
    elfId?: string;
    parentEmail?: string;
    birthday?: string;
  };
  const firstName = body.firstName?.trim() || "";
  const age = Number(body.age);
  const favoriteColor = body.favoriteColor?.trim() || "";
  const favoriteActivity = body.favoriteActivity?.trim() || "";
  const secretWord = body.secretWord || "";
  const elf = getElf(body.elfId || "holly");
  if (firstName.length < 2 || Number.isNaN(age) || age < 3 || age > 12) {
    return Response.json({ error: "Please tell us your first name and age (3–12)." }, { status: 400 });
  }
  if (!favoriteColor || !favoriteActivity || secretWord.length < 4) {
    return Response.json({ error: "Add a favorite color, activity, and a secret word of 4+ letters." }, { status: 400 });
  }
  let parentId: string | null = null;
  if (body.parentEmail) {
    const [parent] = await db
      .select()
      .from(parents)
      .where(eq(parents.email, body.parentEmail.trim().toLowerCase()));
    parentId = parent?.id ?? null;
  }
  const id = newId();
  await db.insert(children).values({
    id,
    parentId,
    firstName,
    age,
    favoriteColor,
    favoriteActivity,
    birthday: body.birthday || null,
    secretWordHash: hashSecret(secretWord),
    elfId: elf.id,
    avatarHue: Math.floor(Math.random() * 40),
    paused: false,
    responseMode: "ai",
  });
  await createWelcomeForChild({
    id,
    firstName,
    age,
    favoriteColor,
    favoriteActivity,
    elfId: elf.id,
  });
  await createSession("kid", id);
  return Response.json({ ok: true, id });
}
