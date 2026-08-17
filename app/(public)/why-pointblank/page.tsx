import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BenefitsGrid } from "@/components/marketing/benefits-grid";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Why PointBlank" };

const pillars = [
  {
    title: "Bold, not tactical",
    description:
      "We design for energy and personality, not camo and cliches. PointBlank feels like a modern product brand that happens to sell paper targets.",
  },
  {
    title: "A release calendar, not a catalog",
    description:
      "Most target companies sell the same silhouette forever. We ship new themed collections regularly, so your shelf never goes stale.",
  },
  {
    title: "Built to be noticed",
    description:
      "Every design is built to stand out on a shelf, get pulled off the rack on impulse, and get talked about after the range trip.",
  },
];

export default function WhyPointBlankPage() {
  return (
    <div>
      <section className="border-b border-border py-24 text-center">
        <div className="container">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Why PointBlank</span>
          <h1 className="mx-auto mt-2 max-w-3xl text-balance font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Most Targets Are Boring. We Fixed That.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            PointBlank makes target designs that are visually interesting, themed, collectible, and
            fun to use — designed to make a normal range visit feel like an event.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-24">
        <div className="container grid gap-8 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-8">
              <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <BenefitsGrid />

      <section className="py-24 text-center">
        <div className="container">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">See it for yourself.</h2>
          <p className="mt-3 text-muted-foreground">Apply for wholesale access to browse the full catalog.</p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/apply">
                Become a Retailer <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
