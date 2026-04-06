import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all users with their orders and quiz results
    const users = await prisma.user.findMany({
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 1, // Only need the most recent order
        },
        quizResults: {
          orderBy: { createdAt: "desc" },
          take: 1, // Only need the most recent quiz result
        },
      },
    });

    const now = new Date();

    // Calculate churn risk for each user
    const churnAnalysis = users.map((user) => {
      const lastOrder = user.orders[0];
      const daysSinceLastPurchase = lastOrder
        ? Math.floor((now.getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : null;

      let status: "active" | "at-risk" | "churned" | "new";
      if (!lastOrder) {
        status = "new";
      } else if (daysSinceLastPurchase! < 30) {
        status = "active";
      } else if (daysSinceLastPurchase! <= 60) {
        status = "at-risk";
      } else {
        status = "churned";
      }

      return {
        id: user.id,
        name: user.name || "Anonymous",
        email: user.email,
        status,
        daysSinceLastPurchase,
        lastPurchaseDate: lastOrder?.createdAt || null,
        loyaltyPoints: user.loyaltyPoints,
        // Include hair profile data for filtering
        scalpCondition: user.scalpCondition,
        porosity: user.porosity,
        hairType: user.hairType,
      };
    });

    // Hair DNA Segmentation
    const hairDnaSegmentation = {
      scalpTypes: {} as Record<string, number>,
      porosityLevels: {} as Record<string, number>,
      hairTypes: {} as Record<string, number>,
    };

    users.forEach((user) => {
      const latestQuiz = user.quizResults[0];
      
      // Count scalp conditions
      if (user.scalpCondition) {
        hairDnaSegmentation.scalpTypes[user.scalpCondition] = 
          (hairDnaSegmentation.scalpTypes[user.scalpCondition] || 0) + 1;
      }

      // Count porosity levels
      if (user.porosity) {
        hairDnaSegmentation.porosityLevels[user.porosity] = 
          (hairDnaSegmentation.porosityLevels[user.porosity] || 0) + 1;
      }

      // Count hair types
      if (user.hairType) {
        hairDnaSegmentation.hairTypes[user.hairType] = 
          (hairDnaSegmentation.hairTypes[user.hairType] || 0) + 1;
      }
    });

    // Churn statistics
    const churnStats = {
      active: churnAnalysis.filter((u) => u.status === "active").length,
      atRisk: churnAnalysis.filter((u) => u.status === "at-risk").length,
      churned: churnAnalysis.filter((u) => u.status === "churned").length,
      new: churnAnalysis.filter((u) => u.status === "new").length,
    };

    return NextResponse.json({
      hairDnaSegmentation,
      churnAnalysis: churnAnalysis.slice(0, 50), // Limit to 50 for performance
      churnStats,
      totalUsers: users.length,
    });
  } catch (error) {
    console.error("CRM Intelligence API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch CRM intelligence data" },
      { status: 500 }
    );
  }
}
