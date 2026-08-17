import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-20">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold">Reset Your Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your business email and we&apos;ll send you a reset link.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
