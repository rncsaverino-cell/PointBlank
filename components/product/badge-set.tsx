import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";

export function ProductBadges({ product, className }: { product: Pick<Product, "is_new" | "is_bestseller" | "is_limited" | "is_range_favorite">; className?: string }) {
  const badges: { label: string; variant: "new" | "bestseller" | "limited" | "favorite" }[] = [];
  if (product.is_new) badges.push({ label: "New", variant: "new" });
  if (product.is_bestseller) badges.push({ label: "Best Seller", variant: "bestseller" });
  if (product.is_limited) badges.push({ label: "Limited", variant: "limited" });
  if (product.is_range_favorite) badges.push({ label: "Range Favorite", variant: "favorite" });

  if (badges.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap gap-1.5"}>
      {badges.map((b) => (
        <Badge key={b.label} variant={b.variant}>
          {b.label}
        </Badge>
      ))}
    </div>
  );
}
