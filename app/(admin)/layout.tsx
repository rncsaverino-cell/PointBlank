import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileHeader } from "@/components/layout/admin-mobile-header";
import { isDemoMode } from "@/lib/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const demoMode = isDemoMode();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminMobileHeader />
        {demoMode && (
          <div className="bg-primary/10 px-4 py-2 text-center text-xs text-primary sm:px-8">
            Demo mode — Admin Portal preview using sample data. Connect Supabase to manage real data.
          </div>
        )}
        <main className="flex-1 bg-background p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
