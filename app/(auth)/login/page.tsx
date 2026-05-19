"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) return setError("Invalid email or password. Please try again.");
    router.push("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4" style={{ background: "var(--bg)" }}>
      {/* Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(109,40,217,0.12)" }} />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(5,150,105,0.10)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)" }}>

          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-500 shadow-xl" style={{ boxShadow: "0 0 24px rgba(109,40,217,0.35)" }}>
              <Zap size={24} className="text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>Welcome back</h1>
            <p className="mt-1.5 text-sm" style={{ color: "var(--fg-muted)" }}>Sign in to your EMS Pro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
                <Input name="email" type="email" placeholder="you@company.com" required className="pl-10 h-11" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--fg-muted)" }}>Password</label>
                <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: "var(--neon-purple)" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
                <Input name="password" type="password" placeholder="••••••••••" required className="pl-10 h-11" />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight size={16} /></span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "var(--fg-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "var(--neon-purple)" }}>
              Create one free
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "var(--fg-muted)", opacity: 0.6 }}>
          Protected by enterprise-grade security
        </p>
      </motion.div>
    </div>
  );
}
