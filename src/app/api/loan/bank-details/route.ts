import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

const bankDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .length(10, "Account number must be exactly 10 digits"),
  accountName: z.string().min(2, "Account name is required"),
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
    const validation = bankDetailsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { bankName, accountNumber, accountName, userId, loanId } =
      validation.data;

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

    // Check if bank details already exist
    const existingBankDetails = await db.bankDetails.findUnique({
      where: { loanId: loan.id },
    });

    if (existingBankDetails) {
      // Update existing bank details
      await db.bankDetails.update({
        where: { id: existingBankDetails.id },
        data: {
          bankName,
          accountNumber,
          accountName,
        },
      });
    } else {
      // Create new bank details
      await db.bankDetails.create({
        data: {
          loanId: loan.id,
          bankName,
          accountNumber,
          accountName,
        },
      });
    }

    // Update user progress to step 5 (review)
    await db.user.update({
      where: { id: userId },
      data: { currentStep: 5 },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bank details saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Bank Details Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
