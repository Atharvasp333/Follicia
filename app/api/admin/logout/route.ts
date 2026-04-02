import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export async function POST() {
  try {
    // Clear admin session cookie
    await clearAdminCookie();

    console.log("✅ Admin logged out successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Admin logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
