"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { month: "Jan", employees: 40 },
  { month: "Feb", employees: 45 },
  { month: "Mar", employees: 42 },
  { month: "Apr", employees: 50 },
  { month: "May", employees: 55 },
  { month: "Jun", employees: 58 },
];

export default function EmployeeChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border dark:border-gray-700">
      <h3 className="font-semibold mb-4">Employee Growth</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
