import Link from "next/link";
import { BrandMark, PageShell } from "@/components/site-chrome";
export default function NotFound() {
  return (
    <PageShell>
      <BrandMark />
      <div className="letter-paper mx-auto mt-10 max-w-xl rounded-[32px] p-8 text-center">
        <p className="text-5xl">🦌</p>
        <h1 className="font-display mt-3 text-4xl text-[#6d1020]">This trail is covered in snow.</h1>
        <p className="mt-3">The page wandered off to feed the reindeer.</p>
        <Link href="/" className="magical-btn mt-6 inline-flex">
          Back to the North Pole
        </Link>
      </div>
    </PageShell>
  );
}
