import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { getParent, newId } from "@/lib/auth";
import { ADDONS, PLANS } from "@/lib/content";
export async function GET() {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const rows = await db.select().from(subscriptions).where(eq(subscriptions.parentId, parent.id));
  return Response.json({ subscriptions: rows, plans: PLANS, addons: ADDONS });
}
export async function POST(request: Request) {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const body = (await request.json()) as { plan?: string; addon?: string };
  const [current] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.parentId, parent.id), eq(subscriptions.status, "active")));
  if (body.addon) {
    const addons = new Set<string>();
    if (current) {
      try {
        (JSON.parse(current.addons || "[]") as string[]).forEach((item) => addons.add(item));
      } catch {
        /* ignore */
      }
    }
    addons.add(body.addon);
    if (current) {
      await db.update(subscriptions).set({ addons: JSON.stringify([...addons]) }).where(eq(subscriptions.id, current.id));
    } else {
      await db.insert(subscriptions).values({
        id: newId(),
        parentId: parent.id,
        plan: "free",
        status: "active",
        addons: JSON.stringify([...addons]),
      });
    }
    return Response.json({ ok: true, addons: [...addons] });
  }
  if (!body.plan) return Response.json({ error: "Choose a plan." }, { status: 400 });
  const expires =
    body.plan === "monthly"
      ? new Date(Date.now() + 30 * 86400000)
      : body.plan === "annual"
        ? new Date(Date.now() + 365 * 86400000)
        : null;
  if (current) {
    await db
      .update(subscriptions)
      .set({ plan: body.plan, status: "active", expiresAt: expires })
      .where(eq(subscriptions.id, current.id));
  } else {
    await db.insert(subscriptions).values({
      id: newId(),
      parentId: parent.id,
      plan: body.plan,
      status: "active",
      addons: "[]",
      expiresAt: expires,
    });
  }
  return Response.json({ ok: true, plan: body.plan });
}