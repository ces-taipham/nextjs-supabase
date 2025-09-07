// app/api/employees/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fixed query with explicit relationship specification
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
        ),
        financial_info(*)
      `)
      .eq('employee_id', id)
      .single();

    if (error) {
      console.error("Database error:", error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Employee not found" },
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: { code: "DATABASE_ERROR", message: error.message },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // Remove fields that shouldn't be updated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { employee_id, number, created_at, updated_at, ...updateData } = body;

    const { data: employee, error } = await supabase
      .from('employees')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('employee_id', id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Employee not found" },
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: { code: "DATABASE_ERROR", message: error.message },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Instead of hard delete, we'll soft delete by changing status
    const { data: employee, error } = await supabase
      .from('employees')
      .update({
        employment_status: 'Terminated',
        updated_at: new Date().toISOString(),
      })
      .eq('employee_id', id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Employee not found" },
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: { code: "DATABASE_ERROR", message: error.message },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}