import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Tier calculation helper based on total spend
function calculateTier(totalSpend: number): "GOLD" | "SILVER" | "BRONZE" {
  if (totalSpend > 15000) return "GOLD";
  if (totalSpend >= 5000) return "SILVER";
  return "BRONZE";
}

export async function GET() {
  try {
    // Fetch all users with their orders
    const users = await prisma.user.findMany({
      include: {
        orders: {
          where: {
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Transform data for frontend
    const usersData = users.map((user) => {
      // Calculate total spend from successful orders
      const totalSpend = user.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const tier = calculateTier(totalSpend);
      const totalOrders = user.orders.length;
      const lastOrderDate = user.orders.length > 0 ? user.orders[0].createdAt : null;

      return {
        id: user.id,
        name: user.name || "Unknown User",
        email: user.email,
        imageUrl: user.imageUrl || null,
        tier,
        totalSpend,
        totalOrders,
        lastOrderDate,
        createdAt: user.createdAt,
      };
    });

    return NextResponse.json({
      users: usersData,
      totalRecords: usersData.length,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer data" },
      { status: 500 }
    );
  }
}
