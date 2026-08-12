import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { children } from "@/db/schema";
import { getParent } from "@/lib/auth";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { AddChildForm } from "@/components/parent-widgets";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Child Management" };
export default async function ChildrenPage() {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const kids = await db.select().from(children).where(eq(children.parentId, parent.id));
  return (
    <PageShell>
      <ParentNav name={parent.name} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Child profiles</h1>
      <p className="mt-2 text-[#fff6e5]/75">Manage multiple children, switch elves, and track each friendship.</p>
      <div className="mt-6 grid gap-4">
        {kids.map((kid) => (
          <article key={kid.id} className="card-glass rounded-[24px] p-5">
            <p className="font-display text-2xl">{kid.firstName}</p>
            <p className="text-sm text-[#fff6e5]/75">
              Age {kid.age} · {kid.favoriteColor} · {kid.favoriteActivity} · elf {getElf(kid.elfId).name}
            </p>
            <p className="mt-2 text-sm">Secret word is stored safely. Kid login uses first name + secret word.</p>
          </article>
        ))}
      </div>
      <div className="letter-paper mt-8 rounded-[28px] p-6">
        <h2 className="font-display text-2xl text-[#6d1020]">Add another child</h2>
        <div className="mt-4">
          <AddChildForm />
        </div>
      </div>
    </PageShell>
  );
}
