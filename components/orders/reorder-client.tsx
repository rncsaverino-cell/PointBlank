"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RotateCcw, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order, Product } from "@/lib/types";
import { toast } from "sonner";

interface PreviouslyOrderedItem {
  product: Product;
  lastQuantity: number;
  lastOrderedAt: string;
}

export function ReorderClient({ orders }: { orders: Order[] }) {
  const { addItem } = useCart();
  const router = useRouter();

  const lastOrder = orders[0];

  const previouslyOrdered = useMemo(() => {
    const map = new Map<string, PreviouslyOrderedItem>();
    for (const order of orders) {
      for (const item of order.items ?? []) {
        if (!item.product) continue;
        const existing = map.get(item.product.id);
        if (!existing || new Date(order.created_at) > new Date(existing.lastOrderedAt)) {
          map.set(item.product.id, {
            product: item.product,
            lastQuantity: item.quantity,
            lastOrderedAt: order.created_at,
          });
        }
      }
    }
    return Array.from(map.values());
  }, [orders]);

  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(previouslyOrdered.map((p) => [p.product.id, p.lastQuantity]))
  );

  function reorderLastOrder() {
    if (!lastOrder) return;
    for (const item of lastOrder.items ?? []) {
      if (item.product) addItem(item.product, item.quantity);
    }
    toast.success(`Added ${lastOrder.items?.length ?? 0} products from order ${lastOrder.order_number}`);
    router.push("/cart");
  }

  return (
    <div>
      {lastOrder && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Quick Reorder</p>
            <p className="mt-1 font-display text-lg font-semibold">
              Reorder everything from {lastOrder.order_number} ({formatDate(lastOrder.created_at)})
            </p>
          </div>
          <Button onClick={reorderLastOrder}>
            <RotateCcw className="h-4 w-4" /> Reorder Last Order
          </Button>
        </div>
      )}

      <div className="rounded-2xl border border-border">
        {previouslyOrdered.map(({ product, lastOrderedAt }) => (
          <div key={product.id} className="flex flex-col gap-4 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-center">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/30">
              {product.image_url && <Image src={product.image_url} alt={product.name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                SKU {product.sku} · Last ordered {formatDate(lastOrderedAt)} · {formatCurrency(product.wholesale_price)}/unit
              </p>
            </div>
            <QuantitySelector
              value={quantities[product.id] ?? product.moq}
              onChange={(q) => setQuantities((prev) => ({ ...prev, [product.id]: q }))}
              step={product.moq}
              min={product.moq}
            />
            <Button
              variant="outline"
              onClick={() => {
                addItem(product, quantities[product.id] ?? product.moq);
              }}
            >
              <ShoppingCart className="h-4 w-4" /> Add to Order
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
