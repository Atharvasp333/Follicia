import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, couponType } = body;

    if (!userId || !couponType) {
      return NextResponse.json(
        { error: "Missing userId or couponType" },
        { status: 400 }
      );
    }

    // Generate unique promo code
    const promoCode = `WINBACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Map coupon type to discount amount
    const discountMap: Record<string, number> = {
      "50": 50,
      "100": 100,
      "250": 250,
      "20_percent": 20, // Store as percentage value
      "free_shipping": 0, // Special case
    };

    const discountAmount = discountMap[couponType] || 100;

    // Create coupon in database
    const coupon = await prisma.rewardCoupon.create({
      data: {
        code: promoCode,
        discountAmount,
        pointsRequired: 0, // Gift coupons don't require points
        isActive: true,
      },
    });

    // Link coupon to user
    await prisma.userCoupon.create({
      data: {
        userId,
        couponId: coupon.id,
      },
    });

    // TODO: Send email notification to user with coupon code
    // This would integrate with your email service

    return NextResponse.json({
      success: true,
      promoCode,
      message: `Coupon ${promoCode} created and sent to user`,
    });
  } catch (error) {
    console.error("Gift Coupon API Error:", error);
    return NextResponse.json(
      { error: "Failed to create gift coupon" },
      { status: 500 }
    );
  }
}
