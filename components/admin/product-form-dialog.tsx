"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Collection, Product } from "@/lib/types";
import { toast } from "sonner";

export function ProductFormDialog({
  product,
  collections,
  trigger,
}: {
  product?: Product;
  collections: Collection[];
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    collection_id: product?.collection_id ?? collections[0]?.id ?? "",
    description: product?.description ?? "",
    wholesale_price: product?.wholesale_price ?? 0,
    msrp: product?.msrp ?? 0,
    moq: product?.moq ?? 25,
    pack_quantity: product?.pack_quantity ?? 25,
    dimensions: product?.dimensions ?? "18 x 24 in",
    paper_spec: product?.paper_spec ?? "24lb high-visibility target paper, matte finish",
    inventory: product?.inventory ?? 0,
    image_url: product?.image_url ?? "",
    status: product?.status ?? "active",
    is_new: product?.is_new ?? false,
    is_bestseller: product?.is_bestseller ?? false,
    is_limited: product?.is_limited ?? false,
    is_range_favorite: product?.is_range_favorite ?? false,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not save product");
      toast.success(isEdit ? "Product updated" : "Product created");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Product Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>SKU</Label>
            <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Collection</Label>
            <Select value={form.collection_id} onValueChange={(v) => set("collection_id", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Wholesale Price ($)</Label>
            <Input type="number" step="0.01" value={form.wholesale_price} onChange={(e) => set("wholesale_price", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>MSRP ($)</Label>
            <Input type="number" step="0.01" value={form.msrp} onChange={(e) => set("msrp", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Minimum Order Qty</Label>
            <Input type="number" value={form.moq} onChange={(e) => set("moq", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Pack Quantity</Label>
            <Input type="number" value={form.pack_quantity} onChange={(e) => set("pack_quantity", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Dimensions</Label>
            <Input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Inventory</Label>
            <Input type="number" value={form.inventory} onChange={(e) => set("inventory", Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Paper Spec</Label>
            <Input value={form.paper_spec} onChange={(e) => set("paper_spec", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Image URL</Label>
            <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as typeof form.status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-secondary/20 p-4 sm:grid-cols-4">
          {([
            ["is_new", "New"],
            ["is_bestseller", "Bestseller"],
            ["is_limited", "Limited"],
            ["is_range_favorite", "Range Favorite"],
          ] as const).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox id={key} checked={form[key]} onCheckedChange={(c) => set(key, c === true)} />
              <Label htmlFor={key} className="cursor-pointer font-normal">{label}</Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
