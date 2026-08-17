import { Sparkles, PackageCheck, TrendingUp, RefreshCw } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Fresh Designs",
    description: "New releases give customers a reason to come back.",
  },
  {
    icon: PackageCheck,
    title: "Retail Ready",
    description: "Professional packaging and merchandising.",
  },
  {
    icon: TrendingUp,
    title: "Healthy Margins",
    description: "Wholesale pricing designed for resale.",
  },
  {
    icon: RefreshCw,
    title: "Repeat Purchases",
    description: "Targets are consumable products that encourage repeat sales.",
  },
];

export function BenefitsGrid() {
  return (
    <section className="border-b border-border py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Built for Better Range Days
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Give your customers something new to shoot. PointBlank constantly develops themed
            target collections instead of selling the same standard silhouettes and bullseyes.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="card-hover rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
