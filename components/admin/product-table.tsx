"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Archive, Save, Loader2, RotateCcw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormDialog } from "./product-form-dialog";
import type { Collection, Product, ProductStatus } from "@/lib/types";
import { toast } from "sonner";

const editableFields = ["name", "wholesale_price", "msrp", "moq", "pack_quantity", "inventory", "status"] as const;
type EditableField = (typeof editableFields)[number];
type RowEdits = Partial<Record<EditableField, string>>;

export function ProductTable({ products, collections }: { products: Product[]; collections: Collection[] }) {
  const router = useRouter();
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, RowEdits>>({});
  const [saving, setSaving] = useState(false);

  const dirtyIds = useMemo(
    () => Object.keys(edits).filter((id) => Object.keys(edits[id] ?? {}).length > 0),
    [edits]
  );

  function setField(productId: string, field: EditableField, value: string) {
    setEdits((prev) => ({ ...prev, [productId]: { ...prev[productId], [field]: value } }));
  }

  function displayValue(product: Product, field: EditableField): string {
    const edited = edits[product.id]?.[field];
    if (edited !== undefined) return edited;
    return String(product[field] ?? "");
  }

  async function saveAll() {
    setSaving(true);
    try {
      const responses = await Promise.all(
        dirtyIds.map((id) => {
          const rowEdits = edits[id];
          const payload: Record<string, string | number> = {};
          for (const [key, value] of Object.entries(rowEdits)) {
            if (value === undefined) continue;
            payload[key] = key === "status" || key === "name" ? value : Number(value);
          }
          return fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        })
      );

      const failures = responses.filter((r) => !r.ok).length;
      if (failures > 0) throw new Error(`${failures} product${failures > 1 ? "s" : ""} failed to save`);

      toast.success(`Saved changes to ${dirtyIds.length} product${dirtyIds.length > 1 ? "s" : ""}`);
      setEdits({});
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Edit any field directly in the table, then save all changes at once. Highlighted rows have unsaved edits.
        </p>
        <div className="flex gap-2">
          {dirtyIds.length > 0 && (
            <Button variant="outline" onClick={() => setEdits({})} disabled={saving}>
              <RotateCcw className="h-4 w-4" /> Discard
            </Button>
          )}
          <Button onClick={saveAll} disabled={dirtyIds.length === 0 || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save All Changes {dirtyIds.length > 0 && `(${dirtyIds.length})`}
          </Button>
          <ProductFormDialog
            collections={collections}
            trigger={
              <Button variant="outline">
                <Plus className="h-4 w-4" /> New Product
              </Button>
            }
          />
        </div>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Wholesale</TableHead>
              <TableHead>MSRP</TableHead>
              <TableHead>MOQ</TableHead>
              <TableHead>Pack</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => {
              const isDirty = Boolean(edits[p.id] && Object.keys(edits[p.id]).length > 0);
              return (
                <TableRow key={p.id} className={isDirty ? "bg-primary/5" : undefined}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/30">
                        {p.image_url && <Image src={p.image_url} alt={p.name} fill className="object-cover" />}
                      </div>
                      <Input
                        value={displayValue(p, "name")}
                        onChange={(e) => setField(p.id, "name", e.target.value)}
                        className="h-8 w-36 text-sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.collection?.name ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={displayValue(p, "wholesale_price")}
                        onChange={(e) => setField(p.id, "wholesale_price", e.target.value)}
                        className="h-8 w-20 text-sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={displayValue(p, "msrp")}
                        onChange={(e) => setField(p.id, "msrp", e.target.value)}
                        className="h-8 w-20 text-sm"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={displayValue(p, "moq")}
                      onChange={(e) => setField(p.id, "moq", e.target.value)}
                      className="h-8 w-16 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      value={displayValue(p, "pack_quantity")}
                      onChange={(e) => setField(p.id, "pack_quantity", e.target.value)}
                      className="h-8 w-16 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={displayValue(p, "inventory")}
                      onChange={(e) => setField(p.id, "inventory", e.target.value)}
                      className={`h-8 w-20 text-sm ${Number(displayValue(p, "inventory")) === 0 ? "text-destructive" : ""}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={displayValue(p, "status") as ProductStatus}
                      onValueChange={(v) => setField(p.id, "status", v)}
                    >
                      <SelectTrigger className="h-8 w-28 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <ProductFormDialog
                        product={p}
                        collections={collections}
                        trigger={
                          <Button size="icon" variant="outline" className="h-8 w-8" title="More fields (description, SKU, collection, images, badges)">
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
