import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/lib/data";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Collections</h1>
      <p className="mt-1 text-sm text-muted-foreground">Themed target lines, organized for easy reordering.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.id}
            href={`/collections/${c.slug}`}
            className="card-hover img-zoom group relative block overflow-hidden rounded-2xl border border-border"
          >
            <div className="relative aspect-[4/3] w-full">
              {c.hero_image && <Image src={c.hero_image} alt={c.name} fill className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-display text-2xl font-bold text-white">{c.name}</h3>
              <p className="mt-1 text-sm text-white/70">{c.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
