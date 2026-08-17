import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile, isDemoMode } from "@/lib/auth";
import { businessTypes } from "@/lib/validations";

export const metadata = { title: "Account" };

const statusVariant = {
  approved: "success",
  pending: "warning",
  rejected: "muted",
  suspended: "muted",
} as const;

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  const demoMode = isDemoMode();
  const businessTypeLabel = businessTypes.find((t) => t.value === profile?.business_type)?.label;

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="font-display text-3xl font-bold">Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {demoMode ? "Demo profile — connect Supabase to manage a real account." : "Your business and contact information."}
      </p>

      <Card className="mt-8">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>{profile?.business_name}</CardTitle>
          <Badge variant={statusVariant[profile?.retailer_status ?? "pending"]}>
            {profile?.role === "admin" ? "Administrator" : `${profile?.retailer_status} Retailer`}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Contact Name" value={`${profile?.contact_first_name ?? ""} ${profile?.contact_last_name ?? ""}`} />
          <Field label="Business Email" value={profile?.email} />
          <Field label="Phone" value={profile?.phone ?? "—"} />
          <Field label="Business Type" value={businessTypeLabel ?? "—"} />
          <Field label="Tax / Resale Number" value={profile?.resale_number ?? "—"} />
          <Field label="Pricing Tier" value={profile?.pricing_tier ?? "standard"} />
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        Need to update your business information? Contact{" "}
        <a href="mailto:wholesale@pointblanktargets.com" className="text-primary underline underline-offset-4">
          wholesale@pointblanktargets.com
        </a>
        .
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value || "—"}</p>
    </div>
  );
}
