// app/employees/[id]/loading.tsx

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function EmployeeLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[300px]" />
                  <Skeleton className="h-6 w-[250px]" />
                  <div className="flex items-center gap-4 mt-2">
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-10 w-[100px]" />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-[120px]" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-[200px]" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
