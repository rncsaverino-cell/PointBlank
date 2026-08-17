"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Collection } from "@/lib/types";

export function ProductFilters({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeCollection = searchParams.get("collection");
  const inStockOnly = searchParams.get("inStock") === "1";
  const isNew = searchParams.get("new") === "1";
  const isBestseller = searchParams.get("bestseller") === "1";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Collection</h3>
        <div className="mt-3 flex flex-col gap-2.5">
          <button
            onClick={() => updateParam("collection", null)}
            className={`text-left text-sm ${!activeCollection ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            All Collections
          </button>
          {collections.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParam("collection", c.slug)}
              className={`text-left text-sm ${activeCollection === c.slug ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Availability</h3>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <Checkbox id="inStock" checked={inStockOnly} onCheckedChange={(c) => updateParam("inStock", c ? "1" : null)} />
            <Label htmlFor="inStock" className="cursor-pointer font-normal">In stock only</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="new" checked={isNew} onCheckedChange={(c) => updateParam("new", c ? "1" : null)} />
            <Label htmlFor="new" className="cursor-pointer font-normal">New releases</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="bestseller" checked={isBestseller} onCheckedChange={(c) => updateParam("bestseller", c ? "1" : null)} />
            <Label htmlFor="bestseller" className="cursor-pointer font-normal">Best sellers</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Wholesale Price</h3>
        <div className="mt-3 flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("min") ?? ""}
            onBlur={(e) => updateParam("min", e.target.value)}
            className="h-9"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("max") ?? ""}
            onBlur={(e) => updateParam("max", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={() => router.push(pathname)}>
        Clear Filters
      </Button>
    </div>
  );
}
