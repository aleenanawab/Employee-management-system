import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import Employee from "@/models/Employee";
import ActivityLog from "@/models/ActivityLog";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const employee = await Employee.findById(id).populate("department", "name").lean();
    if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role === "employee_viewer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await connectToDatabase();
    const employee = await Employee.findByIdAndUpdate(id, body, { new: true }).lean();

    await ActivityLog.create({
      userId: session.user.id,
      action: "UPDATE",
      entity: "Employee",
      entityId: id,
      details: `Updated employee`,
    });

    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role === "employee_viewer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const employee = await Employee.findByIdAndDelete(id);

    await ActivityLog.create({
      userId: session.user.id,
      action: "DELETE",
      entity: "Employee",
      entityId: id,
      details: `Deleted employee ${employee?.name}`,
    });

    return NextResponse.json({ message: "Employee deleted" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
