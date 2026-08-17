import Stripe from "stripe";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeClient() {
  if (!isStripeConfigured()) return null;
  // No pinned apiVersion: uses the Stripe account's default API version.
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
