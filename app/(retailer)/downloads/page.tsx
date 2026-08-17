import { Download, FileText, Image as ImageIcon, Palette, FileImage, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCollections, getProducts } from "@/lib/data";

export const metadata = { title: "Resources" };

const resources = [
  {
    icon: FileText,
    title: "Wholesale Catalog",
    description: "Full product grid with SKU, pricing, and MSRP for every active collection.",
    href: "/downloads/wholesale-catalog-placeholder.txt",
    file: "wholesale-catalog.pdf (placeholder)",
  },
  {
    icon: Palette,
    title: "PointBlank Logos",
    description: "Dark and light wordmark files for retail signage and web use.",
    href: "/downloads/pointblank-logo.svg",
    file: "pointblank-logo.svg",
  },
  {
    icon: Layers,
    title: "Merchandising Posters",
    description: "Print-ready counter cards and shelf talkers for retail display.",
    href: "/downloads/merchandising-posters-readme.txt",
    file: "merchandising-posters.zip (placeholder)",
  },
  {
    icon: FileImage,
    title: "Social Media Assets",
    description: "Product renders and templates for announcing new drops.",
    href: "/downloads/social-media-kit-readme.txt",
    file: "social-media-kit.zip (placeholder)",
  },
  {
    icon: FileText,
    title: "Product Spec Sheets",
    description: "Per-product dimensions, paper spec, and pack details.",
    href: "/downloads/product-spec-sheet-template.txt",
    file: "spec-sheet-template.pdf (placeholder)",
  },
];

export default async function DownloadsPage() {
  const [collections, products] = await Promise.all([getCollections(), getProducts()]);

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Retailer Resources</h1>
      <p className="mt-1 max-w-xl text-sm text-muted-foreground">
        Download brand assets, catalogs, and merchandising materials to help sell PointBlank
        in-store and online.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <r.icon className="h-5 w-5" />
              </div>
              <CardTitle className="pt-2">{r.title}</CardTitle>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <a href={r.href} download>
                  <Download className="h-4 w-4" /> {r.file}
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <ImageIcon className="h-5 w-5 text-primary" /> Product Images
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Right-click any product image to save it, or open it full-size in a new tab.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {products.slice(0, 12).map((p) => (
            <a
              key={p.id}
              href={p.image_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary/30"
            >
              {p.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
              )}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-display text-xl font-semibold">Collection Hero Art</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {collections.map((c) => (
            <a
              key={c.id}
              href={c.hero_image ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-secondary/30"
            >
              {c.hero_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.hero_image} alt={c.name} className="h-full w-full object-cover transition-opacity group-hover:opacity-80" />
              )}
              <span className="absolute bottom-2 left-2 text-xs font-semibold text-white drop-shadow">{c.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
