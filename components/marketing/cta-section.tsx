import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
      <div className="container relative text-center">
        <h2 className="mx-auto max-w-2xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Bring PointBlank to Your Customers.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          Apply for a wholesale account and get access to pricing, inventory, and retailer-exclusive
          drops.
        </p>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/apply">
              Apply for Wholesale Access <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
