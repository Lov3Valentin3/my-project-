import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getParent } from "@/lib/auth";
export async function GET() {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.parentId, parent.id))
    .orderBy(desc(notifications.createdAt));
  return Response.json({ notifications: rows });
}
export async function POST(request: Request) {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const body = (await request.json()) as { id?: string };
  if (body.id) {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, body.id));
  } else {
    await db.update(notifications).set({ read: true }).where(eq(notifications.parentId, parent.id));
  }
  return Response.json({ ok: true });
}
