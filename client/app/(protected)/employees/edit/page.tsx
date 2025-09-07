// app/employees/[id]/edit/page.tsx
"use client";

import React from "react";
import { useEmployee } from "@/lib/services/employee-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/employees/employee-form";

interface EditEmployeePageProps {
  params: {
    id: string;
  };
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { id } = params;
  const { data: employee, isLoading, error } = useEmployee(id);

  // Basic validation
  if (!id || id.length < 3) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-[150px]" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-500 mb-2">Employee not found</p>
              <Button asChild>
                <Link href="/employees">Back to Employees</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <EmployeeForm employee={employee} mode="edit" />
    </div>
  );
}
