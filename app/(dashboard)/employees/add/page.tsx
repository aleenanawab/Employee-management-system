import EmployeeForm from "@/components/employees/EmployeeForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddEmployeePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Employees
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Employee</h1>
      <EmployeeForm />
    </div>
  );
}
