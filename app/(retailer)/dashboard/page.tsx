import Link from "next/link";
import { Package, DollarSign, Clock, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/orders/status-badge";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnnouncementBanner } from "@/components/dashboard/announcement-banner";
import { ProductCard } from "@/components/product/product-card";
import { getCurrentProfile } from "@/lib/auth";
import { getOrders, getProducts } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const [orders, newReleases, bestSellers] = await Promise.all([
    profile ? getOrders(profile.id) : Promise.resolve([]),
    getProducts({ isNew: true, sort: "newest" }),
    getProducts({ isBestseller: true, sort: "bestselling" }),
  ]);

  const lifetimeSpend = orders.reduce((sum, o) => sum + o.total, 0);
  const openOrders = orders.filter((o) => o.status === "submitted" || o.status === "processing").length;

  const orderedProductIds = new Set(orders.flatMap((o) => o.items?.map((i) => i.product_id) ?? []));
  const recommended = bestSellers.filter((p) => orderedProductIds.has(p.id)).slice(0, 4);
  const recommendedFallback = recommended.length > 0 ? recommended : bestSellers.slice(0, 4);

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="font-display text-3xl font-bold">{profile?.business_name}</h1>
        </div>
        <Button asChild size="lg">
          <Link href="/shop">
            <Plus className="h-4 w-4" /> Start New Order
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Lifetime Orders" value={String(orders.length)} icon={Package} />
        <StatCard label="Lifetime Spend" value={formatCurrency(lifetimeSpend)} icon={DollarSign} />
        <StatCard label="Open Orders" value={String(openOrders)} icon={Clock} trend="Submitted or processing" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
            <Link href="/orders" className="text-sm font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No orders yet. Start your first wholesale order from the shop.
            </div>
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link href={`/orders/${order.id}`} className="font-medium hover:text-primary">
                          {order.order_number}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(order.created_at)}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Recommended Reorders</h2>
              <Link href="/reorder" className="text-sm font-semibold text-primary hover:underline">
                Reorder page →
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {recommendedFallback.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AnnouncementBanner />

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">New Releases</h3>
              <Link href="/new-releases" className="text-xs font-semibold text-primary hover:underline">
                See all
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {newReleases.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link href={`/shop/${p.slug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground">
                    {p.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Bestselling Designs</h3>
              <Link href="/best-sellers" className="text-xs font-semibold text-primary hover:underline">
                See all
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {bestSellers.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link href={`/shop/${p.slug}`} className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground">
                    {p.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
