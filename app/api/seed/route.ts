import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import Department from "@/models/Department";
import Salary from "@/models/Salary";
import Employee from "@/models/Employee";

const DEFAULT_DEPARTMENTS = [
  { name: "Engineering", description: "Software development and technical operations" },
  { name: "Human Resources", description: "Recruitment, onboarding, and employee relations" },
  { name: "Finance", description: "Accounting, budgeting, and financial planning" },
  { name: "Marketing", description: "Brand, campaigns, and customer acquisition" },
  { name: "Sales", description: "Revenue generation and client management" },
  { name: "Operations", description: "Day-to-day business processes and logistics" },
  { name: "Design", description: "UI/UX, branding, and creative assets" },
  { name: "Customer Support", description: "Client assistance and issue resolution" },
];

export async function POST() {
  try {
    await connectToDatabase();

    // Seed departments
    const existingDepts = await Department.countDocuments();
    if (existingDepts === 0) {
      await Department.insertMany(DEFAULT_DEPARTMENTS);
    }

    // Seed salary records for existing employees (last 3 months)
    const existingSalaries = await Salary.countDocuments();
    if (existingSalaries === 0) {
      const employees = await Employee.find().lean();
      if (employees.length > 0) {
        const now = new Date();
        const salaries = employees.flatMap((emp) =>
          [0, 1, 2].map((offset) => {
            const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
            return {
              employeeId: emp._id,
              amount: (emp as { salary?: number }).salary ?? 5000,
              month: d.getMonth() + 1,
              year: d.getFullYear(),
              status: offset > 0 ? "paid" : "pending",
              paidAt: offset > 0 ? new Date(d.getFullYear(), d.getMonth() + 1, 5) : undefined,
            };
          })
        );
        await Salary.insertMany(salaries);
        return NextResponse.json({ message: `Seeded ${salaries.length} salary records for ${employees.length} employees` }, { status: 201 });
      }
    }

    return NextResponse.json({ message: `Skipped — data already exists` });
  } catch {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
