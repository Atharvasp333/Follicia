import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30"; // days
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "7") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === "30") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (range === "month") {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    // Fetch orders with items for the date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Process revenue over time
    const revenueByDate = new Map<string, number>();
    const ordersByDate = new Map<string, number>();
    
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split("T")[0];
      revenueByDate.set(dateKey, (revenueByDate.get(dateKey) || 0) + order.totalAmount);
      ordersByDate.set(dateKey, (ordersByDate.get(dateKey) || 0) + 1);
    });

    // Generate time series data
    const days = range === "today" ? 1 : range === "7" ? 7 : range === "30" ? 30 : 30;
    const revenueTimeSeries = [];
    const orderTimeSeries = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];
      const displayDate = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      
      revenueTimeSeries.push({
        date: displayDate,
        amount: revenueByDate.get(dateKey) || 0,
      });
      
      orderTimeSeries.push({
        date: displayDate,
        count: ordersByDate.get(dateKey) || 0,
      });
    }

    // Calculate sales by category
    const categoryRevenue = new Map<string, number>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category || "Uncategorized";
        categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + (item.price * item.quantity));
      });
    });

    const totalRevenue = Array.from(categoryRevenue.values()).reduce((sum, val) => sum + val, 0);
    
    // Ensure all 4 main categories are present
    const allCategories = ["Treatments", "Scalp Care", "Cleansing", "Conditioning"];
    const salesByCategory = allCategories.map(category => {
      const revenue = categoryRevenue.get(category) || 0;
      return {
        name: category,
        value: revenue,
        percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0,
        color: getCategoryColor(category),
      };
    });

    // Calculate product-level metrics from database
    const productsWithStats = await prisma.product.findMany({
      where: {
        OR: [
          { viewsCount: { gt: 0 } },
          { addToCartCount: { gt: 0 } },
          { purchaseCount: { gt: 0 } },
        ],
      },
      select: {
        id: true,
        name: true,
        viewsCount: true,
        addToCartCount: true,
        purchaseCount: true,
        cancelCount: true,
      },
      orderBy: {
        purchaseCount: "desc",
      },
      take: 10,
    });

    const topProducts = productsWithStats.map(product => {
      const views = product.viewsCount || 0;
      const addToCart = product.addToCartCount || 0;
      const conversions = product.purchaseCount || 0;
      const cancellations = product.cancelCount || 0;
      
      // CONVERSION RATIO FIX: Calculate percentage safely
      const conversionRate = views > 0 ? Number(((conversions / views) * 100).toFixed(1)) : 0;
      
      return {
        name: product.name,
        views,
        addToCart,
        conversions,
        cancellations,
        conversionRate, // Add conversion rate to response
      };
    });

    // Summary stats
    const totalOrders = orders.length;
    const totalRevenueAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenueAmount / totalOrders : 0;

    return NextResponse.json({
      summary: {
        totalRevenue: totalRevenueAmount,
        totalOrders,
        avgOrderValue,
      },
      revenueTimeSeries,
      orderTimeSeries,
      salesByCategory,
      topProducts,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { 
        error: "Failed to fetch analytics",
        details: error instanceof Error ? error.message : "Unknown error",
        summary: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        revenueTimeSeries: [],
        orderTimeSeries: [],
        salesByCategory: [],
        topProducts: [],
      },
      { status: 500 }
    );
  }
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Treatments": "#0D3B44",
    "Scalp Care": "#2A9D8F",
    "Cleansing": "#7DD3C0",
    "Conditioning": "#9AABA5",
    "Uncategorized": "#E8EDEB",
  };
  return colors[category] || "#9AABA5";
}
