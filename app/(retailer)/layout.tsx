import { RetailerHeader } from "@/components/layout/retailer-header";
import { getCurrentProfile, isDemoMode } from "@/lib/auth";

export default async function RetailerLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  const demoMode = isDemoMode();

  return (
    <div className="flex min-h-screen flex-col">
      <RetailerHeader profile={profile} demoMode={demoMode} />
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}
