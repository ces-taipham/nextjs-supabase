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
  const findEmployeeRecord = async (authUserId: string) => {
    const supabase = createClient();
    
    try {
      // Find employee by auth user id
      const { data: employee, error: contactError } = await supabase
        .from('employees')
        .select(`
          employee_id
        `)
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      if (!contactError && employee) {
        return employee.employee_id;
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
      const employeeId = await findEmployeeRecord(authData.user.id);

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

            {/* Info Note */}
            <div className="text-center">
              <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-3">
                💡 <strong>How it works:</strong> After login, you&apos;ll be redirected to your employee profile 
                if one exists for your email address. If no employee record is found, you&apos;ll see the employees list.
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}