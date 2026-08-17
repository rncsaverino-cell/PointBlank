import Image from "next/image";
import Link from "next/link";
import { ProductBadges } from "./badge-set";
import type { PublicProduct } from "@/lib/types";

export function PublicProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link
      href="/login"
      className="card-hover group block overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary/20">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        )}
        <div className="absolute left-3 top-3">
          <ProductBadges product={product} />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {product.collection?.name}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold text-foreground">{product.name}</h3>
        <p className="mt-2 text-xs text-muted-foreground">Wholesale pricing for approved retailers</p>
      </div>
    </Link>
  );
}
