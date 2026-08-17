import { ProductTable } from "@/components/admin/product-table";
import { getAllCollectionsAdmin, getAllProductsAdmin } from "@/lib/data";

export const metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const [products, collections] = await Promise.all([getAllProductsAdmin(), getAllCollectionsAdmin()]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">{products.length} products across {collections.length} collections</p>

      <div className="mt-6">
        <ProductTable products={products} collections={collections} />
      </div>
    </div>
  );
}
