import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "Wholesale",
    links: [
      { href: "/wholesale", label: "How It Works" },
      { href: "/login", label: "Retailer Login" },
      { href: "/apply", label: "Become a Retailer" },
      { href: "/about", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">Fresh targets. Better range days.</p>
            <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground/70">
              For authorized retailers and shooting-sports businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:gap-20">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-sm font-semibold text-foreground">{col.title}</h4>
                <ul className="mt-4 flex flex-col gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PointBlank Targets, Inc. All rights reserved.</p>
          <p>Wholesale portal — not a direct-to-consumer store.</p>
        </div>
      </div>
    </footer>
  );
}
