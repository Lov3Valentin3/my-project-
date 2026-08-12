import Link from "next/link";
import { Twinkles } from "@/components/snowfall";
export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(180deg,#c6283a,#7b1322)] text-xl shadow-[0_0_0_3px_rgba(212,175,55,0.45)]">
        🧝
      </span>
      <span>
        <span className="font-display block text-lg tracking-wide text-[#f4d03f]">
          NorthPole Pal
        </span>
        {!compact && (
          <span className="block text-[11px] uppercase tracking-[0.18em] text-[#fff6e5]/70">
            Letters from the North Pole
          </span>
        )}
      </span>
    </Link>
  );
}
export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-white/10 px-6 py-10 text-sm text-[#fff6e5]/70">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <BrandMark />
          <p className="mt-3 max-w-xs leading-relaxed">
            A safe, magical pen-pal world where children make friends with an elf from Santa&apos;s
            workshop.
          </p>
        </div>
        <div>
          <p className="font-display text-[#f4d03f]">Explore</p>
          <div className="mt-3 grid gap-2">
            <Link href="/elves">Meet the Elves</Link>
            <Link href="/kid/register">Kid Register</Link>
            <Link href="/parent/register">Parent Register</Link>
            <Link href="/#pricing">Subscriptions</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-[#f4d03f]">For Families</p>
          <div className="mt-3 grid gap-2">
            <Link href="/parent/login">Parent Login</Link>
            <Link href="/kid/login">Kid Login</Link>
            <Link href="/safety">Safety & Privacy</Link>
            <Link href="/admin">Workshop Admin</Link>
          </div>
        </div>
        <div>
          <p className="font-display text-[#f4d03f]">Find us</p>
          <p className="mt-3">Elf Pen Pal · Santa Letters · North Pole Letters · Elf Mail</p>
        </div>
      </div>
      <p className="mt-10 text-center text-xs">
        © {new Date().getFullYear()} NorthPole Pal. Made with cocoa, snow, and kindness.
      </p>
    </footer>
  );
}
export function PageShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative min-h-screen">
      <Twinkles />
      <div className="lights" />
      <div className={`${wide ? "max-w-7xl" : "max-w-6xl"} relative z-10 mx-auto px-4 py-6 sm:px-6`}>
        {children}
      </div>
    </div>
  );
}
export function KidNav({ name }: { name: string }) {
  const links = [
    ["/kid/dashboard", "Home"],
    ["/kid/write", "Write"],
    ["/kid/inbox", "Inbox"],
    ["/kid/videos", "Videos"],
    ["/kid/certificates", "Certificates"],
    ["/kid/games", "Games"],
    ["/kid/elf", "My Elf"],
  ] as const;
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <BrandMark compact />
      <nav className="flex flex-wrap gap-2 text-sm">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 no-underline hover:bg-white/10"
          >
            {label}
          </Link>
        ))}
      </nav>
      <form action="/api/auth/kid/logout" method="post">
        <button className="magical-btn ghost px-4 py-2 text-xs" type="submit">
          {name} · Log out
        </button>
      </form>
    </header>
  );
}
export function ParentNav({ name }: { name: string }) {
  const links = [
    ["/parent/dashboard", "Dashboard"],
    ["/parent/children", "Children"],
    ["/parent/letters", "Letters"],
    ["/parent/controls", "Controls"],
    ["/parent/subscription", "Plans"],
    ["/parent/notifications", "Alerts"],
    ["/parent/share", "Share"],
  ] as const;
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <BrandMark compact />
      <nav className="flex flex-wrap gap-2 text-sm">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 no-underline hover:bg-white/10"
          >
            {label}
          </Link>
        ))}
      </nav>
      <form action="/api/auth/parent/logout" method="post">
        <button className="magical-btn ghost px-4 py-2 text-xs" type="submit">
          {name} · Log out
        </button>
      </form>
    </header>
  );
}
