import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { getOrders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const profile = await getCurrentProfile();
  const orders = profile ? await getOrders(profile.id) : [];

  if (orders.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-6 font-display text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">Your submitted wholesale orders will show up here.</p>
        <Button asChild className="mt-6">
          <Link href="/shop">Start an Order</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>
        <Button asChild>
          <Link href="/shop">Start New Order</Link>
        </Button>
      </div>

      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0} units
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/orders/${order.id}`} className="text-sm font-semibold text-primary hover:underline">
                    View →
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
