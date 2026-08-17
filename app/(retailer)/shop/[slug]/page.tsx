import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductOrderPanel } from "@/components/product/product-order-panel";
import { ProductBadges } from "@/components/product/badge-set";
import { ProductCard } from "@/components/product/product-card";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/data";
import { collectionThemeStyle } from "@/lib/theme";
import { ThemeBackdrop, ThemeEyebrow, ThemedFrame } from "@/components/product/theme-elements";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const images = [product.image_url, ...(product.gallery ?? [])].filter(Boolean) as string[];

  return (
    <div className="relative isolate container py-10" style={collectionThemeStyle(product.collection?.slug)}>
      <ThemeBackdrop slug={product.collection?.slug} />

      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        <span>/</span>
        <Link href={`/collections/${product.collection?.slug}`} className="hover:text-foreground">
          {product.collection?.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ThemedFrame slug={product.collection?.slug}>
          <ProductGallery images={images} name={product.name} />
        </ThemedFrame>

        <div>
          <ThemeEyebrow slug={product.collection?.slug} className="mb-3" />
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.collection?.name}</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <ProductBadges product={product} className="mt-3 flex flex-wrap gap-1.5" />
          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <div className="mt-5 rounded-lg border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
            <p><strong className="text-foreground">SKU:</strong> {product.sku}</p>
            <p className="mt-1"><strong className="text-foreground">Paper:</strong> {product.paper_spec}</p>
          </div>

          <div className="mt-6">
            <ProductOrderPanel product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl font-bold">More from {product.collection?.name}</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
