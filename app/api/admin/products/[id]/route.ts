import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const product = store.products.find((p) => p.id === params.id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (body.collection_id !== undefined) {
      product.collection_id = body.collection_id;
      product.collection = store.collections.find((c) => c.id === body.collection_id) ?? null;
    }
    Object.assign(product, {
      ...(body.sku !== undefined && { sku: body.sku }),
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.wholesale_price !== undefined && { wholesale_price: Number(body.wholesale_price) }),
      ...(body.msrp !== undefined && { msrp: Number(body.msrp) }),
      ...(body.moq !== undefined && { moq: Number(body.moq) }),
      ...(body.pack_quantity !== undefined && { pack_quantity: Number(body.pack_quantity) }),
      ...(body.dimensions !== undefined && { dimensions: body.dimensions }),
      ...(body.paper_spec !== undefined && { paper_spec: body.paper_spec }),
      ...(body.inventory !== undefined && { inventory: Number(body.inventory) }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.image_url !== undefined && { image_url: body.image_url }),
      ...(body.is_new !== undefined && { is_new: Boolean(body.is_new) }),
      ...(body.is_bestseller !== undefined && { is_bestseller: Boolean(body.is_bestseller) }),
      ...(body.is_limited !== undefined && { is_limited: Boolean(body.is_limited) }),
      ...(body.is_range_favorite !== undefined && { is_range_favorite: Boolean(body.is_range_favorite) }),
    });
    return NextResponse.json({ ok: true, demo: true, product });
  }

  const supabase = createClient()!;
  const { error } = await supabase.from("products").update(body).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const product = store.products.find((p) => p.id === params.id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    product.status = "archived";
    return NextResponse.json({ ok: true, demo: true });
  }

  const supabase = createClient()!;
  const { error } = await supabase.from("products").update({ status: "archived" }).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
