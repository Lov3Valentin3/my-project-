import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getParent } from "@/lib/auth";
import { PageShell, ParentNav } from "@/components/site-chrome";
import { MarkReadButton } from "@/components/parent-widgets";
export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications" };
export default async function NotificationsPage() {
  const parent = await getParent();
  if (!parent) redirect("/parent/login");
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.parentId, parent.id))
    .orderBy(desc(notifications.createdAt));
  return (
    <PageShell>
      <ParentNav name={parent.name} />
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl text-[#f4d03f]">Workshop alerts</h1>
        <MarkReadButton />
      </div>
      <p className="mt-2 text-[#fff6e5]/75">New letters, certificates, videos, and Christmas countdown moments.</p>
      <div className="mt-6 grid gap-3">
        {rows.map((row) => (
          <article key={row.id} className={`rounded-2xl p-4 ${row.read ? "bg-white/5" : "bg-[#9b1b30]/40"}`}>
            <p className="text-xs uppercase tracking-[0.16em] text-[#f4d03f]">{row.type}</p>
            <p className="font-display text-xl">{row.title}</p>
            <p className="text-sm text-[#fff6e5]/80">{row.body}</p>
          </article>
        ))}
        {!rows.length && <p>No alerts yet — the workshop is peaceful.</p>}
      </div>
    </PageShell>
  );
}