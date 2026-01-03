import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import { createDedicatedVirtualAccount } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data
    const userData = await db.user.findUnique({
      where: { id: user.userId },
      include: { wallet: true },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if wallet already has virtual account
    if (userData.wallet?.accountNumber) {
      return NextResponse.json(
        {
          success: true,
          message: "Virtual account already exists",
          wallet: userData.wallet,
        },
        { status: 200 }
      );
    }

    // Parse name
    const fullName = userData.fullName || "User Name";
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0];
    const lastName =
      nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

    // Create Paystack Dedicated Virtual Account
    const result = await createDedicatedVirtualAccount(
      userData.email,
      firstName,
      lastName,
      userData.phone || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create virtual account" },
        { status: 500 }
      );
    }

    // Update wallet with virtual account details
    const updatedWallet = await db.wallet.update({
      where: { userId: user.userId },
      data: {
        accountNumber: result.data!.accountNumber,
        accountName: result.data!.accountName,
        bankName: result.data!.bankName,
        accountReference: result.data!.accountReference,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Virtual account created successfully",
        wallet: updatedWallet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Wallet Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
