import { Star, Biohazard, Eye, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom flying-saucer glyph — lucide-react has no UFO icon, so this is
// hand-drawn to match lucide's stroke style (24x24, strokeWidth 2, round
// caps) so it sits naturally next to the other theme icons.
function UfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 12c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <ellipse cx="12" cy="12" rx="10" ry="3" />
      <path d="M9 16l-1 3.5M15 16l1 3.5M12 16.5V20" />
    </svg>
  );
}

// Larger decorative saucer + glow + tractor beam, used only on the Alien
// Invasion backdrop. Floats slowly; the beam pulses. Pure CSS/SVG, no
// external assets.
function UfoIllustration() {
  return (
    <div className="absolute right-[6%] top-8 hidden animate-float sm:block">
      <svg width="180" height="100" viewBox="0 0 180 100" fill="none">
        <defs>
          <radialGradient id="ufo-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ufo-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse cx="90" cy="38" rx="75" ry="42" fill="url(#ufo-glow)" opacity="0.35" />
        <polygon points="66,44 114,44 148,100 32,100" fill="url(#ufo-beam)" className="animate-beam-pulse" />

        <path
          d="M65 34c0-14.4 11.2-26 25-26s25 11.6 25 26"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          fill="hsl(var(--card))"
        />
        <ellipse cx="90" cy="44" rx="62" ry="13" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2.5" />

        <circle cx="52" cy="44" r="3" fill="hsl(var(--primary))" />
        <circle cx="90" cy="47" r="3" fill="hsl(var(--primary))" />
        <circle cx="128" cy="44" r="3" fill="hsl(var(--primary))" />
      </svg>
    </div>
  );
}

// Decorative sheriff star for the Wild West backdrop — glows and rotates
// slowly, mirroring the UFO's "one big floating motif" role on that page.
function StarBadgeIllustration() {
  return (
    <div className="absolute right-[7%] top-6 hidden animate-float sm:block">
      <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <defs>
          <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="65" fill="url(#star-glow)" opacity="0.4" />
        <g className="origin-center animate-[spin_22s_linear_infinite]">
          <path
            d="M70,20 L81.8,53.8 L117.6,54.6 L89,76.2 L99.4,110.5 L70,90 L40.6,110.5 L51,76.2 L22.5,54.6 L58.2,53.8 Z"
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="[filter:drop-shadow(0_0_8px_hsl(var(--primary)/0.6))]"
          />
          <circle cx="70" cy="70" r="7" fill="hsl(var(--primary))" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

// Decorative rescue helicopter + sweeping spotlight for the Zombie
// Apocalypse backdrop — the "evacuating the quarantine zone" counterpart
// to the alien saucer.
function HelicopterIllustration() {
  return (
    <div className="absolute right-[8%] top-4 hidden animate-float sm:block">
      <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
        <defs>
          <linearGradient id="heli-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon points="72,50 108,50 138,110 42,110" fill="url(#heli-beam)" className="animate-beam-pulse" />

        <ellipse cx="90" cy="20" rx="58" ry="2.5" fill="hsl(var(--primary))" opacity="0.85" />
        <rect x="86" y="12" width="8" height="11" rx="1.5" fill="hsl(var(--primary))" />

        <path d="M62 44 L18 33" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="25" x2="16" y2="41" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />

        <ellipse cx="92" cy="44" rx="37" ry="17" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2.5" />
        <circle cx="111" cy="42" r="7" fill="hsl(var(--primary))" opacity="0.5" />

        <path
          d="M66 58 L118 58 M71 58 L71 65 M113 58 L113 65"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Decorative glowing eyes in the fog for the Hunting Grounds backdrop — the
// "something in the dark forest is watching you" counterpart to the other
// worlds' floating motifs. Slit pupils are cut from the eye shape with a
// background-colored ellipse so it works over any photo behind it.
function EyesIllustration() {
  return (
    <div className="absolute right-[9%] top-10 hidden animate-float sm:block">
      <svg width="160" height="90" viewBox="0 0 160 90" fill="none">
        <defs>
          <radialGradient id="eyes-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="80" cy="45" rx="80" ry="45" fill="url(#eyes-glow)" opacity="0.35" />
        <g className="animate-beam-pulse">
          <ellipse cx="55" cy="45" rx="10" ry="6.5" fill="hsl(var(--primary))" className="[filter:drop-shadow(0_0_8px_hsl(var(--primary)/0.7))]" />
          <ellipse cx="105" cy="45" rx="10" ry="6.5" fill="hsl(var(--primary))" className="[filter:drop-shadow(0_0_8px_hsl(var(--primary)/0.7))]" />
          <ellipse cx="55" cy="45" rx="3" ry="6.5" fill="hsl(var(--background))" />
          <ellipse cx="105" cy="45" rx="3" ry="6.5" fill="hsl(var(--background))" />
        </g>
      </svg>
    </div>
  );
}

// Claw-mark slashes for the Hunting Grounds frame corner.
function ClawMarks({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("pointer-events-none absolute h-20 w-20 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.6))]", className)}
    >
      <g stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" opacity="0.85">
        <path d="M12 18 L38 88" />
        <path d="M32 8 L58 92" />
        <path d="M52 2 L78 82" />
      </g>
    </svg>
  );
}

// Decorative smoking volcano for the Dino Rampage backdrop — a glowing
// lava crater with drifting smoke, the "ancient world" counterpart to the
// other worlds' floating motifs.
function VolcanoIllustration() {
  return (
    <div className="absolute right-[8%] top-4 hidden animate-float sm:block">
      <svg width="170" height="120" viewBox="0 0 170 120" fill="none">
        <defs>
          <radialGradient id="volcano-glow" cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.75" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="85" cy="58" rx="80" ry="55" fill="url(#volcano-glow)" opacity="0.3" />
        <g className="animate-beam-pulse" opacity="0.45">
          <ellipse cx="85" cy="32" rx="16" ry="11" fill="hsl(var(--muted-foreground))" />
          <ellipse cx="76" cy="16" rx="20" ry="13" fill="hsl(var(--muted-foreground))" />
          <ellipse cx="92" cy="2" rx="24" ry="14" fill="hsl(var(--muted-foreground))" />
        </g>
        <path
          d="M18 112 L85 38 L152 112 Z"
          fill="hsl(var(--card))"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M71 56 L85 38 L99 56 Z"
          fill="hsl(var(--primary))"
          className="[filter:drop-shadow(0_0_10px_hsl(var(--primary)/0.8))]"
        />
      </svg>
    </div>
  );
}

// Bite-mark puncture arc for the Dino Rampage frame corner.
function BiteMarks({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      className={cn("pointer-events-none absolute h-14 w-28 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.6))]", className)}
    >
      <g fill="hsl(var(--primary))" opacity="0.85">
        <path d="M10 40 L16 18 L22 40 Z" />
        <path d="M28 45 L34 21 L40 45 Z" />
        <path d="M46 48 L52 23 L58 48 Z" />
        <path d="M64 48 L70 23 L76 48 Z" />
        <path d="M82 45 L88 21 L94 45 Z" />
        <path d="M100 40 L106 18 L112 40 Z" />
      </g>
    </svg>
  );
}

// Worn "photo tape" corner mark for the Wild West frame — opaque cream tape
// so it reads clearly as physical tape regardless of what photo is behind it.
function TapeCorner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute h-8 w-20 border border-black/15 bg-[#ded0ac] shadow-[0_2px_6px_rgba(0,0,0,0.4)]",
        className
      )}
      style={{ opacity: 0.92 }}
    />
  );
}

// Bullet-hole decal for the Wild West frame — bold white ring + dark core so
// it stays legible over both bright and dark parts of the photo.
function BulletHole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("pointer-events-none absolute h-8 w-8 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.6))]", className)}>
      <circle cx="16" cy="16" r="9" fill="black" opacity="0.55" />
      <circle cx="16" cy="16" r="5" fill="black" />
      <g stroke="white" strokeWidth="1.5" opacity="0.85" strokeLinecap="round">
        <path d="M16 3v6M16 23v6M3 16h6M23 16h6" />
        <path d="M7 7l4.5 4.5M25 7l-4.5 4.5M7 25l4.5-4.5M25 25l-4.5-4.5" />
      </g>
    </svg>
  );
}

const themeConfig = {
  "wild-west": { icon: Star, label: "Frontier Territory", texture: "dust" as const },
  "zombie-apocalypse": { icon: Biohazard, label: "Quarantine Zone", texture: "grime" as const },
  "alien-invasion": { icon: UfoIcon, label: "Restricted Sector", texture: "grid" as const },
  "monster-hunt": { icon: Eye, label: "Hunter's Path", texture: "fog" as const },
  "dino-rampage": { icon: Flame, label: "Extinction Zone", texture: "ash" as const },
};

type ThemeSlug = keyof typeof themeConfig;

function isThemed(slug?: string): slug is ThemeSlug {
  return Boolean(slug && slug in themeConfig);
}

// Full-bleed decorative backdrop for a themed page — a colored glow plus a
// texture layer (dust/grime noise, or a sci-fi grid) that fades out toward
// the bottom so it reads as atmosphere, not noise. Each world also gets one
// large floating motif: a saucer (Alien), a sheriff star (Wild West), or a
// rescue helicopter (Zombie).
export function ThemeBackdrop({ slug }: { slug?: string }) {
  if (!isThemed(slug)) return null;
  const { texture } = themeConfig[slug];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.22),transparent_65%)]" />
      {texture === "grid" && (
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      )}
      {(texture === "dust" || texture === "grime" || texture === "fog" || texture === "ash") && (
        <div className="bg-noise absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      )}
      {slug === "alien-invasion" && <UfoIllustration />}
      {slug === "wild-west" && <StarBadgeIllustration />}
      {slug === "zombie-apocalypse" && <HelicopterIllustration />}
      {slug === "monster-hunt" && <EyesIllustration />}
      {slug === "dino-rampage" && <VolcanoIllustration />}
    </div>
  );
}

