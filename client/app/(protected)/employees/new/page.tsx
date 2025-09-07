// app/employees/new/page.tsx

import React from "react";
import { EmployeeForm } from "@/components/employees/employee-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Employee | HRMS",
  description: "Add a new employee to your organization",
};

export default function CreateEmployeePage() {
  return (
    <div className="container mx-auto py-6">
      <EmployeeForm mode="create" />
    </div>
  );
}
