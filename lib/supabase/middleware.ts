import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./is-configured";

const RETAILER_PREFIXES = [
  "/dashboard",
  "/shop",
  "/collections",
  "/new-releases",
  "/best-sellers",
  "/cart",
  "/orders",
  "/reorder",
  "/downloads",
  "/account",
];

const ADMIN_PREFIX = "/admin";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  const { pathname } = request.nextUrl;

  // Demo mode: no Supabase project configured yet. Let everything through
  // so the app is fully browsable with mock data; real auth kicks in once
  // NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The "pending approval" page is where unapproved retailers land — it
  // must stay reachable even when the approval check below would
  // otherwise bounce them right back to it.
  if (pathname === "/account/pending") {
    return response;
  }

  const needsRetailerAuth = RETAILER_PREFIXES.some((p) => pathname.startsWith(p));
  const needsAdminAuth = pathname.startsWith(ADMIN_PREFIX);

  if (!needsRetailerAuth && !needsAdminAuth) {
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, retailer_status")
    .eq("id", user.id)
    .single();

  if (needsAdminAuth && profile?.role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (needsRetailerAuth && profile?.role !== "admin" && profile?.retailer_status !== "approved") {
    const url = request.nextUrl.clone();
    url.pathname = "/account/pending";
    return NextResponse.redirect(url);
  }

  return response;
}
