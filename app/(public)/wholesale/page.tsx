import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "Wholesale" };

const perks = [
  "Wholesale pricing on every collection",
  "New themed releases before they're publicly announced",
  "Retailer-exclusive and limited-edition drops",
  "Free merchandising and social assets",
  "Free shipping on orders over $1,000",
];

const faqs = [
  {
    q: "Who can apply for a wholesale account?",
    a: "Gun ranges, sporting goods retailers, distributors, and ecommerce retailers who resell to end consumers. We verify every application before granting access.",
  },
  {
    q: "What's the minimum order?",
    a: "Our minimum opening order is $250. After that, most products have a per-item minimum order quantity (MOQ) shown on the product page.",
  },
  {
    q: "How long does approval take?",
    a: "Most applications are reviewed within 1-2 business days. You'll get an email once your account is approved and wholesale pricing unlocks.",
  },
  {
    q: "How often do new collections drop?",
    a: "We ship new themed designs regularly and rotate in seasonal / limited-edition runs throughout the year — approved retailers see new releases first.",
  },
];

export default function WholesalePage() {
  return (
    <div>
      <section className="border-b border-border py-24">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Wholesale Program</span>
            <h1 className="mt-2 text-balance font-display text-5xl font-bold tracking-tight">
              Stock the Targets Customers Actually Talk About.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Access wholesale pricing, retailer-exclusive drops, and a catalog that's built to
              turn a consumable range product into a repeat-purchase habit.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href="/apply">Apply for Wholesale Access</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Retailer Login</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <h3 className="font-display text-lg font-semibold">What retailers get</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="py-24">
        <div className="container max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
