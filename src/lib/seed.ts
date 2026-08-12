import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  children,
  elves,
  gamesCatalog,
  letters,
  parents,
  quotes,
  subscriptions,
  videos,
} from "@/db/schema";
import { hashSecret } from "@/lib/auth";
import { CERTIFICATE_CATALOG, GAMES, VIDEO_SCENES } from "@/lib/content";
import { ELF_PROFILES } from "@/lib/elves";
import { welcomeLetter } from "@/lib/elf-ai";
import { DAILY_QUOTES } from "@/lib/quotes";
let seeded = false;
export async function ensureSeeded() {
  if (seeded) return;
  const existing = await db.select({ id: elves.id }).from(elves).limit(1);
  if (existing.length === 0) {
    await db.insert(elves).values(
      ELF_PROFILES.map((elf) => ({
        id: elf.id,
        name: elf.name,
        gender: elf.gender,
        bio: elf.bio,
        personality: elf.personality,
        hobbies: elf.hobbies,
        christmasJob: elf.christmasJob,
        favoriteTreat: elf.favoriteTreat,
        funFacts: elf.funFacts,
        greeting: elf.greeting,
        catchphrase: elf.catchphrase,
        hatColor: elf.hatColor,
        accentColor: elf.accentColor,
        skin: elf.skin,
        hair: elf.hair,
        hairStyle: elf.hairStyle,
        eyes: elf.eyes,
        accessory: elf.accessory,
      })),
    );
  }
  const quoteRows = await db.select({ id: quotes.id }).from(quotes).limit(1);
  if (quoteRows.length === 0) {
    await db.insert(quotes).values(
      DAILY_QUOTES.map((quote, index) => ({
        id: `q-${index + 1}`,
        text: quote.text,
        author: quote.author,
      })),
    );
  }
  const gameRows = await db.select({ id: gamesCatalog.id }).from(gamesCatalog).limit(1);
  if (gameRows.length === 0) {
    await db.insert(gamesCatalog).values(
      GAMES.map((game) => ({
        id: game.slug,
        slug: game.slug,
        title: game.title,
        description: game.description,
        icon: game.icon,
        difficulty: game.difficulty,
        active: true,
      })),
    );
  }
  const [demoParent] = await db
    .select()
    .from(parents)
    .where(eq(parents.email, "parent@northpole.mail"));
  if (!demoParent) {
    const parentId = "demo-parent";
    const childId = "demo-child";
    await db.insert(parents).values({
      id: parentId,
      name: "Clara Claus-Friend",
      email: "parent@northpole.mail",
      passwordHash: hashSecret("ChristmasMagic"),
    });
    await db.insert(subscriptions).values({
      id: "demo-sub",
      parentId,
      plan: "annual",
      status: "active",
      addons: JSON.stringify(["nice-list"]),
    });
    await db.insert(children).values({
      id: childId,
      parentId,
      firstName: "Emma",
      age: 7,
      favoriteColor: "Ruby red",
      favoriteActivity: "Decorating the tree",
      birthday: "12-20",
      secretWordHash: hashSecret("jinglebells"),
      elfId: "holly",
      avatarHue: 12,
      paused: false,
      responseMode: "ai",
      christmasWish: "A storybook and a sled",
    });
    const holly = ELF_PROFILES.find((elf) => elf.id === "holly")!;
    await db.insert(letters).values({
      id: "demo-welcome",
      childId,
      elfId: "holly",
      fromRole: "elf",
      subject: "A letter already waiting",
      body: welcomeLetter(holly, {
        firstName: "Emma",
        age: 7,
        favoriteColor: "Ruby red",
        favoriteActivity: "Decorating the tree",
      }),
      status: "delivered",
      stamp: "holly",
    });
    await db.insert(videos).values(
      VIDEO_SCENES.slice(0, 3).map((scene, index) => ({
        id: `demo-video-${index}`,
        childId,
        elfId: "holly",
        title: scene.title,
        description: `Emma, ${scene.description}`,
        scene: scene.scene,
        unlocked: true,
      })),
    );
  }
  void CERTIFICATE_CATALOG;
  seeded = true;
}
