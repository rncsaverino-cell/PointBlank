import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { PublicProduct } from "@/lib/types";

export function Hero({ products }: { products: PublicProduct[] }) {
  const featured = products.slice(0, 5);

  return (
    <section className="relative overflow-hidden border-b border-border bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[140px]" />

      <div className="container relative grid gap-16 py-20 lg:grid-cols-2 lg:items-center lg:py-32">
        <div className="animate-fade-up">
          <span className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Wholesale Only — Approved Retailers
          </span>
          <h1 className="mt-6 text-balance font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Targets Shouldn&apos;t Be <span className="text-primary">Boring.</span>
          </h1>
          <p className="mt-6 max-w-lg text-balance text-lg text-muted-foreground">
            PointBlank creates fresh, entertaining target designs built to make every range visit
            more memorable.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/apply">
                Become a Retailer <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Retailer Login</Link>
            </Button>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Fresh targets. Better range days.
          </p>
        </div>

        <div className="relative animate-fade-in [animation-delay:200ms]">
          <div className="grid grid-cols-3 gap-4">
            {featured.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-secondary/20 shadow-2xl"
              >
                {p.image_url && (
                  <Image src={p.image_url} alt={p.name} fill className="object-contain" priority sizes="33vw" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
