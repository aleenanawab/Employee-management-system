export type EmployeeStatus = "active" | "inactive";
export type UserRole = "admin" | "hr_manager" | "employee_viewer";

export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: { _id: string; name: string } | string;
  position: string;
  salary: number;
  joiningDate: string;
  image?: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  salary: number;
  joiningDate: string;
  status: EmployeeStatus;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  head?: string;
  createdAt: string;
}

export interface SalaryRecord {
  _id: string;
  employeeId: string;
  amount: number;
  month: number;
  year: number;
  status: "paid" | "pending" | "cancelled";
  paidAt?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  monthlySalary: number;
  newEmployees: number;
  employeeGrowth: { month: string; employees: number }[];
  departmentDistribution: { name: string; value: number }[];
  recentActivities: ActivityItem[];
}

export interface ActivityItem {
  _id: string;
  action: string;
  entity: string;
  details?: string;
  createdAt: string;
  userId?: { name: string };
}
