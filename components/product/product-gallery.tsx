"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [];

  return (
    <div>
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-black/25">
        {gallery[active] && (
          <Image
            src={gallery[active]}
            alt={name}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
      </div>
      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {gallery.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-secondary/20 transition-colors",
                active === i ? "border-primary" : "border-border hover:border-foreground/30"
              )}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
