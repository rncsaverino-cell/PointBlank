/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    // placehold.co (used for placeholder product/collection art) serves SVG,
    // and this dev sandbox's server process can't reach the internet to run
    // them through Next's image-optimization proxy. `unoptimized` makes
    // next/image behave like a plain <img> so the browser fetches directly.
    // Once real product photography is hosted (e.g. Supabase Storage or a
    // CDN), remove this to get real-time image optimization back.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
