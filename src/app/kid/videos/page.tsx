import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { VideoTheater } from "@/components/video-theater";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "Videos From Your Elf" };
export default async function VideosPage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const rows = await db.select().from(videos).where(eq(videos.childId, kid.id));
  return (
    <PageShell wide>
      <KidNav name={kid.firstName} />
      <h1 className="font-display text-4xl text-[#f4d03f]">Videos from your elf</h1>
      <p className="mt-2 max-w-2xl text-[#fff6e5]/75">
        Watch {getElf(kid.elfId).name} wave, wander the workshop, feed reindeer, and visit Santa&apos;s office.
      </p>
      <div className="mt-6">
        <VideoTheater videos={rows} childName={kid.firstName} elfName={getElf(kid.elfId).name} />
      </div>
    </PageShell>
  );
}
