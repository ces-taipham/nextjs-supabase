// app/(protected)/employees/[id]/edit/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useEmployee } from "@/lib/services/employee-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmployeeForm } from "@/components/employees/employee-form";
import { ArrowLeft } from "lucide-react";

export default function EditEmployeePage() {
  // Use useParams hook to get route parameters in client component
  const params = useParams();
  const id = params.id as string;

  const { data: employee, isLoading, error } = useEmployee(id);

  // Basic validation
  if (!id || id.length < 3) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          
          {/* Form Skeleton */}
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
              <Skeleton className="h-10 w-full" />
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
            <div className="text-center space-y-4">
              <div className="text-red-500">
                <p className="text-lg font-semibold">Employee not found</p>
                <p className="text-sm">
                  The employee with ID `{id}` could not be found.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button asChild variant="outline">
                  <Link href="/employees">Back to Employees</Link>
                </Button>
                <Button asChild>
                  <Link href="/employees/new">Create New Employee</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/employees/${id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
            <p className="text-gray-600">Update employee information</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <nav className="flex items-center space-x-2">
          <Link href="/employees" className="hover:text-gray-900 hover:underline">
            Employees
          </Link>
          <span>/</span>
          <Link href={`/employees/${id}`} className="hover:text-gray-900 hover:underline">
            {employee.full_name_english}
          </Link>
          <span>/</span>
          <span className="text-gray-400">Edit</span>
        </nav>
      </div>

      {/* Employee Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {employee.full_name_english
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
              }
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{employee.full_name_english}</h3>
              <p className="text-sm text-gray-600">{employee.full_name_vietnamese}</p>
              <p className="text-xs text-gray-500">ID: {employee.employee_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <EmployeeForm employee={employee} mode="edit" />
    </div>
  );
}