// Small eyebrow badge (icon + world label) shown above the collection name.
export function ThemeEyebrow({ slug, className }: { slug?: string; className?: string }) {
  if (!isThemed(slug)) return null;
  const { icon: Icon, label } = themeConfig[slug];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}

// Wraps the product image with a per-theme decorative frame: HUD corner
// brackets for Alien Invasion, a dripping hazard-stripe bar for Zombie
// Apocalypse, and taped photo corners + bullet holes for Wild West.
// Purely decorative, absolutely positioned over the children.
export function ThemedFrame({
  slug,
  children,
  className,
}: {
  slug?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const theme = isThemed(slug) ? slug : null;

  return (
    <div className={cn("relative rounded-2xl", className)}>
      {children}

      {theme === "alien-invasion" && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-primary/25" />
          <span className="pointer-events-none absolute left-0 top-0 h-9 w-9 border-l-[3px] border-t-[3px] border-primary [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.7))]" />
          <span className="pointer-events-none absolute right-0 top-0 h-9 w-9 border-r-[3px] border-t-[3px] border-primary [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.7))]" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-9 w-9 border-b-[3px] border-l-[3px] border-primary [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.7))]" />
          <span className="pointer-events-none absolute bottom-0 right-0 h-9 w-9 border-b-[3px] border-r-[3px] border-primary [filter:drop-shadow(0_0_6px_hsl(var(--primary)/0.7))]" />
        </>
      )}

      {theme === "zombie-apocalypse" && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-primary/30" />
      )}

      {theme === "wild-west" && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_70px_hsl(var(--primary)/0.25)] ring-1 ring-primary/20" />
          <TapeCorner className="-top-2 left-6 -rotate-6" />
          <TapeCorner className="-top-2 right-6 rotate-6" />
          <BulletHole className="bottom-10 left-5" />
          <BulletHole className="bottom-24 right-8" />
        </>
      )}

      {theme === "monster-hunt" && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_70px_hsl(var(--primary)/0.25)] ring-1 ring-primary/20" />
          <ClawMarks className="right-2 top-2 rotate-6" />
        </>
      )}

      {theme === "dino-rampage" && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_70px_hsl(var(--primary)/0.25)] ring-1 ring-primary/20" />
          <BiteMarks className="left-1/2 top-0 -translate-x-1/2 -translate-y-2 rotate-180" />
        </>
      )}
    </div>
  );
}
