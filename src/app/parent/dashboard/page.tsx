import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { children, letters, notifications } from "@/db/schema";
import { getParent } from "@/lib/auth";
import { getActivePlan } from "@/lib/actions";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Parent Dashboard" };
export default async function ParentDashboardPage() {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const kids = await db.select().from(children).where(eq(children.parentId, parent.id));
  const ids = kids.map((kid) => kid.id);
  const mail = ids.length
    ? await db.select().from(letters).where(inArray(letters.childId, ids)).orderBy(desc(letters.createdAt))
    : [];
  const alerts = await db
    .select()
    .from(notifications)
    .where(eq(notifications.parentId, parent.id))
    .orderBy(desc(notifications.createdAt));
  const plan = await getActivePlan(parent.id);
  const pending = mail.filter((row) => row.status === "pending" || row.status === "awaiting_approval");
  return (
    <PageShell wide>
      <ParentNav name={parent.name} />
      <section className="grid gap-5 lg:grid-cols-3">
        <article className="card-glass rounded-[28px] p-6 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f4d03f]">Family workshop</p>
          <h1 className="font-display text-4xl">Hello, {parent.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-[#fff6e5]/75">
            {kids.length} child profile{kids.length === 1 ? "" : "s"} · plan {plan.plan} · {pending.length} letters need a grown-up look.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/parent/children" className="magical-btn">
              Manage children
            </Link>
            <Link href="/parent/letters" className="magical-btn green">
              Review letters
            </Link>
            <Link href="/parent/subscription" className="magical-btn ghost">
              Upgrade magic
            </Link>
          </div>
        </article>
        <article className="rounded-[28px] bg-[linear-gradient(180deg,#9b1b30,#4a0c16)] p-6">
          <p className="text-[#f4d03f]">Unread alerts</p>
          <p className="font-display mt-2 text-5xl">{alerts.filter((row) => !row.read).length}</p>
          <Link href="/parent/notifications" className="mt-4 inline-block underline">
            Open notifications
          </Link>
        </article>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kids.map((kid) => {
          const elf = getElf(kid.elfId);
          const kidMail = mail.filter((row) => row.childId === kid.id);
          return (
            <article key={kid.id} className="card-glass rounded-[28px] p-5">
              <p className="font-display text-2xl">{kid.firstName}</p>
              <p className="text-sm text-[#fff6e5]/70">
                Age {kid.age} · {elf.name} · {kid.paused ? "paused" : kid.responseMode}
              </p>
              <p className="mt-3 text-sm">{kidMail.length} letters in the friendship</p>
              <Link href={`/parent/letters?child=${kid.id}`} className="mt-3 inline-block text-sm underline">
                View history
              </Link>
            </article>
          );
        })}
        {!kids.length && (
          <div className="card-glass rounded-[28px] p-6">
            <p>Add a child to begin the North Pole friendship.</p>
            <Link href="/parent/children" className="magical-btn mt-4 inline-flex">
              Add a child
            </Link>
          </div>
        )}
      </section>
    </PageShell>
  );
}
