import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/data";

export const metadata = { title: "New Releases" };

export default async function NewReleasesPage() {
  const products = await getProducts({ isNew: true, sort: "newest" });

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">New Releases</h1>
      <p className="mt-1 text-sm text-muted-foreground">Fresh designs, restocked and refreshed regularly.</p>

      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
