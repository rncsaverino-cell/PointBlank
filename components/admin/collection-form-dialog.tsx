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
import type { Collection } from "@/lib/types";
import { toast } from "sonner";

export function CollectionFormDialog({ collection, trigger }: { collection?: Collection; trigger: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(collection);

  const [form, setForm] = useState({
    name: collection?.name ?? "",
    subtitle: collection?.subtitle ?? "",
    description: collection?.description ?? "",
    hero_image: collection?.hero_image ?? "",
    active: collection?.active ?? true,
  });

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `/api/admin/collections/${collection!.id}` : "/api/admin/collections", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not save collection");
      toast.success(isEdit ? "Collection updated" : "Collection created");
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Collection" : "New Collection"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Hero Image URL</Label>
            <Input value={form.hero_image} onChange={(e) => setForm((p) => ({ ...p, hero_image: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="active" checked={form.active} onCheckedChange={(c) => setForm((p) => ({ ...p, active: c === true }))} />
            <Label htmlFor="active" className="cursor-pointer font-normal">Active (visible on storefront)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
