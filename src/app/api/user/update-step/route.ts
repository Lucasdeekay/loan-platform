import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "../../../../lib/auth";
import db from "@/lib/db";

const updateStepSchema = z.object({
  step: z.number().min(1).max(5),
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
    const validation = updateStepSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { step } = validation.data;

    // Update user's current step
    await db.user.update({
      where: { id: user.userId },
      data: { currentStep: step },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Step updated successfully",
        currentStep: step,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Step Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
