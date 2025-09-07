// app/api/employees/[id]/personal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const personalInfoSchema = z.object({
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  date_of_birth: z.string().optional(),
  place_of_birth: z.string().max(200).optional(),
  nationality: z.string().max(50).optional(),
  ethnic: z.string().max(50).optional(),
  identity_card_number: z.string().max(20).optional(),
  identity_card_issued_date: z.string().optional(),
  identity_card_issued_place: z.string().max(200).optional(),
  passport_number: z.string().max(20).optional(),
  passport_issued_date: z.string().optional(),
  passport_expired_date: z.string().optional(),
  passport_issued_place: z.string().max(200).optional(),
  tax_code: z.string().max(20).optional(),
  social_insurance_number: z.string().max(20).optional(),
  health_insurance_number: z.string().max(20).optional(),
  academic_level: z.string().max(100).optional(),
  certificate: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("personal_info")
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

    const validatedData = personalInfoSchema.parse(body);

    // Upsert personal info
    const { data, error } = await supabase
      .from("personal_info")
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
      message: "Personal information updated successfully",
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
