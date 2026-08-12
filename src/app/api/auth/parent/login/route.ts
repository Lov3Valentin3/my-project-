import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parents } from "@/db/schema";
import { createSession, verifySecret } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() || "";
  const [parent] = await db.select().from(parents).where(eq(parents.email, email));
  if (!parent || !verifySecret(body.password || "", parent.passwordHash)) {
    return Response.json({ error: "Those workshop keys did not match." }, { status: 401 });
  }
  await createSession("parent", parent.id);
  return Response.json({ ok: true });
}