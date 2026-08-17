import { PublicProductCard } from "@/components/product/public-product-card";
import type { PublicProduct } from "@/lib/types";

export function NewReleasesGrid({ products }: { products: PublicProduct[] }) {
  return (
    <section className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Fresh Drops</span>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">New Releases</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            New themed designs, restocked and refreshed regularly.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <PublicProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
