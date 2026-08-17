import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

interface OrderPayload {
  items: { productId: string; quantity: number; unitPrice: number }[];
  status: "draft" | "submitted";
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export async function POST(request: Request) {
  const body: OrderPayload = await request.json();

  if (!body.items?.length) {
    return NextResponse.json({ error: "Order has no items" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    // Demo mode: nothing to persist to — the UI still confirms success.
    return NextResponse.json({
      ok: true,
      demo: true,
      orderNumber: `PB-DEMO-${Math.floor(Math.random() * 90000 + 10000)}`,
    });
  }

  const supabase = createClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const orderNumber = `PB-${Math.floor(Math.random() * 90000 + 10000)}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      retailer_id: user.id,
      order_number: orderNumber,
      subtotal: body.subtotal,
      shipping: body.shipping,
      tax: body.tax,
      total: body.total,
      status: body.status,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Could not create order" }, { status: 400 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    body.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }))
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, orderNumber, orderId: order.id });
}
