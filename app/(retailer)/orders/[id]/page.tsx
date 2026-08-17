import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, ArrowLeft } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { getOrder } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  return (
    <div className="container max-w-3xl py-10">
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Order {order.order_number}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed {formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm" />
      </div>

      {order.tracking_number && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-secondary/20 p-4">
          <Truck className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Tracking Number</p>
            <p className="text-sm text-muted-foreground">{order.tracking_number}</p>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-border">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/30">
              {item.product?.image_url && (
                <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">{item.product?.name}</p>
              <p className="text-xs text-muted-foreground">SKU {item.product?.sku} · Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold">{formatCurrency(item.quantity * item.unit_price)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span>{formatCurrency(order.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-display text-base font-bold">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
