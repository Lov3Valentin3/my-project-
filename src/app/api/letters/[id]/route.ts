import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children, letters } from "@/db/schema";
import { getParent, newId } from "@/lib/auth";
import { notifyParent } from "@/lib/actions";
import { getElf } from "@/lib/elves";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json()) as { action?: string; text?: string };
  const [letter] = await db.select().from(letters).where(eq(letters.id, id));
  if (!letter) return Response.json({ error: "Letter not found." }, { status: 404 });
  const [child] = await db.select().from(children).where(eq(children.id, letter.childId));
  if (!child || child.parentId !== parent.id) {
    return Response.json({ error: "That letter belongs to another workshop." }, { status: 403 });
  }
  if (body.action === "approve") {
    await db.update(letters).set({ status: "delivered" }).where(eq(letters.id, id));
    return Response.json({ ok: true });
  }
  if (body.action === "edit" && body.text) {
    await db
      .update(letters)
      .set({ body: body.text, status: "delivered", parentNote: "Edited by a grown-up elf helper" })
      .where(eq(letters.id, id));
    return Response.json({ ok: true });
  }
  if (body.action === "reply" && body.text) {
    await db.insert(letters).values({
      id: newId(),
      childId: child.id,
      elfId: child.elfId,
      fromRole: "elf",
      subject: `A reply from ${getElf(child.elfId).name}`,
      body: body.text,
      status: "delivered",
      stamp: "gold",
      parentNote: "Written with a parent's help",
    });
    await db.update(letters).set({ status: "delivered" }).where(eq(letters.id, id));
    await notifyParent(parent.id, child.id, "letter", "You sent an elf reply", `A letter is on its way to ${child.firstName}.`);
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Unknown action." }, { status: 400 });
}
