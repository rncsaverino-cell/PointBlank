"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  retailerApplicationSchema,
  type RetailerApplicationInput,
  businessTypes,
} from "@/lib/validations";
import { toast } from "sonner";

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function RetailerApplicationForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RetailerApplicationInput>({
    resolver: zodResolver(retailerApplicationSchema),
    defaultValues: { country: "United States" },
  });

  async function onSubmit(data: RetailerApplicationInput) {
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit application");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold">Application Submitted</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thanks for applying. Your account status is <strong>Pending Approval</strong> — our
          team typically reviews applications within 1-2 business days. You&apos;ll get an email
          once you&apos;re approved for wholesale access.
        </p>
        <Button className="mt-8" onClick={() => router.push("/login")}>
          Go to Retailer Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold">Business Information</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Business Name" error={errors.businessName?.message}>
            <Input {...register("businessName")} placeholder="Iron Sights Range & Supply" />
          </Field>
          <Field label="Business Website" error={errors.website?.message} hint="Optional">
            <Input {...register("website")} placeholder="https://" />
          </Field>
          <Field label="Contact First Name" error={errors.contactFirstName?.message}>
            <Input {...register("contactFirstName")} placeholder="Dana" />
          </Field>
          <Field label="Contact Last Name" error={errors.contactLastName?.message}>
            <Input {...register("contactLastName")} placeholder="Whitfield" />
          </Field>
          <Field label="Business Email" error={errors.businessEmail?.message}>
            <Input {...register("businessEmail")} type="email" placeholder="orders@yourbusiness.com" />
          </Field>
          <Field label="Phone Number" error={errors.phone?.message}>
            <Input {...register("phone")} type="tel" placeholder="(555) 210-4471" />
          </Field>
          <Field label="Business Type" error={errors.businessType?.message}>
            <Select onValueChange={(v) => setValue("businessType", v as RetailerApplicationInput["businessType"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold">Business Address</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Street Address" error={errors.address?.message}>
              <Input {...register("address")} placeholder="1420 Range Rd" />
            </Field>
          </div>
          <Field label="City" error={errors.city?.message}>
            <Input {...register("city")} placeholder="Austin" />
          </Field>
          <Field label="State / Province" error={errors.state?.message}>
            <Input {...register("state")} placeholder="TX" />
          </Field>
          <Field label="Postal / ZIP Code" error={errors.postalCode?.message}>
            <Input {...register("postalCode")} placeholder="78701" />
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <Input {...register("country")} placeholder="United States" />
          </Field>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold">Create Your Account</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Password" error={errors.password?.message}>
            <Input {...register("password")} type="password" placeholder="••••••••" />
          </Field>
          <Field label="Confirm Password" error={errors.confirmPassword?.message}>
            <Input {...register("confirmPassword")} type="password" placeholder="••••••••" />
          </Field>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4">
        <Checkbox
          id="confirmLegitimate"
          checked={watch("confirmLegitimate") === true}
          onCheckedChange={(checked) => setValue("confirmLegitimate", (checked === true) as true)}
        />
        <div>
          <Label htmlFor="confirmLegitimate" className="cursor-pointer font-normal">
            I confirm that I am applying on behalf of a legitimate business.
          </Label>
          {errors.confirmLegitimate && (
            <p className="mt-1 text-xs text-destructive">{errors.confirmLegitimate.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit Application
      </Button>
    </form>
  );
}
