"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { ProductBadges } from "./badge-set";
import { QuantitySelector } from "./quantity-selector";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { formatCurrency, marginPercent } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(product.moq);
  const inStock = product.inventory > 0;

  return (
    <div className="card-hover flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[2/3] overflow-hidden bg-secondary/20">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        <div className="absolute left-3 top-3">
          <ProductBadges product={product} />
        </div>
        {!inStock && (
          <div className="absolute inset-x-0 bottom-0 bg-background/90 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Out of Stock
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.collection?.name}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug text-foreground hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{product.dimensions}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Package className="h-3 w-3" /> Pack of {product.pack_quantity}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="font-display text-xl font-bold text-foreground">
              {formatCurrency(product.wholesale_price)}
              <span className="text-xs font-normal text-muted-foreground"> / unit</span>
            </p>
            <p className="text-xs text-muted-foreground">
              SRP {formatCurrency(product.msrp)} · {marginPercent(product.wholesale_price, product.msrp)}% margin
            </p>
          </div>
          <p className="text-xs text-muted-foreground">MOQ {product.moq}</p>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <QuantitySelector value={quantity} onChange={setQuantity} step={product.moq} min={product.moq} className="flex-1" />
          <Button
            size="icon"
            className="h-11 w-11 shrink-0"
            disabled={!inStock}
            onClick={() => addItem(product, quantity)}
            aria-label="Add to order"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
