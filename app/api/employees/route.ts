import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import Employee from "@/models/Employee";
import ActivityLog from "@/models/ActivityLog";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? "";
    const department = searchParams.get("department");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    if (department && department !== "all") query.department = department;
    if (status && status !== "all") query.status = status;

    const [employees, total] = await Promise.all([
      Employee.find(query).populate("department", "name").skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
      Employee.countDocuments(query),
    ]);

    return NextResponse.json({ employees, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    const employee = await Employee.create(body);

    await ActivityLog.create({
      userId: session.user.id,
      action: "CREATE",
      entity: "Employee",
      details: `Created employee ${employee.name}`,
    }).catch(() => {}); // non-blocking

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
