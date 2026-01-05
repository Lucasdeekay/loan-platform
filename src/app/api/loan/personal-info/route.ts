import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../../../lib/auth";
import db from "@/lib/db";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(10, "Please provide a complete address"),
  loanAmount: z.number().min(10000).max(5000000),
  userId: z.string(),
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
    const validation = personalInfoSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { fullName, email, phone, dateOfBirth, address, loanAmount, userId } =
      validation.data;

    // Verify user ID matches authenticated user
    if (userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update user personal information
    await db.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        address,
        currentStep: 2, // Move to next step
      },
    });

    // Calculate total repayment (principal + interest)
    const interestRate = 5.0; // 5% interest
    const totalRepayment = loanAmount + (loanAmount * interestRate) / 100;

    // Check if user has existing loan
    const existingLoan = await db.loan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (existingLoan) {
      // Update existing loan
      await db.loan.update({
        where: { id: existingLoan.id },
        data: {
          amount: loanAmount,
          interestRate,
          totalRepayment,
        },
      });
    } else {
      // Create new loan
      await db.loan.create({
        data: {
          userId,
          amount: loanAmount,
          interestRate,
          totalRepayment,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Personal information saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Personal Info Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
