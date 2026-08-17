import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { getDemoStore } from "@/lib/demo-store";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json() as { status?: OrderStatus; tracking_number?: string };

  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const order = store.orders.find((o) => o.id === params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (body.status) order.status = body.status;
    if (body.tracking_number !== undefined) order.tracking_number = body.tracking_number || null;
    return NextResponse.json({ ok: true, demo: true, order });
  }

  const supabase = createClient()!;
  const update: Record<string, string> = {};
  if (body.status) update.status = body.status;
  if (body.tracking_number !== undefined) update.tracking_number = body.tracking_number;

  const { error } = await supabase.from("orders").update(update).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
