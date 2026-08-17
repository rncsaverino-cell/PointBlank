import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Application Pending" };

export default function AccountPendingPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-lg flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Clock className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold">Your Application Is Pending Approval</h1>
      <p className="mt-4 text-muted-foreground">
        Thanks for applying to become a PointBlank retailer. Our team is reviewing your business
        details — you&apos;ll get an email as soon as your account is approved for wholesale
        access, typically within 1-2 business days.
      </p>
      <Button asChild className="mt-8" variant="outline">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
