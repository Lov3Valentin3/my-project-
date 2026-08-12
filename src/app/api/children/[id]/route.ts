import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { getParent } from "@/lib/auth";
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const { id } = await context.params;
  const [child] = await db.select().from(children).where(eq(children.id, id));
  if (!child || child.parentId !== parent.id) {
    return Response.json({ error: "Child not found." }, { status: 404 });
  }
  const body = (await request.json()) as {
    paused?: boolean;
    responseMode?: string;
    elfId?: string;
    christmasWish?: string;
  };
  await db
    .update(children)
    .set({
      paused: body.paused ?? child.paused,
      responseMode: body.responseMode ?? child.responseMode,
      elfId: body.elfId ?? child.elfId,
      christmasWish: body.christmasWish ?? child.christmasWish,
    })
    .where(eq(children.id, id));
  return Response.json({ ok: true });
}