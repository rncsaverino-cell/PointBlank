import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-xl font-extrabold tracking-tight text-foreground transition-opacity hover:opacity-80",
        className
      )}
    >
      POINT<span className="text-primary">BLANK</span>
    </Link>
  );
}
