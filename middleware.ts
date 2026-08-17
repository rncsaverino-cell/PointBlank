import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/shop/:path*",
    "/collections/:path*",
    "/new-releases/:path*",
    "/best-sellers/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/reorder/:path*",
    "/downloads/:path*",
    "/account/:path*",
    "/admin/:path*",
  ],
};
