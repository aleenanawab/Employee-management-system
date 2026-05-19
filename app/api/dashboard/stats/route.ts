import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import Employee from "@/models/Employee";
import Department from "@/models/Department";
import Salary from "@/models/Salary";
import ActivityLog from "@/models/ActivityLog";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalEmployees, totalDepartments, salaryAgg, newEmployees, recentActivities, deptDist] = await Promise.all([
      Employee.countDocuments(),
      Department.countDocuments(),
      Salary.aggregate([
        { $match: { month: now.getMonth() + 1, year: now.getFullYear(), status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Employee.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate("userId", "name").lean(),
      Employee.aggregate([
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } },
        { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$dept.name", "Unknown"] }, value: "$count" } },
      ]),
    ]);

    // Build last 6 months growth data via single aggregation
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const growthAgg = await Employee.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
    ]);
    const growthMap = new Map(growthAgg.map((g) => [`${g._id.year}-${g._id.month}`, g.count]));
    const employeeGrowth = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { month: d.toLocaleString("default", { month: "short" }), employees: growthMap.get(`${d.getFullYear()}-${d.getMonth() + 1}`) ?? 0 };
    });

    return NextResponse.json({
      totalEmployees,
      totalDepartments,
      monthlySalary: salaryAgg[0]?.total ?? 0,
      newEmployees,
      employeeGrowth,
      departmentDistribution: deptDist,
      recentActivities,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
