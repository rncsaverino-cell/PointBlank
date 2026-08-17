const steps = [
  {
    number: "01",
    title: "Apply",
    description: "Create a retailer account.",
  },
  {
    number: "02",
    title: "Get Approved",
    description: "PointBlank verifies your business.",
  },
  {
    number: "03",
    title: "Order Wholesale",
    description: "Access pricing, inventory, and retailer-exclusive products.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border bg-secondary/10 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            How Wholesale Works
          </span>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Three Steps to Stock PointBlank
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" />
          {steps.map((step) => (
            <div key={step.number} className="relative rounded-2xl border border-border bg-card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-background font-display text-xl font-bold text-primary">
                {step.number}
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
