import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Demo-mode only: lets you preview the retailer dashboard and admin
// portal without a real Supabase project configured. Has no effect
// once real auth is wired up (see lib/auth.ts).
export async function POST(request: Request) {
  const { role } = await request.json();
  if (role !== "retailer" && role !== "admin") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  cookies().set("pb_demo_role", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  return NextResponse.json({ ok: true });
}
