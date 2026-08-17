"use client";

import { useState } from "react";
import { QuantitySelector } from "./quantity-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, marginDollars, marginPercent } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

export function ProductOrderPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(product.moq);
  const inStock = product.inventory > 0;
  const lineTotal = quantity * product.wholesale_price;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display text-3xl font-bold">{formatCurrency(product.wholesale_price)}</p>
          <p className="text-sm text-muted-foreground">per unit, wholesale</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground line-through">{formatCurrency(product.msrp)} SRP</p>
          <p className="text-sm font-semibold text-primary">
            {marginPercent(product.wholesale_price, product.msrp)}% margin ({formatCurrency(marginDollars(product.wholesale_price, product.msrp))})
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm">
        <div>
          <dt className="text-muted-foreground">Pack Quantity</dt>
          <dd className="font-semibold">{product.pack_quantity} targets</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Minimum Order</dt>
          <dd className="font-semibold">{product.moq} units</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Inventory</dt>
          <dd className={`font-semibold ${inStock ? "text-success" : "text-destructive"}`}>
            {inStock ? `${product.inventory} in stock` : "Out of stock"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Dimensions</dt>
          <dd className="font-semibold">{product.dimensions}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} step={product.moq} min={product.moq} className="flex-1" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Line total: {formatCurrency(lineTotal)}</p>

      <Button
        size="lg"
        className="mt-4 w-full"
        disabled={!inStock}
        onClick={() => addItem(product, quantity)}
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Order
      </Button>
    </div>
  );
}
