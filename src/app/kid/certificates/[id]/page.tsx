import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export default async function CertificatePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const { id } = await params;
  const [cert] = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.id, id), eq(certificates.childId, kid.id)));
  if (!cert || (cert.premium && !cert.purchased)) notFound();
  const elf = getElf(kid.elfId);
  return (
    <main className="min-h-screen bg-[#fffaf0] px-4 py-10 text-[#3b2416]">
      <div className="no-print mx-auto mb-6 flex max-w-3xl justify-between">
        <a href="/kid/certificates" className="magical-btn ghost">
          Back
        </a>
        <button className="magical-btn" type="button" onClick={() => window.print()}>
          Print certificate
        </button>
      </div>
      <article className="ornament-border mx-auto max-w-3xl rounded-[36px] bg-[linear-gradient(180deg,#fffaf0,#f7e6c4)] px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9b1b30]">Santa&apos;s Workshop · North Pole</p>
        <h1 className="font-display mt-4 text-4xl text-[#6d1020] sm:text-5xl">{cert.title}</h1>
        <p className="mt-6 text-sm uppercase tracking-[0.2em]">This certifies that</p>
        <p className="font-hand mt-2 text-6xl text-[#9b1b30]">{kid.firstName}</p>
        <p className="mx-auto mt-4 max-w-xl text-lg">{cert.description}</p>
        <p className="mt-6 text-sm">
          Age {kid.age} · Favorite color {kid.favoriteColor} · Elf friend {elf.name}
        </p>
        <div className="mt-10 flex items-end justify-between gap-6 text-left">
          <div>
            <p className="font-hand text-3xl">{elf.name}</p>
            <p className="text-xs uppercase tracking-[0.16em]">Elf signature</p>
          </div>
          <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-[#d4af37] font-display text-xs text-[#9b1b30]">
            NICE LIST SEAL
          </div>
          <div className="text-right">
            <p className="font-hand text-3xl">S. Claus</p>
            <p className="text-xs uppercase tracking-[0.16em]">Santa Claus</p>
          </div>
        </div>
      </article>
    </main>
  );
}
