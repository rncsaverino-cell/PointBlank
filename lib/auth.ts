import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/is-configured";
import { mockRetailers } from "./mock-data";
import type { Profile } from "./types";

// Demo mode lets you explore the retailer dashboard and admin portal
// without a Supabase project configured yet. Switch views with the
// banner in the app shell (sets the `pb_demo_role` cookie). Once
// NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are set, this is bypassed entirely
// in favor of real Supabase Auth sessions.
const demoAdmin: Profile = {
  id: "demo-admin",
  email: "admin@pointblanktargets.com",
  role: "admin",
  retailer_status: "approved",
  business_name: "PointBlank HQ",
  contact_first_name: "Admin",
  contact_last_name: "User",
  phone: null,
  business_type: null,
  resale_number: null,
  pricing_tier: null,
  created_at: "2025-01-01T00:00:00Z",
};

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) {
    const demoRole = cookies().get("pb_demo_role")?.value ?? "retailer";
    return demoRole === "admin" ? demoAdmin : mockRetailers[0];
  }

  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (data as Profile) ?? null;
}

export function isDemoMode() {
  return !isSupabaseConfigured();
}
