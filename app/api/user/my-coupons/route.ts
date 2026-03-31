import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/my-coupons?userId=xxx
 * Get user's redeemed coupons (unlocked rewards)
 */
export async function GET(req: NextRequest) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        loyaltyPoints: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's redeemed coupons
    const userCoupons = await prisma.userCoupon.findMany({
      where: { userId: user.id },
      include: {
        coupon: true,
      },
      orderBy: {
        redeemedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      coupons: userCoupons.map((uc) => ({
        id: uc.coupon.id,
        code: uc.coupon.code,
        discountAmount: uc.coupon.discountAmount,
        pointsRequired: uc.coupon.pointsRequired,
        redeemedAt: uc.redeemedAt,
      })),
      userPoints: user.loyaltyPoints,
    });
  } catch (error) {
    console.error("❌ Get my coupons error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch coupons",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
