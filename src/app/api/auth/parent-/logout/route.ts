import { destroySession } from "@/lib/auth";
export async function POST(request: Request) {
  await destroySession("parent");
  return Response.redirect(new URL("/", request.url), 302);
}
