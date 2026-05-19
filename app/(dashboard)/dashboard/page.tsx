"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Users, Building2, DollarSign, UserPlus } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types";
import { toast } from "sonner";

const CHART_COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const card: React.CSSProperties = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "1rem",
  padding: "1.25rem",
  boxShadow: "var(--shadow-card)",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => toast.error("Failed to load dashboard statistics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-7 w-36 rounded-xl" />
          <Skeleton className="h-4 w-56 rounded-lg" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    { title: "Total Employees",  value: stats?.totalEmployees ?? 0,                                    icon: <Users size={18} />,    color: "purple" as const },
    { title: "Departments",      value: stats?.totalDepartments ?? 0,                                  icon: <Building2 size={18} />, color: "green"  as const },
    { title: "Monthly Payroll",  value: `$${((stats?.monthlySalary ?? 0) / 1000).toFixed(1)}k`,        icon: <DollarSign size={18} />,color: "blue"   as const },
    { title: "New This Month",   value: stats?.newEmployees ?? 0,                                      icon: <UserPlus size={18} />,  color: "yellow" as const },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--fg)" }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>
            Welcome back — here&apos;s what&apos;s happening today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--fg-muted)" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live data
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => <StatsCard key={i} {...stat} index={i} />)}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">

        {/* Area Chart */}
        <div className="lg:col-span-2" style={card}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Employee Growth</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>Last 6 months</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={stats?.employeeGrowth ?? []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--fg-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--fg-muted)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--fg)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="employees" stroke="#7C3AED" strokeWidth={2.5}
                fill="url(#empGrad)" dot={{ fill: "#7C3AED", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={card}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>By Department</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>Headcount distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={stats?.departmentDistribution ?? []} cx="50%" cy="50%"
                innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {(stats?.departmentDistribution ?? []).map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--fg)",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {(stats?.departmentDistribution ?? []).slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="truncate max-w-[110px]" style={{ color: "var(--fg-muted)" }}>{d.name}</span>
                </div>
                <span className="font-semibold" style={{ color: "var(--fg)" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={card}>
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Recent Activity</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>Latest actions across the system</p>
        </div>
        <RecentActivity activities={stats?.recentActivities ?? []} />
      </div>

    </motion.div>
  );
}
