import { NextResponse } from "next/server";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

// Configure this URL as a webhook endpoint in the Stripe Dashboard
// (Developers → Webhooks) listening for `checkout.session.completed`,
// pointing at https://yourdomain.com/api/stripe/webhook. Requires
// STRIPE_WEBHOOK_SECRET to verify the signature — see .env.example.
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 400 });
  }

  const stripe = getStripeClient()!;
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { orderId?: string } };
    const orderId = session.metadata?.orderId;

    if (orderId && isSupabaseConfigured()) {
      const supabase = createServiceClient();
      if (supabase) {
        await supabase.from("orders").update({ status: "processing" }).eq("id", orderId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
