import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

const guarantorSchema = z.object({
  fullName: z.string().min(2, "Guarantor full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Please provide a complete address"),
  relationship: z.string().min(2, "Relationship is required"),
  guarantorPhoto: z.string().min(1, "Guarantor photo is required"),
  userId: z.string(),
  loanId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validation = guarantorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      fullName,
      phone,
      address,
      relationship,
      guarantorPhoto,
      userId,
      loanId,
    } = validation.data;

    // Verify user ID matches authenticated user
    if (userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get or create loan
    let loan;
    if (loanId) {
      loan = await db.loan.findUnique({
        where: { id: loanId },
      });
    } else {
      loan = await db.loan.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!loan) {
      return NextResponse.json(
        { error: "Loan not found. Please complete previous steps first." },
        { status: 404 }
      );
    }

    // Check if guarantor already exists
    const existingGuarantor = await db.guarantor.findUnique({
      where: { loanId: loan.id },
    });

    if (existingGuarantor) {
      // Update existing guarantor
      await db.guarantor.update({
        where: { id: existingGuarantor.id },
        data: {
          fullName,
          phone,
          address,
          relationship,
          photoUrl: guarantorPhoto,
        },
      });
    } else {
      // Create new guarantor
      await db.guarantor.create({
        data: {
          loanId: loan.id,
          fullName,
          phone,
          address,
          relationship,
          photoUrl: guarantorPhoto,
        },
      });
    }

    // Update user progress to step 4
    await db.user.update({
      where: { id: userId },
      data: { currentStep: 4 },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Guarantor information saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Guarantor Info Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
