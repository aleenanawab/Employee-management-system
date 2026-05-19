"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface SalaryRecord {
  _id: string;
  employeeId: { _id: string; name: string; salary: number } | string;
  amount: number;
  month: number;
  year: number;
  status: "paid" | "pending" | "cancelled";
  paidAt?: string;
}
interface Employee { _id: string; name: string; salary: number; status: string; }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const card: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "1rem", padding: "1.25rem", boxShadow: "var(--shadow-card)" };
const sel: React.CSSProperties = { background: "var(--input-bg)", color: "var(--fg)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "0.5rem 0.75rem", fontSize: "0.875rem", outline: "none" };

export default function SalaryPage() {
  const [records, setRecords] = useState<SalaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const years = Array.from({ length: 4 }, (_, i) => now.getFullYear() - 1 + i);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/salary?month=${month}&year=${year}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load salary records"); }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  async function generateSalaries() {
    setGenerating(true);
    try {
      const empRes = await fetch("/api/employees?limit=1000&status=active");
      const employees: Employee[] = (await empRes.json()).employees ?? [];
      if (!employees.length) { toast.error("No active employees found"); return; }
      const existingIds = new Set(records.map((r) => typeof r.employeeId === "object" ? r.employeeId._id : r.employeeId));
      const toCreate = employees.filter((e) => !existingIds.has(e._id));
      if (!toCreate.length) { toast.info("All employees already have records for this period"); return; }
      await Promise.all(toCreate.map((emp) => fetch("/api/salary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ employeeId: emp._id, amount: emp.salary, month, year, status: "pending" }) })));
      toast.success(`Generated ${toCreate.length} salary record${toCreate.length > 1 ? "s" : ""}`);
      fetchRecords();
    } catch { toast.error("Failed to generate salary records"); }
    finally { setGenerating(false); }
  }

  async function markPaid(id: string) {
    const res = await fetch(`/api/salary/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }) });
    if (res.ok) { toast.success("Marked as paid"); setRecords((p) => p.map((r) => r._id === id ? { ...r, status: "paid", paidAt: new Date().toISOString() } : r)); }
    else toast.error("Failed to update");
  }

  async function markCancelled(id: string) {
    const res = await fetch(`/api/salary/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "cancelled" }) });
    if (res.ok) { toast.success("Cancelled"); setRecords((p) => p.map((r) => r._id === id ? { ...r, status: "cancelled" } : r)); }
    else toast.error("Failed to update");
  }

  const statusConfig = {
    paid:      { icon: <CheckCircle size={13} />, bg: "rgba(5,150,105,0.1)",   color: "#059669" },
    pending:   { icon: <Clock size={13} />,       bg: "rgba(217,119,6,0.1)",   color: "#d97706" },
    cancelled: { icon: <XCircle size={13} />,     bg: "rgba(220,38,38,0.1)",   color: "#dc2626" },
  };

  const totalPaid    = records.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const totalPending = records.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const pendingCount = records.filter((r) => r.status === "pending").length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Salary</h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>{MONTHS[month - 1]} {year} payroll</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={sel}>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={sel}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={generateSalaries} disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-all hover:-translate-y-px"
            style={{ background: "linear-gradient(135deg, #6d28d9, #059669)", boxShadow: "0 2px 8px rgba(109,40,217,0.25)" }}>
            <Plus size={15} />{generating ? "Generating..." : "Generate Payroll"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Records", value: records.length, sub: `${pendingCount} pending`, subColor: "#d97706" },
          { label: "Total Paid",    value: formatCurrency(totalPaid),    sub: null, valueColor: "#059669" },
          { label: "Pending",       value: formatCurrency(totalPending), sub: null, valueColor: "#d97706" },
        ].map(({ label, value, sub, valueColor, subColor }) => (
          <div key={label} style={card}>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: valueColor ?? "var(--fg)" }}>{value}</p>
            {sub && <p className="text-xs mt-1" style={{ color: subColor ?? "var(--fg-muted)" }}>{sub}</p>}
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "var(--neon-purple)", borderTopColor: "transparent" }} />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <DollarSign size={40} style={{ color: "var(--border)" }} />
            <p className="font-medium" style={{ color: "var(--fg-muted)" }}>No salary records for {MONTHS[month - 1]} {year}</p>
            <button onClick={generateSalaries} disabled={generating} className="text-sm font-medium hover:underline disabled:opacity-50" style={{ color: "var(--neon-purple)" }}>
              Click &quot;Generate Payroll&quot; to create records for all active employees
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {["Employee","Amount","Period","Status","Paid At","Actions"].map((h) => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => {
                const cfg = statusConfig[r.status];
                const empName = typeof r.employeeId === "object" ? r.employeeId.name : "—";
                return (
                  <TableRow key={r._id}>
                    <TableCell><span className="font-medium" style={{ color: "var(--fg)" }}>{empName}</span></TableCell>
                    <TableCell><span className="font-semibold" style={{ color: "var(--fg)" }}>{formatCurrency(r.amount)}</span></TableCell>
                    <TableCell><span style={{ color: "var(--fg-muted)" }}>{MONTHS[r.month - 1]} {r.year}</span></TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {r.status}
                      </span>
                    </TableCell>
                    <TableCell><span style={{ color: "var(--fg-muted)" }}>{r.paidAt ? formatDate(r.paidAt) : "—"}</span></TableCell>
                    <TableCell>
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => markPaid(r._id)} style={{ color: "#059669", borderColor: "rgba(5,150,105,0.3)", fontSize: "0.75rem", height: "1.75rem" }}>Mark Paid</Button>
                          <Button size="sm" variant="outline" onClick={() => markCancelled(r._id)} style={{ color: "#dc2626", borderColor: "rgba(220,38,38,0.3)", fontSize: "0.75rem", height: "1.75rem" }}>Cancel</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
}
