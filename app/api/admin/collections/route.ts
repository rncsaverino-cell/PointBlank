import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";
import { slugify } from "@/lib/utils";
import type { Collection } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const newCollection: Collection = {
      id: `col-${crypto.randomUUID()}`,
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || "",
      subtitle: body.subtitle || "",
      hero_image:
        body.hero_image || `https://placehold.co/1600x900/1a1310/e4132b?text=${encodeURIComponent(body.name)}`,
      sort_order: store.collections.length + 1,
      active: body.active ?? true,
      created_at: new Date().toISOString(),
    };
    store.collections.push(newCollection);
    return NextResponse.json({ ok: true, demo: true, collection: newCollection });
  }

  const supabase = createClient()!;
  const { data, error } = await supabase
    .from("collections")
    .insert({
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description,
      subtitle: body.subtitle,
      hero_image: body.hero_image,
      active: body.active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, collection: data });
}
