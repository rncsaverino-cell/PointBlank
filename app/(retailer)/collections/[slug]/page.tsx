import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { getCollection, getProducts } from "@/lib/data";
import { collectionThemeStyle } from "@/lib/theme";
import { ThemeBackdrop, ThemeEyebrow } from "@/components/product/theme-elements";

export default async function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = await getCollection(params.slug);
  if (!collection) notFound();

  const products = await getProducts({ collection: params.slug });

  return (
    <div style={collectionThemeStyle(collection.slug)}>
      <div className="relative h-[320px] w-full overflow-hidden border-b border-border sm:h-[420px]">
        {collection.hero_image && (
          <Image src={collection.hero_image} alt={collection.name} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="container relative flex h-full flex-col justify-end pb-10">
          <ThemeEyebrow slug={collection.slug} className="mb-3 w-fit" />
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">{collection.name}</h1>
          <p className="mt-2 max-w-md text-lg text-primary">{collection.subtitle}</p>
        </div>
      </div>

      <div className="relative isolate container py-10">
        <ThemeBackdrop slug={collection.slug} />
        <p className="max-w-2xl text-muted-foreground">{collection.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
