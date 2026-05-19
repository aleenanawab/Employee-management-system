"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Department, EmployeeFormData } from "@/types";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(2),
  salary: z.preprocess((v) => Number(v), z.number().positive()),
  joiningDate: z.string().min(1),
  status: z.enum(["active", "inactive"]),
});

interface Props {
  defaultValues?: Partial<EmployeeFormData>;
  employeeId?: string;
}

export default function EmployeeForm({ defaultValues, employeeId }: Props) {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: { status: "active", ...defaultValues },
  });

  useEffect(() => {
    fetch("/api/departments").then((r) => r.json()).then(setDepartments);
  }, []);

  async function onSubmit(data: EmployeeFormData) {
    const url = employeeId ? `/api/employees/${employeeId}` : "/api/employees";
    const method = employeeId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      toast.success(employeeId ? "Employee updated" : "Employee created");
      router.push("/employees");
    } else {
      toast.error("Something went wrong");
    }
  }

  const field = "w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500";
  const err = "text-red-500 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border dark:border-gray-800 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <Input {...register("name")} placeholder="John Doe" />
          {errors.name && <p className={err}>{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input {...register("email")} type="email" placeholder="john@example.com" />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input {...register("phone")} placeholder="+1 234 567 8900" />
          {errors.phone && <p className={err}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <Input {...register("position")} placeholder="Software Engineer" />
          {errors.position && <p className={err}>{errors.position.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select {...register("department")} className={field}>
            <option value="">Select department</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          {errors.department && <p className={err}>{errors.department.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Salary</label>
          <Input {...register("salary")} type="number" placeholder="50000" />
          {errors.salary && <p className={err}>{errors.salary.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Joining Date</label>
          <Input {...register("joiningDate")} type="date" />
          {errors.joiningDate && <p className={err}>{errors.joiningDate.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select {...register("status")} className={field}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <Input {...register("address")} placeholder="123 Main St, City, Country" />
        {errors.address && <p className={err}>{errors.address.message}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : employeeId ? "Update Employee" : "Create Employee"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
