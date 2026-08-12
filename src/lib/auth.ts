import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children, parents, sessions } from "@/db/schema";
const PARENT_COOKIE = "npp_parent";
const KID_COOKIE = "npp_kid";
const SESSION_DAYS = 30;
export function hashSecret(secret: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(secret, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
export function verifySecret(secret: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(secret, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(prev, next);
}
export function newId() {
  return crypto.randomUUID();
}
async function writeCookie(name: string, value: string, expires: Date) {
  const store = await cookies();
  store.set(name, value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires,
    secure: process.env.NODE_ENV === "production",
  });
}
export async function createSession(role: "parent" | "kid", userId: string) {
  const id = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(sessions).values({
    id,
    role,
    userId,
    expiresAt,
  });
  await writeCookie(role === "parent" ? PARENT_COOKIE : KID_COOKIE, id, expiresAt);
  return id;
}
export async function destroySession(role: "parent" | "kid") {
  const store = await cookies();
  const name = role === "parent" ? PARENT_COOKIE : KID_COOKIE;
  const token = store.get(name)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, token));
  }
  store.set(name, "", { httpOnly: true, path: "/", expires: new Date(0) });
}
export async function getParent() {
  const store = await cookies();
  const token = store.get(PARENT_COOKIE)?.value;
  if (!token) return null;
  const [session] = await db.select().from(sessions).where(eq(sessions.id, token));
  if (!session || session.role !== "parent" || session.expiresAt < new Date()) {
    return null;
  }
  const [parent] = await db.select().from(parents).where(eq(parents.id, session.userId));
  return parent ?? null;
}
export async function getKid() {
  const store = await cookies();
  const token = store.get(KID_COOKIE)?.value;
  if (!token) return null;
  const [session] = await db.select().from(sessions).where(eq(sessions.id, token));
  if (!session || session.role !== "kid" || session.expiresAt < new Date()) {
    return null;
  }
  const [kid] = await db.select().from(children).where(eq(children.id, session.userId));
  return kid ?? null;
}
export async function requireParent() {
  const parent = await getParent();
  if (!parent) {
    throw new Error("UNAUTHORIZED_PARENT");
  }
  return parent;
}
export async function requireKid() {
  const kid = await getKid();
  if (!kid) {
    throw new Error("UNAUTHORIZED_KID");
  }
  return kid;
}