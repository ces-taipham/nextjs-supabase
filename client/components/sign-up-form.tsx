// components/sign-up-form.tsx
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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullNameEnglish: "",
    fullNameVietnamese: "",
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear errors when user types
  };

  // Generate unique employee ID
  const generateEmployeeId = (): string => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP${timestamp.toString().slice(-6)}${randomNum}`;
  };

  // Validate form data
  const validateForm = (): string | null => {
    const { email, password, confirmPassword, fullNameEnglish, fullNameVietnamese } = formData;

    if (!email.trim()) return "Email is required";
    if (!email.includes("@")) return "Please enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (!fullNameEnglish.trim()) return "English name is required";
    if (!fullNameVietnamese.trim()) return "Vietnamese name is required";

    return null;
  };

  // Create employee record in database
  const createEmployeeRecord = async (employeeId: string) => {
    const supabase = createClient();
    
    const employeeData = {
      employee_id: employeeId,
      full_name_english: formData.fullNameEnglish.trim(),
      full_name_vietnamese: formData.fullNameVietnamese.trim(),
      employment_status: 'Active' as const,
      marital_status: 'Single' as const,
    };

    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single();

    if (error) {
      console.error('Employee creation error:', error);
      throw new Error(`Failed to create employee record: ${error.message}`);
    }

    return data;
  };

  // Handle form submission
  const handleSignUp = async (e: React.FormEvent) => {
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

      // Step 2: Create authentication account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name_english: formData.fullNameEnglish.trim(),
            full_name_vietnamese: formData.fullNameVietnamese.trim(),
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Failed to create user account");
      }

      // Step 3: Create employee record
      try {
        const employeeId = generateEmployeeId();
        await createEmployeeRecord(employeeId);
        console.log('Employee record created successfully with ID:', employeeId);
      } catch (employeeError) {
        // Log the error but don't fail the signup process
        console.error('Employee record creation failed:', employeeError);
        // The user can still complete signup and add employee info later
      }

      // Step 4: Redirect to success page
      router.push("/auth/sign-up-success");

    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join our HRMS platform and start managing your profile
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-6">
            
            {/* Employee Information Section */}
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-700 border-b pb-2">
                👤 Employee Information
              </div>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="fullNameEnglish">Full Name (English) *</Label>
                  <Input
                    id="fullNameEnglish"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={formData.fullNameEnglish}
                    onChange={(e) => handleInputChange('fullNameEnglish', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="fullNameVietnamese">Full Name (Vietnamese) *</Label>
                  <Input
                    id="fullNameVietnamese"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    required
                    value={formData.fullNameVietnamese}
                    onChange={(e) => handleInputChange('fullNameVietnamese', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <div className="text-sm font-semibold text-gray-700 border-b pb-2">
                🔐 Account Information
              </div>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="mt-1"
                  />
                </div>
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link 
                href="/auth/login" 
                className="font-medium text-primary hover:underline"
              >
                Sign in here
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}