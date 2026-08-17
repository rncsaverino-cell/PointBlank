import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata = { title: "Set New Password" };

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-[70vh] max-w-md flex-col justify-center py-20">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold">Set a New Password</h1>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
