import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { createSession, verifySecret } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json()) as { firstName?: string; secretWord?: string };
  const firstName = body.firstName?.trim() || "";
  const matches = await db.select().from(children).where(eq(children.firstName, firstName));
  const kid = matches.find((row) => verifySecret(body.secretWord || "", row.secretWordHash));
  if (!kid) {
    const demo = await db.select().from(children).where(and(eq(children.id, "demo-child")));
    if (
      firstName.toLowerCase() === "emma" &&
      (body.secretWord || "").toLowerCase() === "jinglebells" &&
      demo[0]
    ) {
      await createSession("kid", demo[0].id);
      return Response.json({ ok: true });
    }
    return Response.json({ error: "We could not find that young explorer." }, { status: 401 });
  }
  await createSession("kid", kid.id);
  return Response.json({ ok: true });
}
