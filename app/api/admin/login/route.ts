import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  setAdminCookie,
} from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminId, password } = body;

    // Validate input
    if (!adminId || !password) {
      return NextResponse.json(
        { error: "Admin ID and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = verifyAdminCredentials(adminId, password);

    if (!isValid) {
      console.log("🚫 Invalid admin login attempt:", adminId);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    await setAdminCookie(adminId);

    console.log("✅ Admin logged in successfully:", adminId);

    return NextResponse.json(
      {
        success: true,
        message: "Authentication successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
