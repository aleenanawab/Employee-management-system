import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import Salary from "@/models/Salary";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const query: Record<string, unknown> = {};
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);
    const records = await Salary.find(query).populate("employeeId", "name salary").lean();
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: "Failed to fetch salary records" }, { status: 500 });
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
    const record = await Salary.create(body);
    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create salary record" }, { status: 500 });
  }
}
