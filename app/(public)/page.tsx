import { Hero } from "@/components/marketing/hero";
import { BenefitsGrid } from "@/components/marketing/benefits-grid";
import { CollectionsPreview } from "@/components/marketing/collections-preview";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { NewReleasesGrid } from "@/components/marketing/new-releases-grid";
import { CtaSection } from "@/components/marketing/cta-section";
import { getCollections, getPublicProducts } from "@/lib/data";

export default async function HomePage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getPublicProducts(),
  ]);

  return (
    <>
      <Hero products={products} />
      <BenefitsGrid />
      <CollectionsPreview collections={collections.slice(0, 6)} />
      <HowItWorks />
      <NewReleasesGrid products={products} />
      <CtaSection />
    </>
  );
}
