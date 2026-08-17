"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Truck } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { toast } from "sonner";

const statuses: OrderStatus[] = ["draft", "submitted", "processing", "shipped", "delivered"];

export function OrderStatusControl({ order, compact }: { order: Order; compact?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.tracking_number ?? "");
  const [loading, setLoading] = useState(false);

  async function save(next?: { status?: OrderStatus; tracking_number?: string }) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next ?? { status, tracking_number: tracking }),
      });
      if (!res.ok) throw new Error("Could not update order");
      toast.success("Order updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <Select
        value={status}
        onValueChange={(v) => {
          setStatus(v as OrderStatus);
          save({ status: v as OrderStatus });
        }}
      >
        <SelectTrigger className="h-8 w-32 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((s) => (
            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</label>
        <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tracking Number</label>
        <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="1Z999AA10123456784" className="w-56" />
      </div>
      <Button onClick={() => save()} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
        Update Order
      </Button>
    </div>
  );
}
