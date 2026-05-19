import { connectDB } from "@/lib/db/mongoose";
import Employee from "@/models/Employee";
import type { EmployeeFormData } from "@/types";

export async function getEmployees(page = 1, limit = 10, search = "", department = "") {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (search) query.$or = [{ firstName: new RegExp(search, "i") }, { lastName: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  if (department) query.departmentId = department;

  const [data, total] = await Promise.all([
    Employee.find(query).populate("departmentId", "name").skip((page - 1) * limit).limit(limit).lean(),
    Employee.countDocuments(query),
  ]);
  return { data, total, page, limit };
}

export async function getEmployeeById(id: string) {
  await connectDB();
  return Employee.findById(id).populate("departmentId", "name").lean();
}

export async function createEmployee(data: EmployeeFormData) {
  await connectDB();
  return Employee.create(data);
}

export async function updateEmployee(id: string, data: Partial<EmployeeFormData>) {
  await connectDB();
  return Employee.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteEmployee(id: string) {
  await connectDB();
  return Employee.findByIdAndDelete(id);
}
