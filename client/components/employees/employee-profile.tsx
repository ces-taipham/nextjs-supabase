// components/employees/employee-profile.tsx
"use client";

import React from "react";
import { useEmployee } from "@/lib/services/employee-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Phone,
  Mail,
  Building2,
  Briefcase,
  DollarSign,
  Edit,
  Calendar,
} from "lucide-react";
import {
  getStatusBadgeClasses,
  formatCurrency,
  formatDate,
} from "@/lib/database-constants";
import Link from "next/link";

interface EmployeeProfileProps {
  employeeId: string;
}

export function EmployeeProfile({ employeeId }: EmployeeProfileProps) {
  const { data: employee, isLoading, error } = useEmployee(employeeId);

  if (isLoading) {
    return <EmployeeProfileSkeleton />;
  }

  if (error || !employee) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                <AvatarInitials name={employee.full_name_english} />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {employee.full_name_english}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {employee.full_name_vietnamese}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge
                      className={getStatusBadgeClasses(
                        "employment",
                        employee.employment_status
                      )}
                    >
                      {employee.employment_status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ID: {employee.employee_id}
                    </span>
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/employees/${employeeId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {
                      (employee.employment_info || [
                        { position_english: "N/A" },
                      ])[0].position_english
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {employee.department?.name || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {employee.employment_info &&
                    employee.employment_info.length > 0 &&
                    employee.employment_info[0].onboarding_date
                      ? formatDate(employee.employment_info[0].onboarding_date)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {employee.contact_info?.company_email || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <PersonalInfoTab employee={employee} />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactInfoTab employee={employee} />
        </TabsContent>

        <TabsContent value="employment" className="space-y-4">
          <EmploymentInfoTab employee={employee} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialInfoTab employee={employee} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tab Components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PersonalInfoTab({ employee }: { employee: any }) {
  const personalInfo = employee.personal_info?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Date of Birth"
            value={
              personalInfo?.date_of_birth
                ? formatDate(personalInfo.date_of_birth)
                : "N/A"
            }
          />
          <InfoItem label="Gender" value={personalInfo?.gender || "N/A"} />
          <InfoItem
            label="Place of Birth"
            value={personalInfo?.place_of_birth || "N/A"}
          />
          <InfoItem
            label="Nationality"
            value={personalInfo?.nationality || "N/A"}
          />
          <InfoItem
            label="Identity Card"
            value={personalInfo?.identity_card_number || "N/A"}
          />
          <InfoItem
            label="Passport"
            value={personalInfo?.passport_number || "N/A"}
          />
          <InfoItem label="Tax Code" value={personalInfo?.tax_code || "N/A"} />
          <InfoItem
            label="Social Insurance"
            value={personalInfo?.social_insurance_number || "N/A"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContactInfoTab({ employee }: { employee: any }) {
  const contactInfo = employee.contact_info?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Mobile Phone"
            value={contactInfo?.mobile_phone || "N/A"}
          />
          <InfoItem
            label="Company Email"
            value={contactInfo?.company_email || "N/A"}
          />
          <InfoItem
            label="Personal Email"
            value={contactInfo?.personal_email || "N/A"}
          />
          <InfoItem
            label="Permanent Address"
            value={contactInfo?.permanent_address || "N/A"}
          />
          <InfoItem
            label="Temporary Address"
            value={contactInfo?.temporary_address || "N/A"}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EmploymentInfoTab({ employee }: { employee: any }) {
  const employmentInfo = employee.employment_info?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Employment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Position (English)"
            value={employmentInfo?.position_english || "N/A"}
          />
          <InfoItem
            label="Position (Vietnamese)"
            value={employmentInfo?.position_vietnamese || "N/A"}
          />
          <InfoItem
            label="Department"
            value={employee.department?.departments?.name || "N/A"}
          />
          <InfoItem
            label="Manager"
            value={employee.manager?.manager?.full_name_english || "N/A"}
          />
          <InfoItem label="Grade" value={employmentInfo?.grade || "N/A"} />
          <InfoItem
            label="Working Type"
            value={employmentInfo?.working_type || "N/A"}
          />
          <InfoItem
            label="Employee Status"
            value={employmentInfo?.employee_status || "N/A"}
          />
          <InfoItem
            label="Onboarding Date"
            value={
              employmentInfo?.onboarding_date
                ? formatDate(employmentInfo.onboarding_date)
                : "N/A"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FinancialInfoTab({ employee }: { employee: any }) {
  const financialInfo = employee.financial_info?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem
            label="Basic Salary"
            value={
              financialInfo?.basic_salary
                ? formatCurrency(financialInfo.basic_salary)
                : "N/A"
            }
          />
          <InfoItem
            label="Position Allowance"
            value={
              financialInfo?.position_allowance
                ? formatCurrency(financialInfo.position_allowance)
                : "N/A"
            }
          />
          <InfoItem
            label="Meal Allowance"
            value={
              financialInfo?.meal_allowance
                ? formatCurrency(financialInfo.meal_allowance)
                : "N/A"
            }
          />
          <InfoItem
            label="Travel Allowance"
            value={
              financialInfo?.travel_allowance
                ? formatCurrency(financialInfo.travel_allowance)
                : "N/A"
            }
          />
          <InfoItem
            label="Bank Name"
            value={financialInfo?.bank_name || "N/A"}
          />
          <InfoItem
            label="Bank Account"
            value={financialInfo?.bank_account_number || "N/A"}
          />
          <InfoItem
            label="Account Holder"
            value={financialInfo?.bank_account_holder || "N/A"}
          />
          <InfoItem label="Currency" value={financialInfo?.currency || "VND"} />
        </div>
      </CardContent>
    </Card>
  );
}

// Helper components
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <p className="text-sm mt-1">{value}</p>
    </div>
  );
}

function EmployeeProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-8 w-[300px] mb-2" />
              <Skeleton className="h-6 w-[250px] mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-[100px]" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
