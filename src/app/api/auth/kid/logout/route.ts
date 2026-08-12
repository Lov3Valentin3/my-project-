import { destroySession } from "@/lib/auth";
export async function POST() {
  await destroySession("kid");
  return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), 302);
}
