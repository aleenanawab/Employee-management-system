"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, ChevronDown, ChevronUp, Mail, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import type { Department, Employee } from "@/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<Record<string, Employee[]>>({});
  const [loadingEmps, setLoadingEmps] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then((d) => setDepartments(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  async function toggleDept(deptId: string) {
    if (expanded === deptId) { setExpanded(null); return; }
    setExpanded(deptId);
    if (deptEmployees[deptId]) return;
    setLoadingEmps(deptId);
    const res = await fetch(`/api/employees?department=${deptId}&limit=100`);
    const data = await res.json();
    setDeptEmployees((prev) => ({ ...prev, [deptId]: data.employees ?? [] }));
    setLoadingEmps(null);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--fg)" }}>Departments</h1>
          <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>Click a department to view its employees</p>
        </div>
        <div className="rounded-xl px-4 py-2" style={{ background: "var(--primary-light)" }}>
          <span className="text-sm font-medium" style={{ color: "var(--neon-purple)" }}>
            {departments.length} Departments
          </span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl" style={{ background: "var(--border)" }} />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20"
          style={{ borderColor: "var(--border)" }}>
          <Building2 size={48} className="mb-3 opacity-30" style={{ color: "var(--fg-muted)" }} />
          <p className="font-medium" style={{ color: "var(--fg-muted)" }}>No departments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {departments.map((dept) => {
            const isOpen = expanded === dept._id;
            const emps = deptEmployees[dept._id] ?? [];
            const isLoadingEmps = loadingEmps === dept._id;

            return (
              <div key={dept._id} className="rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}>

                <button
                  onClick={() => toggleDept(dept._id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-all duration-200"
                  style={{ color: "var(--fg)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl p-3 shrink-0" style={{ background: "var(--primary-light)" }}>
                      <Building2 size={20} style={{ color: "var(--neon-purple)" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: "var(--fg)" }}>{dept.name}</h3>
                      <p className="text-sm mt-0.5" style={{ color: "var(--fg-muted)" }}>{dept.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="hidden sm:flex items-center gap-1.5 text-sm rounded-full px-3 py-1"
                      style={{ background: "var(--primary-light)", color: "var(--fg-muted)" }}>
                      <Users size={13} />
                      {isOpen ? `${emps.length} employees` : "View employees"}
                    </span>
                    <div className="rounded-lg p-1.5" style={{ background: "var(--primary-light)" }}>
                      {isOpen
                        ? <ChevronUp size={16} style={{ color: "var(--fg-muted)" }} />
                        : <ChevronDown size={16} style={{ color: "var(--fg-muted)" }} />}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
                        {isLoadingEmps ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "var(--neon-purple)", borderTopColor: "transparent" }} />
                          </div>
                        ) : emps.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Users size={32} className="mb-2 opacity-30" style={{ color: "var(--fg-muted)" }} />
                            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>No employees in this department yet.</p>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--fg-muted)" }}>
                              {emps.length} {emps.length === 1 ? "Employee" : "Employees"}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {emps.map((emp) => (
                                <div key={emp._id} className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200"
                                  style={{ background: "var(--input-bg)", border: "1px solid var(--border)" }}>
                                  <Avatar className="h-10 w-10 shrink-0">
                                    <AvatarFallback className="text-sm font-semibold text-white"
                                      style={{ background: "linear-gradient(135deg, #6d28d9, #059669)" }}>
                                      {getInitials(emp.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate" style={{ color: "var(--fg)" }}>{emp.name}</p>
                                    <p className="text-xs flex items-center gap-1 truncate mt-0.5" style={{ color: "var(--fg-muted)" }}>
                                      <Briefcase size={10} /> {emp.position}
                                    </p>
                                    <p className="text-xs flex items-center gap-1 truncate" style={{ color: "var(--fg-muted)", opacity: 0.7 }}>
                                      <Mail size={10} /> {emp.email}
                                    </p>
                                  </div>
                                  <span className={`shrink-0 text-xs rounded-full px-2 py-0.5 font-medium ${emp.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500"}`}>
                                    {emp.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
