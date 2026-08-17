"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, Info } from "lucide-react";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/utils";
import { WHOLESALE_RULES, calculateOrderTotals } from "@/lib/constants";
import { toast } from "sonner";

export default function CartPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState<"draft" | "submit" | null>(null);

  const { shipping, tax, total } = calculateOrderTotals(subtotal);
  const meetsMinimum = subtotal >= WHOLESALE_RULES.minimumOpeningOrder;

  async function submitOrder(status: "draft" | "submitted") {
    setLoading(status === "draft" ? "draft" : "submit");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          subtotal,
          shipping,
          tax,
          total,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            unitPrice: i.product.wholesale_price,
          })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not submit order");

      toast.success(status === "draft" ? "Order saved as draft" : `Order ${json.orderNumber} submitted`, {
        description: json.demo ? "Demo mode — not persisted to a real database." : undefined,
      });
      clearCart();
      router.push("/orders");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-6 font-display text-2xl font-bold">Your order is empty</h1>
        <p className="mt-2 text-muted-foreground">Browse the shop to start building your wholesale order.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Shop All Targets</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Your Order</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} product{items.length > 1 ? "s" : ""} in cart</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {items.map((item) => (
            <CartLineItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated Tax</dt>
              <dd>{formatCurrency(tax)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-display text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              Minimum opening order: {formatCurrency(WHOLESALE_RULES.minimumOpeningOrder)}. Free
              shipping on orders over {formatCurrency(WHOLESALE_RULES.freeShippingThreshold)}.
            </span>
          </div>

          {!meetsMinimum && (
            <p className="mt-3 text-xs font-medium text-destructive">
              Add {formatCurrency(WHOLESALE_RULES.minimumOpeningOrder - subtotal)} more to meet the minimum order.
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button
              size="lg"
              disabled={!meetsMinimum || loading !== null}
              onClick={() => submitOrder("submitted")}
            >
              {loading === "submit" && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit Order
            </Button>
            <Button
              size="lg"
              variant="outline"
              disabled={loading !== null}
              onClick={() => submitOrder("draft")}
            >
              {loading === "draft" && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Order as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
