import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get last 30 days date range
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Use Promise.all for parallel fetching
    const [
      revenueData,
      totalUsers,
      successfulOrders,
      criticalStockCount,
      orders,
      usersByHairType,
      usersByPlan,
      atRiskProducts,
      topRegions,
    ] = await Promise.all([
      // 1. Revenue Insight - PAID orders only (current month)
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
          status: "PAID",
        },
        _sum: { totalAmount: true },
      }),
      
      // 2. Active Users - Unique count
      prisma.user.count(),
      
      // 3. Order Volume - Successful transactions
      prisma.order.count({
        where: {
          status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
      }),
      
      // 4. Critical Stock - Products with stock <= 0
      prisma.product.count({
        where: { stock: { lte: 0 } },
      }),
      
      // 5. Sales Velocity - Last 30 days
      prisma.order.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
        select: { createdAt: true, totalAmount: true },
      }),
      
      // 6. Biological Distribution
      prisma.user.groupBy({
        by: ["hairType"],
        _count: { id: true },
        where: { hairType: { not: null } },
      }),
      
      // 6b. Membership Tier Distribution
      prisma.user.groupBy({
        by: ["plan"],
        _count: { id: true },
      }),
      
      // 7. At-Risk Inventory
      prisma.product.findMany({
        where: {
          OR: [
            { stock: { lte: 0 } },
            { stock: { lt: 5, gt: 0 } },
          ],
        },
        select: { id: true, name: true, stock: true, lowStockThreshold: true },
        orderBy: { stock: "asc" },
        take: 5,
      }),
      
      // 8. Top Purchasing Regions
      prisma.order.groupBy({
        by: ["shippingCity"],
        _count: { id: true },
        where: {
          shippingCity: { not: null },
          status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
        orderBy: { _count: { id: "desc" } },
        take: 3,
      }),
    ]);

    // Process revenue data
    const currentRevenue = revenueData._sum.totalAmount || 0;

    // Process sales velocity data
    const salesByDate = new Map<string, number>();
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split("T")[0];
      salesByDate.set(date, (salesByDate.get(date) || 0) + order.totalAmount);
    });

    const salesVelocityData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];
      const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      
      return {
        date: monthDay,
        amount: salesByDate.get(dateStr) || 0,
      };
    });

    // Process biological distribution
    const hairTypeMapping: Record<string, string> = {
      "1": "Straight",
      "2": "Wavy",
      "3": "Curly",
      "4": "Coily",
      straight: "Straight",
      wavy: "Wavy",
      curly: "Curly",
      coily: "Coily",
    };

    const hairTypeDistribution = usersByHairType
      .filter(u => u.hairType && hairTypeMapping[u.hairType])
      .map(u => ({
        name: hairTypeMapping[u.hairType as string],
        value: u._count.id,
      }));

    const biologicalDistribution = [
      {
        name: "Type 1 (Straight)",
        value: usersByHairType.find(u => u.hairType === "1" || u.hairType === "straight")?._count.id || 0,
        color: "#0D3B44",
      },
      {
        name: "Type 2 (Wavy)",
        value: usersByHairType.find(u => u.hairType === "2" || u.hairType === "wavy")?._count.id || 0,
        color: "#7DD3C0",
      },
      {
        name: "Type 3 (Curly)",
        value: usersByHairType.find(u => u.hairType === "3" || u.hairType === "curly")?._count.id || 0,
        color: "#9AABA5",
      },
      {
        name: "Type 4 (Coily)",
        value: usersByHairType.find(u => u.hairType === "4" || u.hairType === "coily")?._count.id || 0,
        color: "#2A9D8F",
      },
    ];

    const totalProfiles = biologicalDistribution.reduce((sum, b) => sum + b.value, 0);
    const biologicalDistributionWithPercent = biologicalDistribution.map(b => ({
      ...b,
      percentage: totalProfiles > 0 ? Math.round((b.value / totalProfiles) * 100) : 0,
    }));

    // Process membership tier distribution
    const membershipDistribution = [
      {
        name: "Gold",
        value: usersByPlan.find(u => u.plan === "gold")?._count.id || 0,
        color: "#FFD700",
      },
      {
        name: "Silver",
        value: usersByPlan.find(u => u.plan === "silver")?._count.id || 0,
        color: "#C0C0C0",
      },
      {
        name: "Bronze",
        value: usersByPlan.find(u => u.plan === "bronze")?._count.id || 0,
        color: "#CD7F32",
      },
      {
        name: "No Plan",
        value: usersByPlan.find(u => u.plan === null)?._count.id || 0,
        color: "#E8EDEB",
      },
    ];

    const totalMembers = membershipDistribution.reduce((sum, m) => sum + m.value, 0);
    const membershipDistributionWithPercent = membershipDistribution.map(m => ({
      ...m,
      percentage: totalMembers > 0 ? Math.round((m.value / totalMembers) * 100) : 0,
    }));

    // Calculate average daily sales for depletion forecast
    const avgDailySales = orders.length > 0 ? orders.length / 30 : 0;

    return NextResponse.json({
      revenue: {
        total: currentRevenue,
        formatted: `₹${Math.round(currentRevenue / 1000).toLocaleString("en-IN")}k`,
      },
      activeUsers: totalUsers || 0,
      orderVolume: successfulOrders || 0,
      criticalStock: {
        count: criticalStockCount || 0,
      },
      salesVelocity: salesVelocityData,
      hairTypeDistribution,
      biologicalDistribution: biologicalDistributionWithPercent,
      membershipDistribution: membershipDistributionWithPercent,
      atRiskProducts: atRiskProducts.map(p => {
        const depletionDays = avgDailySales > 0 ? Math.ceil(p.stock / avgDailySales) : null;
        return {
          id: p.id,
          name: p.name,
          stock: p.stock,
          riskLevel: p.stock <= 0 ? "CRITICAL" : p.stock < 3 ? "HIGH" : "MEDIUM",
          depletionForecast: p.stock <= 0 ? "Restock Required" : depletionDays ? `${depletionDays} days` : "Stable",
        };
      }),
      topRegions: topRegions.map(r => ({
        city: r.shippingCity || "Unknown",
        orders: r._count.id,
      })),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    // Return partial data with 0 values instead of crashing
    return NextResponse.json({
      revenue: { total: 0, formatted: "₹0k" },
      activeUsers: 0,
      orderVolume: 0,
      criticalStock: { count: 0 },
      salesVelocity: [],
      hairTypeDistribution: [],
      biologicalDistribution: [],
      membershipDistribution: [],
      atRiskProducts: [],
      topRegions: [],
      error: "Partial data loaded due to database error",
    });
  }
}


