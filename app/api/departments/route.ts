import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import Department from "@/models/Department";

export async function GET() {
  try {
    await connectToDatabase();
    const departments = await Department.find().lean();
    return NextResponse.json(departments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role === "employee_viewer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDatabase();
    const body = await req.json();
    const department = await Department.create(body);
    return NextResponse.json(department, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
