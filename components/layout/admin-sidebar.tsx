"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  ClipboardList,
  LogOut,
  Store,
  Target,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard, exact: true },
  { href: "/admin/retailers", label: "Retailers", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
      <div className="flex h-20 items-center border-b border-border px-6">
        <Logo href="/admin" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <span className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Admin Portal
        </span>
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
                active && "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}

        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
          >
            <Store className="h-4 w-4" /> Retailer View
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-secondary/60"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
