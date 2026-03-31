/**
 * Quick diagnostic script to check user points and coupons
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🔍 Checking user points and coupons...\n");

  // Check all users with their points
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      loyaltyPoints: true,
      firebaseUid: true,
    },
    orderBy: {
      loyaltyPoints: "desc",
    },
  });

  console.log("📊 Users with Points:");
  console.log("=".repeat(80));
  users.forEach((user) => {
    console.log(`${user.email?.padEnd(40)} | ${user.loyaltyPoints.toString().padStart(6)} points | ${user.name || "No name"}`);
  });
  console.log("=".repeat(80));
  console.log(`Total users: ${users.length}\n`);

  // Check reward coupons
  const coupons = await prisma.rewardCoupon.findMany({
    orderBy: { pointsRequired: "asc" },
  });

  console.log("🎁 Available Reward Coupons:");
  console.log("=".repeat(80));
  coupons.forEach((coupon) => {
    console.log(
      `${coupon.code.padEnd(15)} | ₹${coupon.discountAmount.toString().padStart(6)} off | ${coupon.pointsRequired.toString().padStart(6)} points | ${coupon.isActive ? "✅ Active" : "❌ Inactive"}`
    );
  });
  console.log("=".repeat(80));
  console.log(`Total coupons: ${coupons.length}\n`);

  // Check user coupons (redeemed)
  const userCoupons = await prisma.userCoupon.findMany({
    include: {
      user: {
        select: { email: true },
      },
      coupon: {
        select: { code: true, discountAmount: true },
      },
    },
  });

  console.log("🔓 Redeemed Coupons:");
  console.log("=".repeat(80));
  if (userCoupons.length === 0) {
    console.log("No coupons have been redeemed yet.");
  } else {
    userCoupons.forEach((uc) => {
      console.log(
        `${uc.user.email?.padEnd(40)} | ${uc.coupon.code.padEnd(15)} | ₹${uc.coupon.discountAmount} off | ${new Date(uc.redeemedAt).toLocaleDateString()}`
      );
    });
  }
  console.log("=".repeat(80));
  console.log(`Total redemptions: ${userCoupons.length}\n`);

  // Check specific user (atharvaspingale5@gmail.com)
  const specificUser = await prisma.user.findFirst({
    where: {
      email: "atharvaspingale5@gmail.com",
    },
    include: {
      redeemedCoupons: {
        include: {
          coupon: true,
        },
      },
      loyaltyTransactions: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (specificUser) {
    console.log("👤 Specific User Check (atharvaspingale5@gmail.com):");
    console.log("=".repeat(80));
    console.log(`Email: ${specificUser.email}`);
    console.log(`Name: ${specificUser.name}`);
    console.log(`Firebase UID: ${specificUser.firebaseUid}`);
    console.log(`Loyalty Points: ${specificUser.loyaltyPoints}`);
    console.log(`Redeemed Coupons: ${specificUser.redeemedCoupons.length}`);
    console.log(`Recent Transactions: ${specificUser.loyaltyTransactions.length}`);
    
    if (specificUser.redeemedCoupons.length > 0) {
      console.log("\nRedeemed Coupons:");
      specificUser.redeemedCoupons.forEach((rc) => {
        console.log(`  - ${rc.coupon.code}: ₹${rc.coupon.discountAmount} off`);
      });
    }
    
    if (specificUser.loyaltyTransactions.length > 0) {
      console.log("\nRecent Transactions:");
      specificUser.loyaltyTransactions.forEach((tx) => {
        console.log(`  - ${tx.type}: ${tx.amount > 0 ? "+" : ""}${tx.amount} points - ${tx.description}`);
      });
    }
    console.log("=".repeat(80));
  } else {
    console.log("⚠️  User atharvaspingale5@gmail.com not found in database");
  }

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
