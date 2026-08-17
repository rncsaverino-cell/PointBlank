import { DollarSign, ShoppingBag, TrendingUp, Users, Clock, Repeat } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllOrders, getRetailers, getRetailerApplications } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Analytics — Admin" };

export default async function AdminDashboardPage() {
  const [orders, retailers, applications] = await Promise.all([
    getAllOrders(),
    getRetailers(),
    getRetailerApplications(),
  ]);

  const realOrders = orders.filter((o) => o.status !== "draft");
  const revenue = realOrders.reduce((sum, o) => sum + o.total, 0);

  const now = new Date();
  const ordersThisMonth = orders.filter((o) => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const avgOrderValue = realOrders.length > 0 ? revenue / realOrders.length : 0;
  const approvedRetailers = retailers.filter((r) => r.retailer_status === "approved").length;
  const pendingApplications = applications.filter((a) => a.status === "pending").length;

  const ordersByRetailer = new Map<string, number>();
  for (const o of realOrders) {
    ordersByRetailer.set(o.retailer_id, (ordersByRetailer.get(o.retailer_id) ?? 0) + 1);
  }
  const retailersWithOrders = ordersByRetailer.size;
  const repeatRetailers = Array.from(ordersByRetailer.values()).filter((c) => c > 1).length;
  const repeatRate = retailersWithOrders > 0 ? Math.round((repeatRetailers / retailersWithOrders) * 100) : 0;

  const productTotals = new Map<string, { name: string; units: number; revenue: number }>();
  const collectionTotals = new Map<string, { name: string; units: number }>();
  for (const o of realOrders) {
    for (const item of o.items ?? []) {
      if (!item.product) continue;
      const existing = productTotals.get(item.product.id) ?? { name: item.product.name, units: 0, revenue: 0 };
      existing.units += item.quantity;
      existing.revenue += item.quantity * item.unit_price;
      productTotals.set(item.product.id, existing);

      const collectionName = item.product.collection?.name ?? "Uncategorized";
      const cExisting = collectionTotals.get(collectionName) ?? { name: collectionName, units: 0 };
      cExisting.units += item.quantity;
      collectionTotals.set(collectionName, cExisting);
    }
  }
  const topProducts = Array.from(productTotals.values()).sort((a, b) => b.units - a.units).slice(0, 5);
  const topCollections = Array.from(collectionTotals.values()).sort((a, b) => b.units - a.units).slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Wholesale performance across the PointBlank portal.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Wholesale Revenue" value={formatCurrency(revenue)} icon={DollarSign} />
        <StatCard label="Orders This Month" value={String(ordersThisMonth)} icon={ShoppingBag} />
        <StatCard label="Average Order Value" value={formatCurrency(avgOrderValue)} icon={TrendingUp} />
        <StatCard label="Approved Retailers" value={String(approvedRetailers)} icon={Users} />
        <StatCard label="Pending Applications" value={String(pendingApplications)} icon={Clock} />
        <StatCard label="Repeat-Order Rate" value={`${repeatRate}%`} icon={Repeat} trend="Retailers with 2+ orders" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.length === 0 && <p className="text-sm text-muted-foreground">No order data yet.</p>}
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                    {i + 1}
                  </span>
                  {p.name}
                </span>
                <span className="text-muted-foreground">{p.units} units · {formatCurrency(p.revenue)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCollections.length === 0 && <p className="text-sm text-muted-foreground">No order data yet.</p>}
            {topCollections.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                    {i + 1}
                  </span>
                  {c.name}
                </span>
                <span className="text-muted-foreground">{c.units} units</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
