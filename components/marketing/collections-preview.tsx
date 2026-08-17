import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/types";

export function CollectionsPreview({ collections }: { collections: Collection[] }) {
  return (
    <section className="border-b border-border py-24">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Collections</span>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Give Your Customers <br className="hidden sm:block" /> Something New to Shoot.
            </h2>
          </div>
          <Link
            href="/targets"
            className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            View all collections →
          </Link>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <Link
              key={c.id}
              href="/targets"
              className={`card-hover img-zoom group relative block overflow-hidden rounded-2xl border border-border ${
                i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
              }`}
            >
              <div className={`relative w-full ${i === 0 ? "aspect-[4/3] sm:aspect-square" : "aspect-[4/3]"}`}>
                {c.hero_image && (
                  <Image
                    src={c.hero_image}
                    alt={c.name}
                    fill
                    className="object-cover transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white">{c.name}</h3>
                <p className="mt-1 text-sm text-white/70">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
