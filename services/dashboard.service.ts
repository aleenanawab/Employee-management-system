import { connectDB } from "@/lib/db/mongoose";
import Employee from "@/models/Employee";
import Department from "@/models/Department";
import Salary from "@/models/Salary";
import ActivityLog from "@/models/ActivityLog";

export async function getDashboardStats() {
  await connectDB();
  const now = new Date();

  const [totalEmployees, activeEmployees, totalDepartments, salaryAgg, recentActivity] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: "active" }),
    Department.countDocuments(),
    Salary.aggregate([
      { $match: { month: now.getMonth() + 1, year: now.getFullYear(), status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate("userId", "name").lean(),
  ]);

  return {
    totalEmployees,
    activeEmployees,
    totalDepartments,
    monthlySalary: salaryAgg[0]?.total ?? 0,
    recentActivity,
  };
}
