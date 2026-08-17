import { NextResponse } from "next/server";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { getOrder } from "@/lib/data";

// Optional: lets a retailer pay an order by card instead of net terms.
// Not required for the core "submit order" flow — PointBlank's wholesale
// orders are processed regardless of whether this is wired up. Requires
// STRIPE_SECRET_KEY to be set; see .env.example.
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to .env to enable card payment." },
      { status: 400 }
    );
  }

  const { orderId } = await request.json();
  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const stripe = getStripeClient()!;
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `PointBlank Order ${order.order_number}` },
          unit_amount: Math.round(order.total * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${domain}/orders/${order.id}?paid=1`,
    cancel_url: `${domain}/orders/${order.id}`,
    metadata: { orderId: order.id, orderNumber: order.order_number },
  });

  return NextResponse.json({ url: session.url });
}
