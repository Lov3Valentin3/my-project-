import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
export const parents = pgTable("parents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const children = pgTable("children", {
  id: text("id").primaryKey(),
  parentId: text("parent_id").references(() => parents.id),
  firstName: text("first_name").notNull(),
  age: integer("age").notNull(),
  favoriteColor: text("favorite_color").notNull(),
  favoriteActivity: text("favorite_activity").notNull(),
  birthday: text("birthday"),
  secretWordHash: text("secret_word_hash").notNull(),
  elfId: text("elf_id").notNull(),
  avatarHue: integer("avatar_hue").default(0).notNull(),
  paused: boolean("paused").default(false).notNull(),
  responseMode: text("response_mode").default("ai").notNull(),
  christmasWish: text("christmas_wish"),
  lastLetterAt: timestamp("last_letter_at"),
  lettersThisMonth: integer("letters_this_month").default(0).notNull(),
  letterMonthKey: text("letter_month_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const elves = pgTable("elves", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  bio: text("bio").notNull(),
  personality: text("personality").notNull(),
  hobbies: text("hobbies").notNull(),
  christmasJob: text("christmas_job").notNull(),
  favoriteTreat: text("favorite_treat").notNull(),
  funFacts: text("fun_facts").notNull(),
  greeting: text("greeting").notNull(),
  catchphrase: text("catchphrase").notNull(),
  hatColor: text("hat_color").notNull(),
  accentColor: text("accent_color").notNull(),
  skin: text("skin").notNull(),
  hair: text("hair").notNull(),
  hairStyle: text("hair_style").notNull(),
  eyes: text("eyes").notNull(),
  accessory: text("accessory").notNull(),
});
export const letters = pgTable("letters", {
  id: text("id").primaryKey(),
  childId: text("child_id")
    .notNull()
    .references(() => children.id),
  elfId: text("elf_id").notNull(),
  fromRole: text("from_role").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  status: text("status").default("delivered").notNull(),
  stamp: text("stamp").default("snowflake").notNull(),
  parentNote: text("parent_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const memories = pgTable("memories", {
  id: text("id").primaryKey(),
  childId: text("child_id")
    .notNull()
    .references(() => children.id),
  key: text("key").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  childId: text("child_id").references(() => children.id),
  elfId: text("elf_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  scene: text("scene").notNull(),
  unlocked: boolean("unlocked").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  childId: text("child_id")
    .notNull()
    .references(() => children.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  premium: boolean("premium").default(false).notNull(),
  purchased: boolean("purchased").default(false).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  parentId: text("parent_id")
    .notNull()
    .references(() => parents.id),
  plan: text("plan").notNull(),
  status: text("status").notNull(),
  addons: text("addons").default("[]").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});
export const achievements = pgTable("achievements", {
  id: text("id").primaryKey(),
  childId: text("child_id")
    .notNull()
    .references(() => children.id),
  code: text("code").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});
export const gameScores = pgTable("game_scores", {
  id: text("id").primaryKey(),
  childId: text("child_id")
    .notNull()
    .references(() => children.id),
  gameSlug: text("game_slug").notNull(),
  score: integer("score").notNull(),
  stars: integer("stars").default(1).notNull(),
  playedAt: timestamp("played_at").defaultNow().notNull(),
});
export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  parentId: text("parent_id")
    .notNull()
    .references(() => parents.id),
  childId: text("child_id"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
export const quotes = pgTable("quotes", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  author: text("author").notNull(),
});
export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  childId: text("child_id"),
  parentId: text("parent_id"),
  type: text("type").notNull(),
  meta: text("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const gamesCatalog = pgTable("games_catalog", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  difficulty: text("difficulty").notNull(),
  active: boolean("active").default(true).notNull(),
});
