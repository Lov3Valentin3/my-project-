import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
export const dynamic = "force-dynamic";
export const metadata = { title: "Certificates" };
export default async function CertificatesPage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const rows = await db.select().from(certificates).where(eq(certificates.childId, kid.id));
  return (
    <PageShell>
      <KidNav name={kid.firstName} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Workshop certificates</h1>
      <p className="mt-2 text-[#fff6e5]/75">Unlock awards, then print them for the fridge — the most important North Pole gallery.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {rows.map((cert) => (
          <article key={cert.id} className="ornament-border rounded-[28px] bg-[#fff6e5] p-6 text-[#3b2416]">
            <p className="text-xs uppercase tracking-[0.16em] text-[#9b1b30]">
              {cert.premium ? "Premium" : "Official"}
            </p>
            <h2 className="font-display text-2xl text-[#6d1020]">{cert.title}</h2>
            <p className="mt-2 text-sm">{cert.description}</p>
            {cert.premium && !cert.purchased ? (
              <p className="mt-4 text-sm">Ask a grown-up to unlock this keepsake in the parent portal.</p>
            ) : (
              <Link href={`/kid/certificates/${cert.id}`} className="magical-btn mt-4 inline-flex">
                Open & print
              </Link>
            )}
          </article>
        ))}
        {!rows.length && <p>Write a letter or play a game to earn your first certificate.</p>}
      </div>
    </PageShell>
  );
}