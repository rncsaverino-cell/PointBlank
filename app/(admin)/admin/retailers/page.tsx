import { RetailerTable } from "@/components/admin/retailer-table";
import { getRetailers } from "@/lib/data";

export const metadata = { title: "Retailers — Admin" };

export default async function AdminRetailersPage() {
  const retailers = await getRetailers();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Retailers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Review applications and manage retailer accounts.</p>

      <div className="mt-6">
        <RetailerTable retailers={retailers} />
      </div>
    </div>
  );
}
