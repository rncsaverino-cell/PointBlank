import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicProductCard } from "@/components/product/public-product-card";
import { getCollections, getPublicProducts } from "@/lib/data";

export const metadata = { title: "Our Targets" };

export default async function TargetsPage() {
  const [collections, products] = await Promise.all([getCollections(), getPublicProducts()]);

  return (
    <div>
      <section className="border-b border-border py-20 text-center">
        <div className="container">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Our Targets</span>
          <h1 className="mx-auto mt-2 max-w-2xl text-balance font-display text-5xl font-bold tracking-tight">
            Themed, Collectible, Constantly Refreshed.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Browse our current collections. Wholesale pricing and ordering are available to
            approved retailers only.
          </p>
        </div>
      </section>

      {collections.map((collection, i) => {
        const collectionProducts = products.filter((p) => p.collection_id === collection.id);
        return (
          <section key={collection.id} className={i % 2 ? "bg-secondary/10" : ""}>
            <div className="container py-20">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <div className={i % 2 ? "lg:order-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                    {collection.hero_image && (
                      <Image src={collection.hero_image} alt={collection.name} fill className="object-cover" />
                    )}
                  </div>
                </div>
                <div className={i % 2 ? "lg:order-1" : ""}>
                  <h2 className="font-display text-3xl font-bold sm:text-4xl">{collection.name}</h2>
                  <p className="mt-2 text-lg text-primary">{collection.subtitle}</p>
                  <p className="mt-4 max-w-md text-muted-foreground">{collection.description}</p>
                  <div className="mt-6 max-w-xs">
                    {collectionProducts.map((p) => (
                      <PublicProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-border py-20 text-center">
        <div className="container">
          <h2 className="font-display text-3xl font-bold">Ready to stock PointBlank?</h2>
          <div className="mt-6 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/apply">Become a Retailer</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Retailer Login</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
