"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Archive } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductFormDialog } from "./product-form-dialog";
import { formatCurrency } from "@/lib/utils";
import type { Collection, Product, ProductStatus } from "@/lib/types";
import { toast } from "sonner";

const statusVariant: Record<ProductStatus, "success" | "warning" | "muted"> = {
  active: "success",
  draft: "warning",
  archived: "muted",
};

export function ProductTable({ products, collections }: { products: Product[]; collections: Collection[] }) {
  const router = useRouter();
  const [archivingId, setArchivingId] = useState<string | null>(null);

  async function archiveProduct(id: string) {
    setArchivingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not archive product");
      toast.success("Product archived");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setArchivingId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <ProductFormDialog
          collections={collections}
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> New Product
            </Button>
          }
        />
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Wholesale</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/30">
                      {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                <TableCell className="text-muted-foreground">{p.collection?.name ?? "—"}</TableCell>
                <TableCell>{formatCurrency(p.wholesale_price)}</TableCell>
                <TableCell className={p.inventory === 0 ? "text-destructive" : ""}>{p.inventory}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <ProductFormDialog
                      product={p}
                      collections={collections}
                      trigger={
                        <Button size="icon" variant="outline" className="h-8 w-8" title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      }
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      disabled={archivingId === p.id || p.status === "archived"}
                      onClick={() => archiveProduct(p.id)}
                      title="Archive"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
