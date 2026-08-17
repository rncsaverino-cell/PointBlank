"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Profile } from "@/lib/types";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/new-releases", label: "New Releases" },
  { href: "/best-sellers", label: "Best Sellers" },
  { href: "/orders", label: "Orders" },
  { href: "/reorder", label: "Reorder" },
  { href: "/downloads", label: "Resources" },
];

export function RetailerHeader({ profile, demoMode }: { profile: Profile | null; demoMode: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  async function switchDemoRole(role: "retailer" | "admin") {
    await fetch("/api/demo-role", { method: "POST", body: JSON.stringify({ role }) });
    router.push(role === "admin" ? "/admin" : "/dashboard");
    router.refresh();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      {demoMode && (
        <div className="flex items-center justify-center gap-3 bg-primary/10 px-4 py-2 text-xs text-primary">
          <span>
            Demo mode — viewing as <strong>{profile?.role === "admin" ? "Administrator" : "Approved Retailer"}</strong>.
            Connect Supabase for real accounts.
          </span>
          <button
            onClick={() => switchDemoRole(profile?.role === "admin" ? "retailer" : "admin")}
            className="font-semibold underline underline-offset-2"
          >
            Switch to {profile?.role === "admin" ? "Retailer" : "Admin"} view
          </button>
        </div>
      )}
      <div className="container flex h-18 items-center justify-between py-3">
        <div className="flex items-center gap-8">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-6 xl:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.href && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden items-center gap-2 sm:flex">
                <User className="h-4 w-4" />
                <span className="max-w-[140px] truncate text-sm">{profile?.business_name ?? "Account"}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{profile?.business_name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account">Account</Link>
              </DropdownMenuItem>
              {profile?.role === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="h-4 w-4" /> Admin Portal
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="xl:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="max-w-xs">
              <div className="flex flex-col gap-1 p-6">
                <div className="mb-6">
                  <Logo />
                </div>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base font-medium text-foreground/90 hover:bg-secondary/60"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-border pt-2">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-base font-medium text-foreground/90 hover:bg-secondary/60"
                  >
                    Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full rounded-md px-3 py-3 text-left text-base font-medium text-destructive hover:bg-secondary/60"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
