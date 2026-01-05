import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mark application as complete
    await db.user.update({
      where: { id: user.userId },
      data: {
        applicationComplete: true,
        currentStep: 5, // Ensure step is at final stage
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete Application Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
