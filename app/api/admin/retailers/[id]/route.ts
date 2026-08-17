import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";
import type { RetailerStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { status, pricing_tier } = body as { status?: RetailerStatus; pricing_tier?: string };

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const retailer = store.retailers.find((r) => r.id === params.id);
    if (!retailer) return NextResponse.json({ error: "Retailer not found" }, { status: 404 });
    if (status) retailer.retailer_status = status;
    if (pricing_tier) retailer.pricing_tier = pricing_tier;

    const application = store.applications.find((a) => a.profile_id === params.id);
    if (application && status) application.status = status;

    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createClient()!;
  const update: Record<string, string> = {};
  if (status) update.retailer_status = status;
  if (pricing_tier) update.pricing_tier = pricing_tier;

  const { error } = await supabase.from("profiles").update(update).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (status) {
    await supabase.from("retailer_applications").update({ status }).eq("profile_id", params.id);
  }

  return NextResponse.json({ ok: true });
}
