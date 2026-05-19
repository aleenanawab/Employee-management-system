"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success("Reset link sent if the email exists");
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-500">Enter your email to receive a reset link</p>
        </div>
        {sent ? (
          <p className="rounded-lg bg-green-50 px-3 py-3 text-sm text-green-700 text-center dark:bg-green-900/20 dark:text-green-400">
            Check your email for the reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <Input name="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/login" className="text-purple-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
