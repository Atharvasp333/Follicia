import { prisma } from "./prisma";

/**
 * Award loyalty points to a user for a completed order
 * Points are calculated as: Math.floor(totalAmount / 10)
 * Creates a transaction record and updates user's total points
 */
export async function awardLoyaltyPoints(
  userId: string,
  orderId: string,
  totalAmount: number
) {
  const pointsEarned = Math.floor(totalAmount / 10);

  if (pointsEarned <= 0) {
    console.log("⚠️ No loyalty points to award (amount too small)");
    return { pointsEarned: 0 };
  }

  try {
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create loyalty transaction record
      const transaction = await tx.loyaltyTransaction.create({
        data: {
          userId,
          amount: pointsEarned,
          type: "EARNED",
          description: `Earned from order #${orderId.slice(-8).toUpperCase()}`,
        },
      });

      // Update user's total loyalty points
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: {
            increment: pointsEarned,
          },
        },
        select: {
          id: true,
          loyaltyPoints: true,
        },
      });

      return { transaction, updatedUser };
    });

    console.log(
      `✅ Awarded ${pointsEarned} loyalty points to user ${userId} (Total: ${result.updatedUser.loyaltyPoints})`
    );

    return {
      pointsEarned,
      totalPoints: result.updatedUser.loyaltyPoints,
      transactionId: result.transaction.id,
    };
  } catch (error) {
    console.error("❌ Failed to award loyalty points:", error);
    throw error;
  }
}

/**
 * Redeem loyalty points for a reward coupon
 * Validates user has enough points and coupon is available
 * Creates a REDEEMED transaction, deducts points, and links coupon to user
 */
export async function redeemLoyaltyPoints(
  userId: string,
  couponId: string
) {
  try {
    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Fetch user's current points
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, loyaltyPoints: true, email: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Fetch the reward coupon
      const coupon = await tx.rewardCoupon.findUnique({
        where: { id: couponId },
      });

      if (!coupon) {
        throw new Error("Reward coupon not found");
      }

      if (!coupon.isActive) {
        throw new Error("This reward coupon is no longer active");
      }

      // Check if user already redeemed this coupon
      const existingRedemption = await tx.userCoupon.findUnique({
        where: {
          userId_couponId: {
            userId,
            couponId,
          },
        },
      });

      if (existingRedemption) {
        throw new Error("You have already redeemed this coupon");
      }

      // Validate user has enough points
      if (user.loyaltyPoints < coupon.pointsRequired) {
        throw new Error(
          `Insufficient points. You have ${user.loyaltyPoints} points but need ${coupon.pointsRequired} points`
        );
      }

      // Create REDEEMED transaction (negative amount)
      const transaction = await tx.loyaltyTransaction.create({
        data: {
          userId,
          amount: -coupon.pointsRequired,
          type: "REDEEMED",
          description: `Redeemed coupon: ${coupon.code} (₹${coupon.discountAmount} off)`,
        },
      });

      // Deduct points from user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          loyaltyPoints: {
            decrement: coupon.pointsRequired,
          },
        },
        select: {
          id: true,
          loyaltyPoints: true,
        },
      });

      // Ensure points never go negative (safety check)
      if (updatedUser.loyaltyPoints < 0) {
        throw new Error("Points cannot be negative");
      }

      // Link coupon to user
      const userCoupon = await tx.userCoupon.create({
        data: {
          userId,
          couponId,
        },
      });

      return { transaction, updatedUser, coupon, userCoupon };
    });

    console.log(
      `✅ User ${userId} redeemed ${result.coupon.pointsRequired} points for coupon ${result.coupon.code}`
    );

    return {
      success: true,
      couponCode: result.coupon.code,
      discountAmount: result.coupon.discountAmount,
      pointsRedeemed: result.coupon.pointsRequired,
      remainingPoints: result.updatedUser.loyaltyPoints,
      transactionId: result.transaction.id,
      userCouponId: result.userCoupon.id,
    };
  } catch (error) {
    console.error("❌ Failed to redeem loyalty points:", error);
    throw error;
  }
}
