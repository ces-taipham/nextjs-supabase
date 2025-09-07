// app/api/employees/[id]/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const contactInfoSchema = z.object({
  mobile_phone: z.string().max(20).optional(),
  permanent_address: z.string().optional(),
  temporary_address: z.string().optional(),
  personal_email: z.string().email().max(100).optional(),
  company_email: z.string().email().max(100).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("employee_id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error);
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
      data: data || null,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();

    const validatedData = contactInfoSchema.parse(body);

    // Upsert contact info
    const { data, error } = await supabase
      .from("contact_info")
      .upsert({
        employee_id: id,
        ...validatedData,
      })
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

    return NextResponse.json({
      success: true,
      data,
      message: "Contact information updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            details: (error as any).errors,
          },
        },
        { status: 400 }
      );
    }

    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
