// app/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Shield, BarChart3 } from "lucide-react";

export default async function HomePage() {
  // Check if user is already authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // If authenticated, redirect to employees page
  if (user) {
    redirect("/employees");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">HRMS</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Human Resource Management System
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your HR processes with our comprehensive employee management platform. 
            Handle everything from employee profiles to leave management in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to manage your workforce
          </h3>
          <p className="text-lg text-gray-600">
            Powerful features designed to simplify HR management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Employee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive employee profiles with personal information, 
                employment details, and contact management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Department Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize your workforce with hierarchical department structures 
                and clear reporting lines.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Leave Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Handle leave requests, approvals, and balance tracking 
                with automated workflow systems.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get insights into your workforce with detailed analytics 
                and customizable reporting features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your HR processes?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies already using our platform
          </p>
          <Link href="/auth/sign-up">
            <Button variant="secondary" size="lg" className="px-8 py-3">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-6 w-6" />
            <span className="text-lg font-semibold">HRMS</span>
          </div>
          <p className="text-gray-400">
            © 2025 HRMS. All rights reserved. Built with Next.js and Supabase.
          </p>
        </div>
      </footer>
    </main>
  );
}