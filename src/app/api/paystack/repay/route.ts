import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { initializeTransaction } from "@/lib/paystack";

const repaySchema = z.object({
  loanId: z.string().min(1, "Loan ID is required"),
  amount: z.number().positive("Amount must be positive"),
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
    const validation = repaySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { loanId, amount } = validation.data;

    // Get loan and verify ownership
    const loan = await db.loan.findUnique({
      where: { id: loanId },
      include: { user: true },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    if (loan.userId !== user.userId) {
      return NextResponse.json(
        { error: "Unauthorized to repay this loan" },
        { status: 403 }
      );
    }

    if (loan.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Loan is not approved for repayment" },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `repay_${loanId}_${Date.now()}`;

    // Create repayment record
    await db.repayment.create({
      data: {
        loanId,
        amount,
        transactionRef: reference,
        status: "PENDING",
      },
    });

    // Create transaction record
    await db.transaction.create({
      data: {
        userId: user.userId,
        type: "REPAYMENT",
        amount,
        reference,
        status: "PENDING",
      },
    });

    // Initialize Paystack transaction
    const amountInKobo = Math.round(amount * 100); // Convert to kobo
    const result = await initializeTransaction(
      loan.user.email,
      amountInKobo,
      reference,
      {
        loanId,
        userId: user.userId,
        type: "repayment",
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to initialize payment" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment initialized successfully",
        data: {
          authorizationUrl: result.data!.authorizationUrl,
          reference: result.data!.reference,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Repayment Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
