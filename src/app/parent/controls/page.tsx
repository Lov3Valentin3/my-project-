import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { getParent } from "@/lib/auth";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { ChildControls } from "@/components/parent-widgets";
export const dynamic = "force-dynamic";
export const metadata = { title: "Parent Controls" };
export default async function ControlsPage() {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const kids = await db.select().from(children).where(eq(children.parentId, parent.id));
  return (
    <PageShell>
      <ParentNav name={parent.name} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Parent controls</h1>
      <p className="mt-2 max-w-2xl text-[#fff6e5]/75">
        Choose whether replies come from the AI elf, from you, or both. Pause any conversation instantly. Switch elves if a new friend feels like a better match.
      </p>
      <div className="mt-6 grid gap-4">
        {kids.map((kid) => (
          <ChildControls
            key={kid.id}
            child={{
              id: kid.id,
              firstName: kid.firstName,
              paused: kid.paused,
              responseMode: kid.responseMode,
              elfId: kid.elfId,
            }}
          />
        ))}
        {!kids.length && <p>Add a child first.</p>}
      </div>
    </PageShell>
  );
}
