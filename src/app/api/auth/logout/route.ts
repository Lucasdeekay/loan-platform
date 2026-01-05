import { NextRequest, NextResponse } from "next/server";
import { removeAuthCookie } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    await removeAuthCookie();

    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
