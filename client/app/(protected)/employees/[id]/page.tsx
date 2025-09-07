// app/(protected)/employees/[id]/page.tsx
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building2, 
  Edit,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for the page - Updated for Next.js 15
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Employee ${id} | HRMS`,
    description: 'Employee profile and information',
  };
}

export default async function EmployeeProfilePage({ params }: PageProps) {
  // Await params for Next.js 15 compatibility
  const { id } = await params;
  
  const supabase = await createClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/auth/login');
  }

  // Fetch employee data with related information
  const { data: employee, error } = await supabase
    .from('employees')
    .select(`
      *,
      personal_info(*),
      contact_info(*),
      employment_info!employment_info_employee_id_fkey(
        *,
        departments(name, code),
        manager:employees!employment_info_manager_id_fkey(full_name_english, employee_id)
      )
    `)
    .eq('employee_id', id)
    .single();

  if (error || !employee) {
    console.error('Error fetching employee:', error);
    notFound();
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'pre-onboarding': return 'bg-yellow-100 text-yellow-800';
      case 'onboarding': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to get user initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/employees">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Employees
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
            <p className="text-gray-600">View and manage employee information</p>
          </div>
        </div>
        
        <Link href={`/employees/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Main Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {getInitials(employee.full_name_english)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{employee.full_name_english}</CardTitle>
                  <CardDescription className="text-lg">{employee.full_name_vietnamese}</CardDescription>
                  {employee.display_name && (
                    <p className="text-sm text-gray-500">Known as: {employee.display_name}</p>
                  )}
                </div>
                
                <div className="text-right">
                  <Badge className={getStatusColor(employee.employment_status)}>
                    {employee.employment_status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">ID: {employee.employee_id}</p>
                  <p className="text-sm text-gray-500">#{employee.number}</p>
                </div>
              </div>
              
              {/* Employee Quick Info */}
              {employee.employment_info?.[0] && (
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {employee.employment_info[0].position_english && (
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      {employee.employment_info[0].position_english}
                    </div>
                  )}
                  
                  {employee.employment_info[0].departments && (
                    <div className="flex items-center text-gray-600">
                      <Building2 className="h-4 w-4 mr-1" />
                      {employee.employment_info[0].departments.name}
                    </div>
                  )}
                  
                  {employee.employment_info[0].onboarding_date && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Started {formatDate(employee.employment_info[0].onboarding_date)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Employee Number</p>
                <p className="text-sm">{employee.number || 'Not assigned'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Marital Status</p>
                <p className="text-sm">{employee.marital_status || 'Not specified'}</p>
              </div>
            </div>

            {employee.personal_info?.[0] && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-sm">{formatDate(employee.personal_info[0].date_of_birth)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-sm">{employee.personal_info[0].gender || 'Not specified'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nationality</p>
                    <p className="text-sm">{employee.personal_info[0].nationality || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID Number</p>
                    <p className="text-sm">{employee.personal_info[0].identity_card_number || 'Not provided'}</p>
                  </div>
                </div>
              </>
            )}

            {!employee.personal_info?.[0] && (
              <p className="text-sm text-gray-500 italic">No personal information available</p>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.contact_info?.[0] ? (
              <>
                {employee.contact_info[0].company_email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Company Email</p>
                      <p className="text-sm text-gray-600">{employee.contact_info[0].company_email}</p>
                    </div>
                  </div>
                )}

                {employee.contact_info[0].personal_email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Personal Email</p>
                      <p className="text-sm text-gray-600">{employee.contact_info[0].personal_email}</p>
                    </div>
                  </div>
                )}

                {employee.contact_info[0].mobile_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Mobile Phone</p>
                      <p className="text-sm text-gray-600">{employee.contact_info[0].mobile_phone}</p>
                    </div>
                  </div>
                )}

                {employee.contact_info[0].permanent_address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-gray-600">{employee.contact_info[0].permanent_address}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No contact information available</p>
            )}
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.employment_info?.[0] ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Position (Vietnamese)</p>
                    <p className="text-sm">{employee.employment_info[0].position_vietnamese || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Grade</p>
                    <p className="text-sm">{employee.employment_info[0].grade || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Working Type</p>
                    <p className="text-sm">{employee.employment_info[0].working_type || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee Status</p>
                    <p className="text-sm">{employee.employment_info[0].employee_status || 'Normal'}</p>
                  </div>
                </div>

                {employee.employment_info[0].manager && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Manager</p>
                    <Link href={`/employees/${employee.employment_info[0].manager.employee_id}`}>
                      <p className="text-sm text-blue-600 hover:underline">
                        {employee.employment_info[0].manager.full_name_english}
                      </p>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No employment information available</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <Link href={`/employees/${id}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Employee Information
                </Button>
              </Link>
              
              <Link href="/employees">
                <Button variant="outline" className="w-full justify-start">
                  <Building2 className="h-4 w-4 mr-2" />
                  View All Employees
                </Button>
              </Link>

              <Button variant="outline" className="w-full justify-start" disabled>
                <Calendar className="h-4 w-4 mr-2" />
                Request Leave (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline or Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Recent updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Profile created</p>
                <p className="text-xs text-gray-500">{formatDate(employee.created_at)}</p>
              </div>
            </div>
            
            {employee.updated_at !== employee.created_at && (
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Profile updated</p>
                  <p className="text-xs text-gray-500">{formatDate(employee.updated_at)}</p>
                </div>
              </div>
            )}

            {employee.employment_info?.[0]?.onboarding_date && (
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Started employment</p>
                  <p className="text-xs text-gray-500">{formatDate(employee.employment_info[0].onboarding_date)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}