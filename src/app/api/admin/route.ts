import { desc } from "drizzle-orm";
import { db } from "@/db";
import { children, elves, letters, parents } from "@/db/schema";
import { ELF_PROFILES } from "@/lib/elves";
import { ensureSeeded } from "@/lib/seed";
export async function GET(request: Request) {
  await ensureSeeded();
  const key = new URL(request.url).searchParams.get("key") || "";
  if (key !== (process.env.ADMIN_KEY || "northpole-admin")) {
    return Response.json({ error: "Admin key required." }, { status: 401 });
  }
  const [elfRows, kidRows, parentRows, letterRows] = await Promise.all([
    db.select().from(elves),
    db.select().from(children),
    db.select().from(parents),
    db.select().from(letters).orderBy(desc(letters.createdAt)).limit(20),
  ]);
  return Response.json({
    elves: elfRows.length ? elfRows : ELF_PROFILES,
    children: kidRows,
    parents: parentRows.map((row) => ({ id: row.id, name: row.name, email: row.email })),
    letters: letterRows,
  });
}
