"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CollectionFormDialog } from "./collection-form-dialog";
import type { Collection } from "@/lib/types";
import { toast } from "sonner";

export function CollectionTable({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const sorted = [...collections].sort((a, b) => a.sort_order - b.sort_order);

  async function move(collection: Collection, direction: "up" | "down") {
    const index = sorted.findIndex((c) => c.id === collection.id);
    const swapWith = direction === "up" ? sorted[index - 1] : sorted[index + 1];
    if (!swapWith) return;

    await Promise.all([
      fetch(`/api/admin/collections/${collection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: swapWith.sort_order }),
      }),
      fetch(`/api/admin/collections/${swapWith.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: collection.sort_order }),
      }),
    ]);
    router.refresh();
  }

  async function toggleActive(collection: Collection) {
    await fetch(`/api/admin/collections/${collection.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !collection.active }),
    });
    toast.success(collection.active ? "Collection hidden" : "Collection published");
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end">
        <CollectionFormDialog trigger={<Button><Plus className="h-4 w-4" /> New Collection</Button>} />
      </div>

      <div className="mt-4 grid gap-3">
        {sorted.map((c, i) => (
          <div key={c.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
            <div className="flex flex-col gap-1">
              <button
                disabled={i === 0}
                onClick={() => move(c, "up")}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={i === sorted.length - 1}
                onClick={() => move(c, "down")}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/30">
              {c.hero_image && <Image src={c.hero_image} alt={c.name} fill className="object-cover" />}
            </div>

            <div className="flex-1">
              <p className="font-display text-sm font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.subtitle}</p>
            </div>

            <Badge variant={c.active ? "success" : "muted"}>{c.active ? "Active" : "Hidden"}</Badge>

            <Button size="sm" variant="outline" onClick={() => toggleActive(c)}>
              {c.active ? "Hide" : "Publish"}
            </Button>

            <CollectionFormDialog
              collection={c}
              trigger={
                <Button size="icon" variant="outline" className="h-9 w-9" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
