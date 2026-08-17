"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  step = 1,
  min = 1,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex h-11 items-center rounded-md border border-input bg-secondary/40", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const next = parseInt(e.target.value, 10);
          onChange(Number.isNaN(next) ? min : Math.max(min, next));
        }}
        className="h-full w-14 flex-1 bg-transparent text-center text-sm font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + step)}
        className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
