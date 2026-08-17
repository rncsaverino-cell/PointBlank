import { CollectionTable } from "@/components/admin/collection-table";
import { getAllCollectionsAdmin } from "@/lib/data";

export const metadata = { title: "Collections — Admin" };

export default async function AdminCollectionsPage() {
  const collections = await getAllCollectionsAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Collections</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create, edit, and reorder storefront collections.</p>

      <div className="mt-6">
        <CollectionTable collections={collections} />
      </div>
    </div>
  );
}
