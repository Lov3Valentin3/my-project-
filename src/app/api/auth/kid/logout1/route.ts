import { destroySession } from "@/lib/auth";
export async function POST(request: Request) {
  await destroySession("kid");
  return Response.redirect(new URL("/", request.url), 302);
}