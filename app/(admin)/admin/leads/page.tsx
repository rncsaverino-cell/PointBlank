import { LeadTable } from "@/components/admin/lead-table";
import { getLeads } from "@/lib/data";

export const metadata = { title: "Leads — Admin" };

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Prospective ranges, retailers, and distributors to reach out to about carrying PointBlank targets.
      </p>

      <div className="mt-6">
        <LeadTable leads={leads} />
      </div>
    </div>
  );
}
