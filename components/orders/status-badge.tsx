import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const statusStyles: Record<OrderStatus, string> = {
  draft: "bg-secondary text-muted-foreground border-border",
  submitted: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  processing: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  shipped: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  delivered: "bg-success/10 text-success border-success/30",
};

const statusLabels: Record<OrderStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
