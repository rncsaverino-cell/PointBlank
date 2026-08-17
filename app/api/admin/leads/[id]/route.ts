import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const lead = store.leads.find((l) => l.id === params.id);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    Object.assign(lead, body);
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createClient()!;
  const { error } = await supabase.from("leads").update(body).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    store.leads = store.leads.filter((l) => l.id !== params.id);
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createClient()!;
  const { error } = await supabase.from("leads").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
