import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const collection = store.collections.find((c) => c.id === params.id);
    if (!collection) return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    Object.assign(collection, {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.hero_image !== undefined && { hero_image: body.hero_image }),
      ...(body.active !== undefined && { active: Boolean(body.active) }),
      ...(body.sort_order !== undefined && { sort_order: Number(body.sort_order) }),
    });
    return NextResponse.json({ ok: true, demo: true, collection });
  }

  const supabase = createClient()!;
  const { error } = await supabase.from("collections").update(body).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
