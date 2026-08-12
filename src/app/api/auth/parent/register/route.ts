import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parents, subscriptions } from "@/db/schema";
import { createSession, hashSecret, newId } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const name = body.name?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  const password = body.password || "";
  if (name.length < 2 || !email.includes("@") || password.length < 6) {
    return Response.json({ error: "Please add your name, a real email, and a 6+ letter password." }, { status: 400 });
  }
  const [existing] = await db.select().from(parents).where(eq(parents.email, email));
  if (existing) {
    return Response.json({ error: "That email already has a workshop key." }, { status: 409 });
  }
  const id = newId();
  await db.insert(parents).values({
    id,
    name,
    email,
    passwordHash: hashSecret(password),
  });
  await db.insert(subscriptions).values({
    id: newId(),
    parentId: id,
    plan: "free",
    status: "active",
    addons: "[]",
  });
  await createSession("parent", id);
  return Response.json({ ok: true, id });
}