import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "About" };

const values = [
  { title: "Bold", description: "We commit to strong ideas instead of playing it safe." },
  { title: "Clean", description: "Premium design, zero clutter, on every surface we touch." },
  { title: "Playful", description: "Fun without being childish. Confident without being tactical." },
  { title: "Product-focused", description: "Every decision is measured against the shelf and the range." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border py-24">
        <div className="container max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">About PointBlank</span>
          <h1 className="mt-2 text-balance font-display text-5xl font-bold tracking-tight">
            We think targets can be a product people are excited to buy.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            PointBlank started with a simple observation: paper targets are one of the most
            consumed products in the shooting sports industry, and almost none of them are
            designed like a product anyone would be excited about. We build target designs the
            way a modern consumer brand would — themed, collectible, and genuinely fun — so a
            normal range visit feels a little more memorable, and retailers get something
            customers actually come back for.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-24">
        <div className="container">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">What we stand for</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-primary">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="container">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Questions about wholesale?</h2>
          <p className="mt-3 text-muted-foreground">
            Reach out at{" "}
            <a href="mailto:wholesale@pointblanktargets.com" className="text-primary underline underline-offset-4">
              wholesale@pointblanktargets.com
            </a>{" "}
            or apply directly.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/apply">Become a Retailer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
