import Link from "next/link";
import { BrandMark, SiteFooter } from "@/components/site-chrome";
import { Countdown } from "@/components/countdown";
import { ElfAvatar } from "@/components/elf-avatar";
import { Twinkles } from "@/components/snowfall";
import { ADDONS, PLANS } from "@/lib/content";
import { ELF_PROFILES } from "@/lib/elves";
import { quoteForDate } from "@/lib/quotes";
import { getKid, getParent } from "@/lib/auth";
export const dynamic = "force-dynamic";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "NorthPole Pal",
      applicationCategory: "KidsApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "AggregateOffer",
        lowPrice: "0",
        highPrice: "199",
        priceCurrency: "USD",
      },
      description:
        "Magical elf pen pal app for kids with letters from the North Pole, games, certificates, and parent controls.",
      keywords:
        "Elf Pen Pal, Letters from the North Pole, Santa Letters, Christmas App for Kids, Elf Mail",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is NorthPole Pal safe for children?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Parents can view every letter, approve replies, pause conversations, and choose AI, parent-written, or combined responses.",
          },
        },
        {
          "@type": "Question",
          name: "Can more than one child have an elf friend?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Parents can manage multiple children, each with their own elf, inbox, games, and certificates.",
          },
        },
      ],
    },
  ],
};
export default async function HomePage() {
  const [parent, kid] = await Promise.all([getParent(), getKid()]);
  const quote = quoteForDate();
  const featured = ELF_PROFILES.slice(0, 8);
  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Twinkles />
      <div className="lights" />
      <header className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
        <BrandMark />
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link href="/elves" className="rounded-full px-3 py-2 hover:bg-white/10">
            Elves
          </Link>
          <Link href="#how" className="rounded-full px-3 py-2 hover:bg-white/10">
            How it works
          </Link>
          <Link href="#pricing" className="rounded-full px-3 py-2 hover:bg-white/10">
            Plans
          </Link>
          {parent ? (
            <Link href="/parent/dashboard" className="magical-btn">
              Parent Workshop
            </Link>
          ) : kid ? (
            <Link href="/kid/dashboard" className="magical-btn">
              Open My Mail
            </Link>
          ) : (
            <Link href="/parent/login" className="magical-btn ghost">
              Family Login
            </Link>
          )}
        </nav>
      </header>
      <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-8 pt-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f4d03f]/40 bg-[#f4d03f]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#f4d03f]">
            Elf Pen Pal · Santa&apos;s Workshop · Ages 3–12
          </p>
          <h1 className="font-display text-4xl leading-[1.05] text-[#fff6e5] sm:text-6xl">
            A magical friend is already writing from the North Pole.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#fff6e5]/80">
            Step into Santa&apos;s workshop. Choose your elf, send letters that sparkle, play festive
            games, unlock certificates, and keep a friendship that remembers every wish.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/parent/login" className="magical-btn">
              Parent Login
            </Link>
            <Link href="/parent/register" className="magical-btn red">
              Parent Register
            </Link>
            <Link href="/kid/login" className="magical-btn green">
              Kid Login
            </Link>
            <Link href="/kid/register" className="magical-btn ghost">
              Kid Register
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#fff6e5]/60">
            Demo family: parent@northpole.mail / ChristmasMagic · Kid Emma / jinglebells
          </p>
        </div>
        <article className="relative">
          <div className="absolute -left-6 -top-8 hidden rotate-[-8deg] sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/envelope-seal.jpg"
              alt="Wax-sealed North Pole envelope"
              className="h-28 w-28 rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div className="letter-paper relative rounded-[28px] p-7 sm:p-9">
            <div className="mb-4 flex items-start justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9b1b30]">
                North Pole Post · Already waiting
              </p>
              <span className="stamp">Elf Mail</span>
            </div>
            <p className="font-hand text-3xl leading-snug text-[#6d1020]">Dear new friend,</p>
            <div className="font-hand mt-4 space-y-3 text-2xl leading-snug">
              <p>
                I found your name sparkling on a snowflake that drifted into the workshop. Santa says
                you have a wonderfully kind heart — and I have been hoping for a pen pal just like
                you.
              </p>
              <p>
                If you write back, I will tell you about the reindeer, the cookie kitchen, and the
                secret drawer where we keep extra wishes. Will you be my friend?
              </p>
              <p className="pt-2">
                With snowy hugs,
                <br />
                Holly ✨
                <br />
                Reindeer Caretaker
              </p>
            </div>
          </div>
        </article>
      </section>
      <section className="relative mx-4 overflow-hidden rounded-[32px] border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-northpole.jpg"
          alt="Magical North Pole village under the aurora"
          className="h-[360px] w-full object-cover sm:h-[460px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07151c] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <p className="font-display text-2xl text-[#f4d03f] sm:text-4xl">Countdown to Christmas</p>
          <div className="mt-4">
            <Countdown />
          </div>
        </div>
      </section>
      <section className="mx-auto mt-10 max-w-4xl px-4 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-[#f4d03f]">Daily inspiration</p>
        <blockquote className="font-display mt-3 text-3xl text-[#fff6e5]">“{quote.text}”</blockquote>
        <p className="mt-2 text-sm text-[#fff6e5]/70">— {quote.author}</p>
      </section>
      <section id="how" className="mx-auto mt-16 grid max-w-6xl gap-5 px-4 md:grid-cols-3">
        {[
          ["1. Choose your elf", "Twenty unique friends with jobs, treats, jokes, and big hearts."],
          ["2. Write real letters", "Your elf remembers your name, favorite things, and inside jokes."],
          ["3. Unlock the workshop", "Videos, certificates, games, and surprises all year long."],
        ].map(([title, copy]) => (
          <div key={title} className="card-glass rounded-3xl p-6">
            <h2 className="font-display text-2xl text-[#f4d03f]">{title}</h2>
            <p className="mt-3 text-[#fff6e5]/80">{copy}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#f4d03f]">Choose your elf friend</p>
            <h2 className="font-display text-4xl">Twenty friends. One just for you.</h2>
          </div>
          <Link href="/elves" className="magical-btn ghost">
            Meet all 20
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((elf) => (
            <Link
              key={elf.id}
              href="/elves"
              className="card-glass rounded-3xl p-5 no-underline transition hover:-translate-y-1"
            >
              <ElfAvatar elf={elf} size={92} className="mx-auto" />
              <h3 className="font-display mt-3 text-center text-xl text-[#f4d03f]">{elf.name}</h3>
              <p className="mt-1 text-center text-sm text-[#fff6e5]/75">{elf.christmasJob}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-16 grid max-w-6xl gap-6 px-4 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-[28px] border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/workshop.jpg" alt="Santa's workshop" className="h-72 w-full object-cover" />
        </figure>
        <div className="card-glass rounded-[28px] p-7">
          <h2 className="font-display text-3xl text-[#f4d03f]">Built for wonder. Designed for parents.</h2>
          <ul className="mt-4 space-y-3 text-[#fff6e5]/85">
            <li>Personalized elf replies that stay in character and remember previous letters.</li>
            <li>Parent portal to approve, write, or pause every conversation.</li>
            <li>Certificates, videos, badges, and ten cozy mini games.</li>
            <li>Works on the web and as a mobile-friendly app for iOS and Android.</li>
          </ul>
        </div>
      </section>
      <section id="pricing" className="mx-auto mt-16 max-w-6xl px-4">
        <h2 className="font-display text-center text-4xl text-[#f4d03f]">Share the workshop</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[#fff6e5]/75">
          Start free, then unlock unlimited letters, premium certificates, and Christmas Eve magic.
        </p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`rounded-[28px] p-6 ${plan.featured ? "bg-[linear-gradient(180deg,rgba(212,175,55,0.2),rgba(155,27,48,0.25))] glow-gold" : "card-glass"}`}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[#f4d03f]">{plan.name}</p>
              <p className="font-display mt-2 text-4xl">
                ${plan.price}
                <span className="text-base text-[#fff6e5]/70">
                  {plan.cadence === "once" ? " once" : ` / ${plan.cadence}`}
                </span>
              </p>
              <p className="mt-2 text-sm text-[#fff6e5]/75">{plan.blurb}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.perks.map((perk) => (
                  <li key={perk}>✦ {perk}</li>
                ))}
              </ul>
              <Link href="/parent/register" className="magical-btn mt-6 w-full">
                Begin
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ADDONS.map((addon) => (
            <div key={addon.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <p className="font-semibold text-[#f4d03f]">{addon.name}</p>
              <p className="text-[#fff6e5]/70">{addon.blurb}</p>
              <p className="mt-2">${addon.price}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
