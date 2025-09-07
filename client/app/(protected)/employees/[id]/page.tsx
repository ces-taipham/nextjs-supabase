// app/employees/[id]/page.tsx

import React from "react";
import { EmployeeProfile } from "@/components/employees/employee-profile";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface EmployeeDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: EmployeeDetailPageProps): Promise<Metadata> {
  // In a real app, you might want to fetch the employee name for the title
  return {
    title: `Employee ${params.id} | HRMS`,
    description: `Employee profile for ${params.id}`,
  };
}

export default function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const { id } = params;

  // Basic validation
  if (!id || id.length < 3) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <EmployeeProfile employeeId={id} />
    </div>
  );
}
