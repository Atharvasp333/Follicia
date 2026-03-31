/**
 * One-time migration script to backfill loyalty points for existing users
 * based on their past successful orders.
 * 
 * Formula: Math.floor(totalAmount / 10) points per order
 * Only counts orders with status: PAID, SHIPPED, or DELIVERED
 * 
 * Usage: npm run seed:loyalty-points
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🚀 Starting loyalty points backfill...\n");

  try {
    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        loyaltyPoints: true,
      },
    });

    console.log(`📊 Found ${users.length} users\n`);

    let totalUsersUpdated = 0;
    let totalPointsAwarded = 0;

    for (const user of users) {
      console.log(`\n👤 Processing user: ${user.email} (${user.name || "No name"})`);
      console.log(`   Current points: ${user.loyaltyPoints}`);

      // Fetch all successful orders for this user
      const orders = await prisma.order.findMany({
        where: {
          userId: user.id,
          status: {
            in: ["PAID", "SHIPPED", "DELIVERED"],
          },
        },
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (orders.length === 0) {
        console.log(`   ⚠️  No successful orders found`);
        continue;
      }

      console.log(`   📦 Found ${orders.length} successful order(s)`);

      // Calculate total points from all orders
      let pointsToAward = 0;
      const transactions: Array<{
        orderId: string;
        amount: number;
        points: number;
      }> = [];

      for (const order of orders) {
        const points = Math.floor(order.totalAmount / 10);
        pointsToAward += points;
        transactions.push({
          orderId: order.id,
          amount: order.totalAmount,
          points,
        });

        console.log(
          `      Order ${order.id.slice(-8)}: ₹${order.totalAmount.toFixed(2)} → ${points} points (${order.status})`
        );
      }

      if (pointsToAward === 0) {
        console.log(`   ⚠️  No points to award (order amounts too small)`);
        continue;
      }

      // Check if user already has loyalty transactions (to avoid duplicates)
      const existingTransactions = await prisma.loyaltyTransaction.findMany({
        where: {
          userId: user.id,
          type: "EARNED",
        },
      });

      if (existingTransactions.length > 0) {
        console.log(
          `   ⚠️  User already has ${existingTransactions.length} loyalty transaction(s) - skipping to avoid duplicates`
        );
        continue;
      }

      // Create loyalty transactions and update user points in a transaction
      await prisma.$transaction(
        async (tx) => {
          // Batch create all transaction records at once
          const transactionData = transactions
            .filter((trans) => trans.points > 0)
            .map((trans) => ({
              userId: user.id,
              amount: trans.points,
              type: "EARNED" as const,
              description: `Backfilled: Earned from order #${trans.orderId.slice(-8).toUpperCase()}`,
            }));

          if (transactionData.length > 0) {
            await tx.loyaltyTransaction.createMany({
              data: transactionData,
            });
          }

          // Update user's total loyalty points
          await tx.user.update({
            where: { id: user.id },
            data: {
              loyaltyPoints: {
                increment: pointsToAward,
              },
            },
          });
        },
        {
          maxWait: 10000, // 10 seconds max wait
          timeout: 30000, // 30 seconds timeout
        }
      );

      console.log(`   ✅ Awarded ${pointsToAward} loyalty points`);
      console.log(`   📈 New total: ${user.loyaltyPoints + pointsToAward} points`);

      totalUsersUpdated++;
      totalPointsAwarded += pointsToAward;
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Loyalty points backfill complete!");
    console.log("=".repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   Total users processed: ${users.length}`);
    console.log(`   Users updated: ${totalUsersUpdated}`);
    console.log(`   Total points awarded: ${totalPointsAwarded}`);
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("\n❌ Error during loyalty points backfill:");
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
