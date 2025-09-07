// app/api/employees/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const search = searchParams.get("search");
    const employmentStatus = searchParams.get("employment_status");
    const departmentId = searchParams.get("department_id");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const supabase = await createClient();

    // Build the query with proper relationship specification
    let query = supabase
      .from('employees')
      .select(`
        *,
        employment_info!employment_info_employee_id_fkey(
          id,
          position_english,
          position_vietnamese,
          onboarding_date,
          departments(id, name, code)
        ),
        contact_info(
          company_email,
          personal_email,
          mobile_phone
        )
      `, { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(
        `full_name_english.ilike.%${search}%,full_name_vietnamese.ilike.%${search}%,employee_id.ilike.%${search}%`
      );
    }

    if (employmentStatus) {
      query = query.eq('employment_status', employmentStatus);
    }

    if (departmentId) {
      query = query.eq('employment_info.department_id', parseInt(departmentId));
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = page * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data: employees, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          error: { code: "DATABASE_ERROR", message: error.message },
        },
        { status: 500 }
      );
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    return NextResponse.json({
      success: true,
      data: employees || [],
      metadata: {
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages,
        },
      },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Generate employee ID if not provided
    if (!body.employee_id) {
      const timestamp = Date.now().toString();
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      body.employee_id = `EMP${timestamp.slice(-6)}${randomSuffix}`;
    }

    const { data: employee, error } = await supabase
      .from('employees')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          success: false,
          error: { code: "DATABASE_ERROR", message: error.message },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: employee,
      },
      { status: 201 }
    );
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