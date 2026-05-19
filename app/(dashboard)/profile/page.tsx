"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const card: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem", boxShadow: "var(--shadow-card)" };

export default function ProfilePage() {
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: session?.user?.name ?? "", email: session?.user?.email ?? "", currentPassword: "", newPassword: "", confirmPassword: "" });

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated");
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    toast.success("Password changed");
  }

  const role = (session?.user as { role?: string })?.role ?? "employee_viewer";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Profile</h1>

      {/* Avatar card */}
      <div style={card}>
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg, #6d28d9, #059669)" }}>
              {getInitials(session?.user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>{session?.user?.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>{session?.user?.email}</p>
            <span className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "var(--primary-light)", color: "var(--primary-text)" }}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div style={card}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--fg)" }}>Personal Information</h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Full Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>Email</label>
            <Input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </form>
      </div>

      {/* Change Password */}
      <div style={card}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--fg)" }}>Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { label: "Current Password", key: "currentPassword" },
            { label: "New Password",     key: "newPassword" },
            { label: "Confirm Password", key: "confirmPassword" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--fg)" }}>{label}</label>
              <Input type="password" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required minLength={key === "newPassword" ? 8 : undefined} />
            </div>
          ))}
          <Button type="submit" disabled={saving}>{saving ? "Updating..." : "Update Password"}</Button>
        </form>
      </div>
    </motion.div>
  );
}
