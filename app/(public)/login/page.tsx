import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export const metadata = { title: "Retailer Login" };

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-20">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold">Retailer Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to access wholesale pricing and place orders.
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
