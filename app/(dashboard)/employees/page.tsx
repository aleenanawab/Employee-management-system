"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Users, Search } from "lucide-react";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import ConfirmDialog from "@/components/modals/ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Employee } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [total, setTotal] = useState(0);

  const fetchEmployees = useCallback(async (q: string, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (q) params.set("search", q);
      if (s) params.set("status", s);
      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();
      setEmployees(data.employees ?? []);
      setTotal(data.total ?? 0);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchEmployees(search, status), 300);
    return () => clearTimeout(timer);
  }, [search, status, fetchEmployees]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/employees/${deleteTarget._id}`, { method: "DELETE" });
      setEmployees((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      setTotal((t) => t - 1);
      toast.success("Employee deleted");
    } catch {
      toast.error("Failed to delete employee");
    } finally {
      setDeleteTarget(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--input-bg)",
    color: "var(--fg)",
    border: "1px solid var(--border)",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Employees</h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
            {loading ? "Loading..." : `${total} total employees`}
          </p>
        </div>
        <Link
          href="/employees/add"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px"
          style={{ background: "linear-gradient(135deg, #6d28d9, #059669)", boxShadow: "0 2px 8px rgba(109,40,217,0.25)" }}
        >
          <Plus size={16} /> Add Employee
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--fg-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            style={inputStyle}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 text-sm rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
          style={inputStyle}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : employees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20"
          style={{ borderColor: "var(--border)" }}>
          <Users size={48} className="mb-3 opacity-30" style={{ color: "var(--fg-muted)" }} />
          <p className="font-medium" style={{ color: "var(--fg-muted)" }}>
            {search || status ? "No employees match your search" : "No employees yet"}
          </p>
          {!search && !status && (
            <Link href="/employees/add" className="mt-3 text-sm font-medium hover:underline" style={{ color: "var(--neon-purple)" }}>
              Add your first employee →
            </Link>
          )}
        </div>
      ) : (
        <EmployeeTable
          data={employees}
          onEdit={(emp) => router.push(`/employees/${emp._id}`)}
          onDelete={setDeleteTarget}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Employee"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
}
