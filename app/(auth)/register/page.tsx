"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, User, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const labelStyle = { color: "var(--fg-muted)" } as React.CSSProperties;
const iconStyle  = { color: "var(--fg-muted)" } as React.CSSProperties;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.currentTarget);
    const name     = form.get("name") as string;
    const email    = form.get("email") as string;
    const password = form.get("password") as string;
    const confirm  = form.get("confirm") as string;
    const role     = form.get("role") as string;

    if (password !== confirm) { setErrors({ confirm: "Passwords do not match" }); return; }

    setLoading(true);
    const res  = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setErrors({ form: data.error }); return; }
    toast.success("Account created! Please sign in.");
    router.push("/login");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10" style={{ background: "var(--bg)" }}>
      {/* Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(109,40,217,0.12)" }} />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(5,150,105,0.10)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl p-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-hover)" }}>

          {/* Logo */}
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-emerald-500" style={{ boxShadow: "0 0 24px rgba(109,40,217,0.35)" }}>
              <Zap size={24} className="text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>Create account</h1>
            <p className="mt-1.5 text-sm" style={{ color: "var(--fg-muted)" }}>Join EMS Pro and get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={iconStyle} />
                <Input name="name" placeholder="John Doe" required className="pl-10 h-11" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={iconStyle} />
                <Input name="email" type="email" placeholder="you@company.com" required className="pl-10 h-11" />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>Role</label>
              <select
                name="role"
                required
                className="w-full h-11 px-3.5 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-violet-500/30"
                style={{ background: "var(--input-bg)", color: "var(--fg)", border: "1px solid var(--border)" }}
              >
                <option value="employee_viewer">Employee Viewer — view only</option>
                <option value="hr_manager">HR Manager — manage employees</option>
                <option value="admin">Admin — full access</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={iconStyle} />
                <Input name="password" type="password" placeholder="Min. 8 characters" required minLength={8} className="pl-10 h-11" />
              </div>
            </div>

            {/* Confirm */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={labelStyle}>Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={iconStyle} />
                <Input name="confirm" type="password" placeholder="Repeat your password" required className="pl-10 h-11" />
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            {errors.form && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
                style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-500">{errors.form}</p>
              </motion.div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Account <ArrowRight size={16} /></span>
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: "var(--fg-muted)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: "var(--neon-purple)" }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
