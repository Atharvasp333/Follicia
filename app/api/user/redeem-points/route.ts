import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redeemLoyaltyPoints } from "@/lib/loyalty";

/**
 * POST /api/user/redeem-points
 * Redeem loyalty points for a reward coupon
 * 
 * Body: { couponId: string, userId: string }
 * 
 * Returns: {
 *   success: boolean,
 *   couponCode: string,
 *   discountAmount: number,
 *   pointsRedeemed: number,
 *   remainingPoints: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Get request body
    const body = await req.json();
    const { couponId, userId } = body;

    if (!couponId || !userId) {
      return NextResponse.json(
        { error: "Coupon ID and User ID are required" },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        loyaltyPoints: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Attempt to redeem points
    const result = await redeemLoyaltyPoints(user.id, couponId);

    return NextResponse.json({
      success: true,
      couponCode: result.couponCode,
      discountAmount: result.discountAmount,
      pointsRedeemed: result.pointsRedeemed,
      remainingPoints: result.remainingPoints,
      message: `Successfully redeemed ${result.pointsRedeemed} points for coupon ${result.couponCode}`,
    });
  } catch (error) {
    console.error("❌ Redeem points error:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Insufficient points")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes("already redeemed")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
      if (error.message.includes("no longer active")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      if (error.message.includes("cannot be negative")) {
        return NextResponse.json(
          { error: "Invalid operation: Points cannot be negative" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to redeem points",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/redeem-points?userId=xxx
 * Get available reward coupons and user's current points
 */
export async function GET(req: NextRequest) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("🔍 GET /api/user/redeem-points - User ID:", userId);

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
        email: true,
        loyaltyPoints: true,
      },
    });

    console.log("👤 Found user:", user ? `${user.email} (${user.loyaltyPoints} points)` : "NOT FOUND");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get all active reward coupons
    const coupons = await prisma.rewardCoupon.findMany({
      where: { isActive: true },
      orderBy: { pointsRequired: "asc" },
    });

    // Get user's redeemed coupons
    const redeemedCoupons = await prisma.userCoupon.findMany({
      where: { userId: user.id },
      select: { couponId: true, redeemedAt: true },
    });

    const redeemedCouponIds = new Set(redeemedCoupons.map(uc => uc.couponId));

    // Get user's recent transactions
    const recentTransactions = await prisma.loyaltyTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      userPoints: user.loyaltyPoints,
      availableCoupons: coupons.map((coupon) => ({
        id: coupon.id,
        code: coupon.code,
        discountAmount: coupon.discountAmount,
        pointsRequired: coupon.pointsRequired,
        canAfford: user.loyaltyPoints >= coupon.pointsRequired,
        isRedeemed: redeemedCouponIds.has(coupon.id),
        redeemedAt: redeemedCoupons.find(rc => rc.couponId === coupon.id)?.redeemedAt,
      })),
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        createdAt: tx.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Get rewards error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch rewards",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
