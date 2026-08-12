import { redirect } from "next/navigation";
import { getKid } from "@/lib/auth";
import { KidNav, PageShell } from "@/components/site-chrome";
import { ElfAvatar } from "@/components/elf-avatar";
import { getElf } from "@/lib/elves";
export const dynamic = "force-dynamic";
export const metadata = { title: "My Elf" };
export default async function MyElfPage() {
  const kid = await getKid();
  if (!kid) redirect("/kid/login");
  const elf = getElf(kid.elfId);
  return (
    <PageShell>
      <KidNav name={kid.firstName} />
      <section className="grid items-start gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card-glass rounded-[32px] p-6 text-center">
          <ElfAvatar elf={elf} size={200} className="mx-auto" />
          <h1 className="font-display mt-4 text-4xl text-[#f4d03f]">{elf.name}</h1>
          <p>{elf.christmasJob}</p>
        </div>
        <div className="letter-paper rounded-[32px] p-7">
          <p className="font-hand text-3xl text-[#6d1020]">{elf.greeting}</p>
          <p className="mt-4 leading-relaxed">{elf.bio}</p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[#9b1b30]">Personality</dt>
              <dd>{elf.personality}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[#9b1b30]">Hobbies</dt>
              <dd>{elf.hobbies}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[#9b1b30]">Favorite treat</dt>
              <dd>{elf.favoriteTreat}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-[#9b1b30]">Fun facts</dt>
              <dd>{elf.funFacts}</dd>
            </div>
          </dl>
          <p className="font-hand mt-6 text-2xl">“{elf.catchphrase}”</p>
        </div>
      </section>
    </PageShell>
  );
}
