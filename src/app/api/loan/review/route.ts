import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const loanId = searchParams.get("loanId");

    // Verify user ID matches authenticated user
    if (userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get user data
    const userData = await db.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get loan with all related data
    let loan;
    if (loanId && loanId !== "null" && loanId !== "undefined") {
      loan = await db.loan.findUnique({
        where: { id: loanId },
        include: {
          identityVerification: true,
          guarantor: true,
          bankDetails: true,
        },
      });
    } else {
      loan = await db.loan.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          identityVerification: true,
          guarantor: true,
          bankDetails: true,
        },
      });
    }

    if (!loan) {
      return NextResponse.json(
        {
          error: "Loan application not found. Please complete previous steps.",
        },
        { status: 404 }
      );
    }

    // Check if all required data exists
    if (!loan.identityVerification) {
      return NextResponse.json(
        {
          error: "Identity verification not completed. Please complete step 2.",
        },
        { status: 400 }
      );
    }

    if (!loan.guarantor) {
      return NextResponse.json(
        {
          error: "Guarantor information not provided. Please complete step 3.",
        },
        { status: 400 }
      );
    }

    if (!loan.bankDetails) {
      return NextResponse.json(
        { error: "Bank details not provided. Please complete step 4." },
        { status: 400 }
      );
    }

    // Compile all data for review
    const reviewData = {
      user: {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        address: userData.address,
      },
      loan: {
        amount: loan.amount,
        interestRate: loan.interestRate,
        totalRepayment: loan.totalRepayment,
      },
      identity: {
        bvn: loan.identityVerification.bvn,
        nin: loan.identityVerification.nin,
        facePhotoUrl: loan.identityVerification.facePhotoUrl,
        passportUrl: loan.identityVerification.passportUrl,
      },
      guarantor: {
        fullName: loan.guarantor.fullName,
        phone: loan.guarantor.phone,
        address: loan.guarantor.address,
        relationship: loan.guarantor.relationship,
        photoUrl: loan.guarantor.photoUrl,
      },
      bankDetails: {
        bankName: loan.bankDetails.bankName,
        accountNumber: loan.bankDetails.accountNumber,
        accountName: loan.bankDetails.accountName,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: reviewData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Review Data Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
