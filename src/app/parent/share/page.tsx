import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { getParent } from "@/lib/auth";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { ShareMagic } from "@/components/parent-widgets";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Share the Magic" };
export default async function SharePage() {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const kids = await db.select().from(children).where(eq(children.parentId, parent.id));
  const kid = kids[0];
  return (
    <PageShell>
      <ParentNav name={parent.name} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Share the magic</h1>
      <p className="mt-2 text-[#fff6e5]/75">Generate a festive graphic and tell friends your child has a North Pole pen pal.</p>
      <div className="mt-6">
        <ShareMagic
          childName={kid?.firstName || "my child"}
          elfName={kid ? getElf(kid.elfId).name : "an elf"}
        />
      </div>
    </PageShell>
  );
}