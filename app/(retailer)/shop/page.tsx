import { ProductCard } from "@/components/product/product-card";
import { ProductFilters } from "@/components/product/product-filters";
import { SortSelect } from "@/components/product/sort-select";
import { getCollections, getProducts } from "@/lib/data";
import { PackageSearch } from "lucide-react";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const collections = await getCollections();
  const products = await getProducts({
    collection: searchParams.collection,
    sort: (searchParams.sort as any) ?? "newest",
    minPrice: searchParams.min ? Number(searchParams.min) : undefined,
    maxPrice: searchParams.max ? Number(searchParams.max) : undefined,
    inStockOnly: searchParams.inStock === "1",
    isNew: searchParams.new === "1",
    isBestseller: searchParams.bestseller === "1",
  });

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold">Shop All Targets</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <SortSelect />
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters collections={collections} />
        </aside>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
            <PackageSearch className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-display text-lg font-semibold">No products match those filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing a filter or browsing a different collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
