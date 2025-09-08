// components/employees/employee-list.tsx
"use client";

import React, { useState } from "react";
import { useEmployees } from "@/lib/services/employee-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  MoreHorizontal,
  User,
  Building2,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getStatusBadgeClasses,
  EMPLOYMENT_STATUS_OPTIONS,
  formatDate,
} from "@/lib/database-constants";
import type { EmployeeQuery, EmploymentStatus } from "@/lib/supabase-types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface EmployeeListProps {
  departmentId?: number;
  showCreateButton?: boolean;
}

export function EmployeeList({
  departmentId,
  showCreateButton = true,
}: EmployeeListProps) {
  const router = useRouter();
  const [query, setQuery] = useState<EmployeeQuery>({
    page: 0,
    page_size: 20,
    employment_status: "Active",
    department_id: departmentId,
  });

  const { data, isLoading, error } = useEmployees(query);

  const handleSearch = (search: string) => {
    setQuery((prev) => ({ ...prev, search: search || undefined, page: 0 }));
  };

  const handleStatusFilter = (employment_status: string) => {
    setQuery((prev) => ({
      ...prev,
      employment_status:
        employment_status === "all"
          ? undefined
          : (employment_status as EmploymentStatus),
      page: 0,
    }));
  };

  const handlePageChange = (page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading employees</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s employees
          </p>
        </div>
        {showCreateButton && (
          <Button onClick={() => router.push("/employees/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-8"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <Select
              value={query.employment_status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Employment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[180px]" />
                          <Skeleton className="h-3 w-[120px]" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[60px] rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No employees found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((employee) => (
                  <TableRow key={employee.employee_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            <AvatarInitials name={employee.full_name_english} />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {employee.full_name_english}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {employee.full_name_vietnamese}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {employee.employee_id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {
                            (employee.employment_info || [
                              { position_english: "N/A" },
                            ])[0].position_english
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {
                            (employee.employment_info || [
                              { position_vietnamese: "N/A" },
                            ])[0].position_vietnamese
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.department?.name || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusBadgeClasses(
                          "employment",
                          employee.employment_status
                        )}
                      >
                        {employee.employment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {employee.employment_info &&
                      employee.employment_info.length > 0 &&
                      employee.employment_info[0].onboarding_date
                        ? formatDate(
                            employee.employment_info[0].onboarding_date
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/employees/${employee.employee_id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/employees/${employee.employee_id}/edit`}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {data.data.length} of {data.count} employees
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={query.page === 0}
              onClick={() => handlePageChange((query.page || 0) - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-3 text-sm">
              Page {(query.page || 0) + 1} of {data.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={(query.page || 0) >= data.total_pages - 1}
              onClick={() => handlePageChange((query.page || 0) + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
