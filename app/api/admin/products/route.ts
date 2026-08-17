import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";
import { slugify } from "@/lib/utils";
import type { Product } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const collection = store.collections.find((c) => c.id === body.collection_id);
    const newProduct: Product = {
      id: `prod-${crypto.randomUUID()}`,
      sku: body.sku,
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description || "",
      collection_id: body.collection_id || null,
      collection: collection ?? null,
      wholesale_price: Number(body.wholesale_price) || 0,
      msrp: Number(body.msrp) || 0,
      moq: Number(body.moq) || 1,
      pack_quantity: Number(body.pack_quantity) || 1,
      dimensions: body.dimensions || "",
      paper_spec: body.paper_spec || "",
      inventory: Number(body.inventory) || 0,
      status: body.status || "active",
      image_url: body.image_url || "https://placehold.co/900x900/1a1310/e4132b?text=New+Product",
      gallery: [],
      is_new: Boolean(body.is_new),
      is_bestseller: Boolean(body.is_bestseller),
      is_limited: Boolean(body.is_limited),
      is_range_favorite: Boolean(body.is_range_favorite),
      created_at: new Date().toISOString(),
    };
    store.products.unshift(newProduct);
    return NextResponse.json({ ok: true, demo: true, product: newProduct });
  }

  const supabase = createClient()!;
  const { data, error } = await supabase
    .from("products")
    .insert({
      sku: body.sku,
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description,
      collection_id: body.collection_id || null,
      wholesale_price: body.wholesale_price,
      msrp: body.msrp,
      moq: body.moq,
      pack_quantity: body.pack_quantity,
      dimensions: body.dimensions,
      paper_spec: body.paper_spec,
      inventory: body.inventory,
      status: body.status || "active",
      image_url: body.image_url,
      is_new: Boolean(body.is_new),
      is_bestseller: Boolean(body.is_bestseller),
      is_limited: Boolean(body.is_limited),
      is_range_favorite: Boolean(body.is_range_favorite),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, product: data });
}
