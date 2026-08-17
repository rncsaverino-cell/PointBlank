"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const demoMode = !isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (demoMode) {
      await new Promise((r) => setTimeout(r, 500));
      await fetch("/api/demo-role", { method: "POST", body: JSON.stringify({ role: "retailer" }) });
      toast.success("Signed in (demo mode)");
      router.push(redirect);
      router.refresh();
      setLoading(false);
      return;
    }

    const supabase = createClient()!;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div>
      {demoMode && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm text-primary">
          Demo mode: Supabase isn&apos;t configured yet, so any credentials will sign you in as a
          sample approved retailer.{" "}
          <button
            type="button"
            className="font-semibold underline underline-offset-2"
            onClick={async () => {
              await fetch("/api/demo-role", { method: "POST", body: JSON.stringify({ role: "admin" }) });
              router.push("/admin");
              router.refresh();
            }}
          >
            Preview the admin portal instead →
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Business Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="orders@yourbusiness.com"
            required={!demoMode}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required={!demoMode}
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Not a retailer yet?{" "}
        <Link href="/apply" className="font-semibold text-foreground underline underline-offset-4">
          Apply for wholesale access
        </Link>
      </p>
    </div>
  );
}
