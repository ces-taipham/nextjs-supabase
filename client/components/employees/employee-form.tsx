// components/employees/employee-form.tsx
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateEmployee, useUpdateEmployee } from '@/lib/services/employee-service';
import { EMPLOYMENT_STATUS_OPTIONS, MARITAL_STATUS_OPTIONS } from '@/lib/database-constants';
import type { CreateEmployeeRequest, UpdateEmployeeRequest, Employee } from '@/lib/supabase-types';
import { useRouter } from 'next/navigation';

// Updated schema to handle optional marital status properly
const employeeFormSchema = z.object({
  full_name_english: z.string().min(2, 'English name must be at least 2 characters').max(150),
  full_name_vietnamese: z.string().min(2, 'Vietnamese name must be at least 2 characters').max(150),
  display_name: z.string().max(100).optional(),
  employment_status: z.enum(['Active', 'Terminated', 'Pre-onboarding', 'Onboarding']),
  marital_status: z.enum(['Single', 'Married', 'Divorced', 'Widowed', 'not_specified']).optional(),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  mode: 'create' | 'edit';
}

export function EmployeeForm({ employee, mode }: EmployeeFormProps) {
  const router = useRouter();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      full_name_english: employee?.full_name_english || '',
      full_name_vietnamese: employee?.full_name_vietnamese || '',
      display_name: employee?.display_name || '',
      employment_status: employee?.employment_status || 'Active',
      marital_status: employee?.marital_status || 'not_specified',
    },
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Transform data before submission
      const submitData = {
        ...data,
        marital_status: data.marital_status === 'not_specified' ? undefined : data.marital_status,
      };

      if (mode === 'create') {
        const result = await createEmployee.mutateAsync(submitData as CreateEmployeeRequest);
        router.push(`/employees/${result.employee_id}`);
      } else if (employee) {
        await updateEmployee.mutateAsync({
          employeeId: employee.employee_id,
          updates: submitData as UpdateEmployeeRequest,
        });
        router.push(`/employees/${employee.employee_id}`);
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Form submission error:', error);
    }
  };

  const isLoading = createEmployee.isPending || updateEmployee.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === 'create' ? 'Create New Employee' : 'Edit Employee'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'create' 
            ? 'Add a new employee to your organization' 
            : 'Update employee information'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name_english"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (English) *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="full_name_vietnamese"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (Vietnamese) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="employment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EMPLOYMENT_STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marital_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="not_specified">Not specified</SelectItem>
                          {MARITAL_STATUS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    mode === 'create' ? 'Create Employee' : 'Update Employee'
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Additional Information Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="h-5 w-5 text-blue-500 mt-0.5">
              ℹ️
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Additional Information</h4>
              <p className="text-sm text-blue-700 mt-1">
                After creating the employee, you can add more detailed information such as contact details, 
                employment information, and personal details from the employee profile page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}