"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, LayoutDashboard, Users, Package, Layers, ClipboardList, Store, Target } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/retailers", label: "Retailers", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export function AdminMobileHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
      <Logo href="/admin" />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="max-w-xs">
          <div className="flex flex-col gap-1 p-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-foreground/90 hover:bg-secondary/60"
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-md border-t border-border px-3 py-3 pt-4 text-base font-medium text-foreground/90 hover:bg-secondary/60"
            >
              <Store className="h-4 w-4" /> Retailer View
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
