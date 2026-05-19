import { connectDB } from "@/lib/db/mongoose";
import Department from "@/models/Department";

export async function getDepartments() {
  await connectDB();
  return Department.find().lean();
}

export async function createDepartment(data: { name: string; description?: string; managerId?: string }) {
  await connectDB();
  return Department.create(data);
}

export async function updateDepartment(id: string, data: Partial<{ name: string; description: string; managerId: string }>) {
  await connectDB();
  return Department.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteDepartment(id: string) {
  await connectDB();
  return Department.findByIdAndDelete(id);
}
