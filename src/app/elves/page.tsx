import Link from "next/link";
import { BrandMark, PageShell, SiteFooter } from "@/components/site-chrome";
import { ElfAvatar } from "@/components/elf-avatar";
import { BOY_ELVES, GIRL_ELVES } from "@/lib/elves";
export const metadata = {
  title: "Meet the Elves",
  description: "Choose from 20 unique North Pole elf pen pals with their own jobs, treats, and personalities.",
};
function ElfGrid({ title, elves }: { title: string; elves: typeof BOY_ELVES }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-3xl text-[#f4d03f]">{title}</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {elves.map((elf) => (
          <article key={elf.id} className="card-glass rounded-[28px] p-5">
            <div className="flex items-start gap-4">
              <ElfAvatar elf={elf} size={110} />
              <div>
                <h3 className="font-display text-2xl text-[#f4d03f]">{elf.name}</h3>
                <p className="text-sm uppercase tracking-[0.14em] text-[#fff6e5]/70">{elf.christmasJob}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#fff6e5]/85">{elf.bio}</p>
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[#f4d03f]">Personality</dt>
                <dd>{elf.personality}</dd>
              </div>
              <div>
                <dt className="text-[#f4d03f]">Hobbies</dt>
                <dd>{elf.hobbies}</dd>
              </div>
              <div>
                <dt className="text-[#f4d03f]">Favorite treat</dt>
                <dd>{elf.favoriteTreat}</dd>
              </div>
              <div>
                <dt className="text-[#f4d03f]">Fun fact</dt>
                <dd>{elf.funFacts}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
export default function ElvesPage() {
  return (
    <PageShell wide>
      <BrandMark />
      <div className="mt-8 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#f4d03f]">20 unique elf friends</p>
        <h1 className="font-display mt-2 text-5xl">Choose a pen pal from Santa&apos;s workshop.</h1>
        <p className="mt-3 text-[#fff6e5]/75">
          Ten boy elves and ten girl elves, each with a real job, favorite treat, and a personality that stays consistent in every letter.
        </p>
        <Link href="/kid/register" className="magical-btn mt-6 inline-flex">
          Start the friendship
        </Link>
      </div>
      <ElfGrid title="Boy Elves" elves={BOY_ELVES} />
      <ElfGrid title="Girl Elves" elves={GIRL_ELVES} />
      <SiteFooter />
    </PageShell>
  );
}
