import { RetailerApplicationForm } from "@/components/forms/retailer-application-form";

export const metadata = { title: "Become a Retailer" };

export default function ApplyPage() {
  return (
    <div className="container max-w-3xl py-20">
      <div className="mb-12 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Wholesale Application</span>
        <h1 className="mt-2 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Become a PointBlank Retailer
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Tell us about your business. Once approved, you&apos;ll get full access to wholesale
          pricing, inventory, and retailer-exclusive drops.
        </p>
      </div>
      <RetailerApplicationForm />
    </div>
  );
}
