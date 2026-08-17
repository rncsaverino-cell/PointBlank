import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";
import type { Lead } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  const lead: Partial<Lead> = {
    business_name: body.business_name,
    business_type: body.business_type ?? null,
    contact_name: body.contact_name ?? null,
    email: body.email ?? null,
    phone: body.phone ?? null,
    website: body.website ?? null,
    address: body.address ?? null,
    city: body.city ?? null,
    region: body.region ?? null,
    country: body.country ?? null,
    source: body.source ?? null,
    notes: body.notes ?? null,
    status: body.status ?? "new",
  };

  if (!lead.business_name) {
    return NextResponse.json({ error: "business_name is required" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...lead,
    } as Lead;
    store.leads.unshift(newLead);
    return NextResponse.json({ ok: true, demo: true, lead: newLead });
  }

  const supabase = createClient()!;
  const { data, error } = await supabase.from("leads").insert(lead).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, lead: data });
}
