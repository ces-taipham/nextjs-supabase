// app/employees/page.tsx
import React from "react";
import { EmployeeList } from "@/components/employees/employee-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employees | HRMS",
  description: "Manage your organization employees",
};

export default function EmployeesPage() {
  return (
    <div className="container mx-auto py-6">
      <EmployeeList />
    </div>
  );
}
