import { PackageOpen } from "lucide-react";
import { ReorderClient } from "@/components/orders/reorder-client";
import { getCurrentProfile } from "@/lib/auth";
import { getOrders } from "@/lib/data";

export const metadata = { title: "Reorder" };

export default async function ReorderPage() {
  const profile = await getCurrentProfile();
  const orders = profile ? await getOrders(profile.id) : [];

  if (orders.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
        <PackageOpen className="h-12 w-12 text-muted-foreground" />
        <h1 className="mt-6 font-display text-2xl font-bold">Nothing to reorder yet</h1>
        <p className="mt-2 text-muted-foreground">Once you place your first order, you&apos;ll be able to reorder it here in one click.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold">Reorder</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Quickly reorder products you&apos;ve purchased before.
      </p>

      <div className="mt-8">
        <ReorderClient orders={orders} />
      </div>
    </div>
  );
}
