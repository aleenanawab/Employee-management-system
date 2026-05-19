"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Bell, Shield } from "lucide-react";
import { toast } from "sonner";

const card: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.5rem", boxShadow: "var(--shadow-card)" };

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
      style={{ background: on ? "linear-gradient(135deg, #6d28d9, #059669)" : "var(--border)" }}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({ email: true, browser: false, salary: true });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Settings</h1>

      {/* Appearance */}
      <div style={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-xl p-2" style={{ background: "var(--primary-light)" }}>
            {theme === "dark" ? <Moon size={18} style={{ color: "var(--primary-text)" }} /> : <Sun size={18} style={{ color: "var(--primary-text)" }} />}
          </div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium" style={{ color: "var(--fg)" }}>Theme</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>Currently using {theme} mode</p>
          </div>
          <Toggle on={theme === "dark"} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-xl p-2" style={{ background: "rgba(37,99,235,0.1)" }}>
            <Bell size={18} style={{ color: "#2563eb" }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: "email",   label: "Email Notifications",  desc: "Receive updates via email" },
            { key: "browser", label: "Browser Notifications", desc: "Show desktop notifications" },
            { key: "salary",  label: "Salary Alerts",         desc: "Notify when salary is processed" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: "var(--fg)" }}>{label}</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>{desc}</p>
              </div>
              <Toggle on={notifications[key as keyof typeof notifications]} onToggle={() => setNotifications((n) => ({ ...n, [key]: !n[key as keyof typeof n] }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div style={card}>
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-xl p-2" style={{ background: "rgba(5,150,105,0.1)" }}>
            <Shield size={18} style={{ color: "#059669" }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: "var(--fg)" }}>Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <p className="font-medium" style={{ color: "var(--fg)" }}>Two-Factor Authentication</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>Add an extra layer of security</p>
            </div>
            <span className="text-xs rounded-full px-2.5 py-1" style={{ background: "var(--input-bg)", color: "var(--fg-muted)", border: "1px solid var(--border)" }}>Coming soon</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium" style={{ color: "var(--fg)" }}>Session Timeout</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>Auto logout after 30 days</p>
            </div>
            <span className="text-sm font-semibold" style={{ color: "var(--neon-purple)" }}>30 days</span>
          </div>
        </div>
      </div>

      <Button onClick={() => toast.success("Settings saved")}>Save Settings</Button>
    </motion.div>
  );
}
