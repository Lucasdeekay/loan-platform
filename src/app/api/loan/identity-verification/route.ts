import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

const identitySchema = z.object({
  bvn: z.string().length(11, "BVN must be exactly 11 digits"),
  nin: z.string().length(11, "NIN must be exactly 11 digits"),
  facePhoto: z.string().min(1, "Face photo is required"),
  passportPhoto: z.string().optional(),
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
    const validation = identitySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { bvn, nin, facePhoto, passportPhoto, userId, loanId } =
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
        { error: "Loan not found. Please complete step 1 first." },
        { status: 404 }
      );
    }

    // Check if identity verification already exists
    const existingIdentity = await db.identityVerification.findUnique({
      where: { loanId: loan.id },
    });

    if (existingIdentity) {
      // Update existing identity verification
      await db.identityVerification.update({
        where: { id: existingIdentity.id },
        data: {
          bvn,
          nin,
          facePhotoUrl: facePhoto,
          passportUrl: passportPhoto || null,
        },
      });
    } else {
      // Create new identity verification
      await db.identityVerification.create({
        data: {
          loanId: loan.id,
          bvn,
          nin,
          facePhotoUrl: facePhoto,
          passportUrl: passportPhoto || null,
        },
      });
    }

    // Update user progress to step 3
    await db.user.update({
      where: { id: userId },
      data: { currentStep: 3 },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Identity verification saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Identity Verification Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
