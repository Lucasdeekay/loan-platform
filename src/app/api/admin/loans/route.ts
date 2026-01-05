import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const loanId = formData.get("loanId") as string;
    const action = formData.get("action") as string;

    if (!loanId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate action
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get loan
    const loan = await db.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    // Check if loan is pending
    if (loan.status !== "PENDING") {
      return NextResponse.json(
        { error: "Loan is not pending" },
        { status: 400 }
      );
    }

    // Update loan status
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const updateData: any = {
      status: newStatus,
    };

    // If approving, set approval date and due date (30 days from now)
    if (action === "approve") {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days repayment period

      updateData.approvalDate = new Date();
      updateData.dueDate = dueDate;
    }

    await db.loan.update({
      where: { id: loanId },
      data: updateData,
    });

    // Redirect back to admin page with success message
    return NextResponse.redirect(new URL("/admin?success=true", request.url));
  } catch (error) {
    console.error("Admin Loan Action Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch loan details (for detail page)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get("loanId");

    if (!loanId) {
      return NextResponse.json(
        { error: "Loan ID is required" },
        { status: 400 }
      );
    }

    // Fetch loan with all related data
    const loan = await db.loan.findUnique({
      where: { id: loanId },
      include: {
        user: true,
        identityVerification: true,
        guarantor: true,
        bankDetails: true,
        repayments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = loan.user;

    return NextResponse.json(
      {
        success: true,
        loan: {
          ...loan,
          user: userWithoutPassword,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Loan Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
