import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { getAllOrders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Orders — Admin" };

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{orders.length} wholesale orders</p>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Retailer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell className="text-muted-foreground">{order.retailer?.business_name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <OrderStatusControl order={order} compact />
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order.id}`} className="text-sm font-semibold text-primary hover:underline">
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
