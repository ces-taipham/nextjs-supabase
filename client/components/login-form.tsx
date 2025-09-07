// components/login-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear errors when user types
  };

  // Validate form data
  const validateForm = (): string | null => {
    const { email, password } = formData;

    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Please enter a valid email";
    if (!password) return "Password is required";

    return null;
  };

  // Find employee record associated with the logged-in user
  const findEmployeeRecord = async () => {
    const supabase = createClient();
    
    try {
      // Strategy 1: Find employee by email (check both company and personal email)
      // First, get contact info that matches the user's email
      const { data: contactInfo, error: contactError } = await supabase
        .from('contact_info')
        .select(`
          employee_id,
          employees!inner(
            employee_id,
            full_name_english,
            employment_status
          )
        `)
        .or(`company_email.eq.${formData.email},personal_email.eq.${formData.email}`)
        .eq('employees.employment_status', 'Active')
        .limit(1);

      if (!contactError && contactInfo && contactInfo.length > 0) {
        return contactInfo[0].employees[0].employee_id;
      }

      // Strategy 2: If no contact info found, get the most recent active employee
      // This is a fallback for demo purposes
      const { data: employees, error: employeeError } = await supabase
        .from('employees')
        .select('employee_id, full_name_english')
        .eq('employment_status', 'Active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!employeeError && employees && employees.length > 0) {
        console.log('Using fallback employee:', employees[0].full_name_english);
        return employees[0].employee_id;
      }

      return null;

    } catch (error) {
      console.error('Error finding employee record:', error);
      return null;
    }
  };

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Validate form
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      const supabase = createClient();

      // Step 2: Authenticate user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Authentication failed");
      }

      console.log('User authenticated successfully:', authData.user.email);

      // Step 3: Find associated employee record
      const employeeId = await findEmployeeRecord();

      // Step 4: Redirect based on result
      if (employeeId) {
        console.log('Redirecting to employee profile:', employeeId);
        router.push(`/employees/${employeeId}`);
      } else {
        console.log('No employee record found, redirecting to employees list');
        router.push('/employees');
      }

    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific auth errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your HRMS account to access your profile
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Login Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="mt-1"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link 
                href="/auth/sign-up" 
                className="font-medium text-primary hover:underline"
              >
                Create account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}