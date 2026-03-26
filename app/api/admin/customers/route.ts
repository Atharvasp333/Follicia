import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Map plan string to tier display
function mapPlanToTier(plan: string | null): "GOLD" | "SILVER" | "BRONZE" | "NONE" {
  if (!plan) return "NONE";
  const planUpper = plan.toUpperCase();
  if (planUpper === "GOLD") return "GOLD";
  if (planUpper === "SILVER") return "SILVER";
  if (planUpper === "BRONZE") return "BRONZE";
  return "NONE";
}

export async function GET() {
  try {
    console.log('📊 Fetching customers...');
    
    // Fetch all users with their orders
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true,
        plan: true,
        planName: true,
        createdAt: true,
        orders: {
          where: {
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            totalAmount: true,
            createdAt: true,
          },
        },
      },
    });

    console.log(`✅ Found ${users.length} users`);

    // Transform data for frontend
    const usersData = users.map((user) => {
      // Calculate total spend from successful orders
      const totalSpend = user.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Use actual plan from database (no fallback calculation)
      const tier = mapPlanToTier(user.plan);
      
      const totalOrders = user.orders.length;
      const lastOrderDate = user.orders.length > 0 ? user.orders[0].createdAt : null;

      return {
        id: user.id,
        name: user.name || "Unknown User",
        email: user.email,
        imageUrl: user.imageUrl || null,
        tier,
        plan: user.plan,
        planName: user.planName,
        totalSpend,
        totalOrders,
        lastOrderDate,
        createdAt: user.createdAt,
      };
    });

    console.log('✅ Users data transformed successfully');

    return NextResponse.json({
      users: usersData,
      totalRecords: usersData.length,
    });
  } catch (error: any) {
    console.error("❌ Error fetching customers:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: "Failed to fetch customer data", details: error.message },
      { status: 500 }
    );
  }
}
