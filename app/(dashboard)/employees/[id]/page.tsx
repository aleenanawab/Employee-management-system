import EmployeeForm from "@/components/employees/EmployeeForm";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db/mongodb";
import Employee from "@/models/Employee";

async function getEmployee(id: string) {
  try {
    await connectToDatabase();
    const employee = await Employee.findById(id).populate("department", "name").lean();
    return employee ? JSON.parse(JSON.stringify(employee)) : null;
  } catch {
    return null;
  }
}

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await getEmployee(id);
  if (!employee) notFound();

  const defaultValues = {
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    department: typeof employee.department === "object" ? employee.department._id : employee.department,
    position: employee.position,
    salary: employee.salary,
    joiningDate: employee.joiningDate?.split("T")[0],
    status: employee.status,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Employee</h1>
      <EmployeeForm defaultValues={defaultValues} employeeId={id} />
    </div>
  );
}
