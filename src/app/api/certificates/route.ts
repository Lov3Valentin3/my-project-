import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates, children } from "@/db/schema";
import { getParent } from "@/lib/auth";
export async function POST(request: Request) {
  const parent = await getParent();
  if (!parent) return Response.json({ error: "Parent login needed." }, { status: 401 });
  const body = (await request.json()) as { certificateId?: string };
  if (!body.certificateId) return Response.json({ error: "Missing certificate." }, { status: 400 });
  const [cert] = await db.select().from(certificates).where(eq(certificates.id, body.certificateId));
  if (!cert) return Response.json({ error: "Not found." }, { status: 404 });
  const [child] = await db.select().from(children).where(eq(children.id, cert.childId));
  if (!child || child.parentId !== parent.id) {
    return Response.json({ error: "Not your certificate." }, { status: 403 });
  }
  await db
    .update(certificates)
    .set({ purchased: true })
    .where(and(eq(certificates.id, cert.id)));
  return Response.json({ ok: true });
}
