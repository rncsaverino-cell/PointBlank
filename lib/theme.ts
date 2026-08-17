// Per-collection accent color, applied by scoping the CSS custom property
// that every `primary`-colored Tailwind class already reads from
// (see app/globals.css / tailwind.config.ts). Wrapping a subtree in one of
// these overrides badges, buttons, and glows on that page to match the
// collection's theme, without touching the site-wide red brand accent used
// everywhere else.
export const collectionThemes: Record<string, { primary: string; primaryForeground: string }> = {
  "wild-west": { primary: "16 82% 48%", primaryForeground: "0 0% 100%" },
  "zombie-apocalypse": { primary: "80 58% 42%", primaryForeground: "0 0% 100%" },
  "alien-invasion": { primary: "165 65% 42%", primaryForeground: "0 0% 100%" },
  "monster-hunt": { primary: "205 70% 45%", primaryForeground: "0 0% 100%" },
};

export function getCollectionTheme(slug: string | undefined) {
  if (!slug) return null;
  return collectionThemes[slug] ?? null;
}

export function collectionThemeStyle(slug: string | undefined): React.CSSProperties | undefined {
  const theme = getCollectionTheme(slug);
  if (!theme) return undefined;
  return {
    "--primary": theme.primary,
    "--primary-foreground": theme.primaryForeground,
    "--ring": theme.primary,
  } as React.CSSProperties;
}
