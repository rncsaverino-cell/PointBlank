import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: {
    default: "PointBlank — Make Every Range Day Different.",
    template: "%s — PointBlank",
  },
  description:
    "PointBlank creates fresh, entertaining target designs built to make every range visit more memorable. Wholesale portal for approved retailers, gun ranges, and distributors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
