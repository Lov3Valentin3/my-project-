import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  achievements,
  certificates,
  children,
  gameScores,
  letters,
  memories,
  notifications,
  subscriptions,
  videos,
} from "@/db/schema";
import { newId } from "@/lib/auth";
import {
  CERTIFICATE_CATALOG,
  FREE_LETTER_LIMIT,
  VIDEO_SCENES,
} from "@/lib/content";
import { composeElfLetter, extractMemories, welcomeLetter } from "@/lib/elf-ai";
import { getElf } from "@/lib/elves";
export async function getActivePlan(parentId: string | null) {
  if (!parentId) return { plan: "free", addons: [] as string[] };
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.parentId, parentId), eq(subscriptions.status, "active")));
  if (!sub) return { plan: "free", addons: [] as string[] };
  let addons: string[] = [];
  try {
    addons = JSON.parse(sub.addons || "[]") as string[];
  } catch {
    addons = [];
  }
  return { plan: sub.plan, addons };
}
export async function canSendLetter(child: { parentId: string | null; lettersThisMonth: number; letterMonthKey: string | null }) {
  const plan = await getActivePlan(child.parentId);
  if (plan.plan !== "free") return { ok: true, remaining: 99 };
  const key = monthKey();
  const used = child.letterMonthKey === key ? child.lettersThisMonth : 0;
  return { ok: used < FREE_LETTER_LIMIT, remaining: Math.max(0, FREE_LETTER_LIMIT - used) };
}
export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
export async function notifyParent(
  parentId: string | null,
  childId: string,
  type: string,
  title: string,
  body: string,
) {
  if (!parentId) return;
  await db.insert(notifications).values({
    id: newId(),
    parentId,
    childId,
    type,
    title,
    body,
    read: false,
  });
}
export async function unlockForChild(childId: string, letterCount: number, gameCount: number) {
  const [child] = await db.select().from(children).where(eq(children.id, childId));
  if (!child) return;
  for (const cert of CERTIFICATE_CATALOG) {
    const lettersOk =
      !("unlockAfterLetters" in cert) || letterCount >= (cert.unlockAfterLetters ?? 0);
    const gamesOk =
      !("unlockAfterGames" in cert) || gameCount >= (cert.unlockAfterGames ?? 0);
    if (!lettersOk || !gamesOk) continue;
    const existing = await db
      .select()
      .from(certificates)
      .where(and(eq(certificates.childId, childId), eq(certificates.type, cert.type)));
    if (existing.length) continue;
    await db.insert(certificates).values({
      id: newId(),
      childId,
      type: cert.type,
      title: cert.title,
      description: cert.description,
      premium: cert.premium,
      purchased: !cert.premium,
    });
    await notifyParent(
      child.parentId,
      childId,
      "certificate",
      "New certificate unlocked",
      `${child.firstName} unlocked ${cert.title}.`,
    );
  }
  const owned = await db.select().from(videos).where(eq(videos.childId, childId));
  for (const scene of VIDEO_SCENES) {
    if (letterCount < scene.unlockAfter) continue;
    if (owned.some((row) => row.scene === scene.scene)) continue;
    await db.insert(videos).values({
      id: newId(),
      childId,
      elfId: child.elfId,
      title: scene.title,
      description: `${child.firstName}, ${scene.description}`,
      scene: scene.scene,
      unlocked: true,
    });
    await notifyParent(
      child.parentId,
      childId,
      "video",
      "New elf video",
      `${child.firstName} received ${scene.title}.`,
    );
  }
}
export async function grantAchievement(
  childId: string,
  code: string,
  title: string,
  description: string,
  icon: string,
) {
  const existing = await db
    .select()
    .from(achievements)
    .where(and(eq(achievements.childId, childId), eq(achievements.code, code)));
  if (existing.length) return existing[0];
  const [row] = await db
    .insert(achievements)
    .values({
      id: newId(),
      childId,
      code,
      title,
      description,
      icon,
    })
    .returning();
  return row;
}
export async function sendChildLetter(input: {
  childId: string;
  body: string;
  stamp?: string;
}) {
  const [child] = await db.select().from(children).where(eq(children.id, input.childId));
  if (!child) throw new Error("Child not found");
  if (child.paused) {
    throw new Error("Your elf is helping Santa today. Letters will open again soon!");
  }
  const allowance = await canSendLetter(child);
  if (!allowance.ok) {
    throw new Error("This month's free letters are all sent. A grown-up can unlock unlimited mail.");
  }
  const trimmed = input.body.trim();
  if (trimmed.length < 3) throw new Error("Write a little more so your elf can reply.");
  const childLetterId = newId();
  await db.insert(letters).values({
    id: childLetterId,
    childId: child.id,
    elfId: child.elfId,
    fromRole: "child",
    subject: "A letter to my elf",
    body: trimmed,
    status: child.responseMode === "parent" ? "pending" : "delivered",
    stamp: input.stamp || "snowflake",
  });
  const key = monthKey();
  const used = child.letterMonthKey === key ? child.lettersThisMonth : 0;
  await db
    .update(children)
    .set({
      lastLetterAt: new Date(),
      lettersThisMonth: used + 1,
      letterMonthKey: key,
    })
    .where(eq(children.id, child.id));
  const extracted = extractMemories(trimmed);
  for (const memory of extracted) {
    await db.insert(memories).values({
      id: newId(),
      childId: child.id,
      key: memory.key,
      value: memory.value,
    });
  }
  await notifyParent(
    child.parentId,
    child.id,
    "letter",
    `${child.firstName} wrote a letter`,
    "A new envelope is waiting in the family inbox.",
  );
  const history = await db
    .select()
    .from(letters)
    .where(eq(letters.childId, child.id))
    .orderBy(desc(letters.createdAt));
  const memoryRows = await db.select().from(memories).where(eq(memories.childId, child.id));
  let reply: { id: string; body: string; status: string } | null = null;
  if (child.responseMode !== "parent") {
    const body = composeElfLetter({
      elfId: child.elfId,
      child: {
        firstName: child.firstName,
        age: child.age,
        favoriteColor: child.favoriteColor,
        favoriteActivity: child.favoriteActivity,
        christmasWish: child.christmasWish,
        birthday: child.birthday,
      },
      incoming: trimmed,
      history,
      memories: memoryRows,
    });
    const status = child.responseMode === "both" ? "awaiting_approval" : "delivered";
    const id = newId();
    await db.insert(letters).values({
      id,
      childId: child.id,
      elfId: child.elfId,
      fromRole: "elf",
      subject: `A reply from ${getElf(child.elfId).name}`,
      body,
      status,
      stamp: "gold",
    });
    reply = { id, body, status };
    if (status === "delivered") {
      await notifyParent(
        child.parentId,
        child.id,
        "letter",
        `${getElf(child.elfId).name} wrote back`,
        `${child.firstName} has a new letter from the North Pole.`,
      );
    }
  }
  const childLetters = history.filter((row) => row.fromRole === "child").length + 1;
  const gamesPlayed = await db.select().from(gameScores).where(eq(gameScores.childId, child.id));
  await unlockForChild(child.id, childLetters, new Set(gamesPlayed.map((g) => g.gameSlug)).size);
  await grantAchievement(
    child.id,
    "first-letter",
    "First Letter Sent",
    "You mailed your very first North Pole letter.",
    "✉️",
  );
  if (childLetters >= 3) {
    await grantAchievement(
      child.id,
      "penpal",
      "True Pen Pal",
      "Three letters deep into a magical friendship.",
      "💌",
    );
  }
  return { childLetterId, reply };
}
export async function createWelcomeForChild(child: {
  id: string;
  firstName: string;
  age: number;
  favoriteColor: string;
  favoriteActivity: string;
  elfId: string;
}) {
  const elf = getElf(child.elfId);
  await db.insert(letters).values({
    id: newId(),
    childId: child.id,
    elfId: child.elfId,
    fromRole: "elf",
    subject: `${elf.name} wrote first!`,
    body: welcomeLetter(elf, child),
    status: "delivered",
    stamp: "wax",
  });
  await unlockForChild(child.id, 0, 0);
}