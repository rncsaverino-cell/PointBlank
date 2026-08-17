"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { QuantitySelector } from "@/components/product/quantity-selector";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/types";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center">
      <Link href={`/shop/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/30">
        {product.image_url && <Image src={product.image_url} alt={product.name} fill className="object-cover" />}
      </Link>

      <div className="flex-1">
        <Link href={`/shop/${product.slug}`} className="font-display text-sm font-semibold hover:text-primary">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">SKU {product.sku} · Pack of {product.pack_quantity}</p>
        <p className="mt-1 text-xs text-muted-foreground">{formatCurrency(product.wholesale_price)} / unit</p>
      </div>

      <QuantitySelector value={quantity} onChange={(q) => updateQuantity(product.id, q)} step={product.moq} min={product.moq} />

      <div className="w-24 text-right font-display text-sm font-semibold">
        {formatCurrency(quantity * product.wholesale_price)}
      </div>

      <button
        onClick={() => removeItem(product.id)}
        className="text-muted-foreground transition-colors hover:text-destructive"
        aria-label="Remove item"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
