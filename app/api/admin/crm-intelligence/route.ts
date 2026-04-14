import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all users with their orders and quiz results
    const users = await prisma.user.findMany({
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
        quizResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
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
      if (user.scalpCondition) {
        hairDnaSegmentation.scalpTypes[user.scalpCondition] = 
          (hairDnaSegmentation.scalpTypes[user.scalpCondition] || 0) + 1;
      }
      if (user.porosity) {
        hairDnaSegmentation.porosityLevels[user.porosity] = 
          (hairDnaSegmentation.porosityLevels[user.porosity] || 0) + 1;
      }
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

    // Membership Distribution
    const membershipDistribution = {
      bronze: users.filter(u => u.plan?.toLowerCase() === "bronze").length,
      silver: users.filter(u => u.plan?.toLowerCase() === "silver").length,
      gold: users.filter(u => u.plan?.toLowerCase() === "gold").length,
      none: users.filter(u => !u.plan).length,
    };

    // Onboarding Trend (last 12 months)
    const onboardingTrend = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = users.filter(u => {
        const created = new Date(u.createdAt);
        return created >= monthStart && created <= monthEnd;
      }).length;
      
      onboardingTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        count,
      });
    }

    // Churn vs Retention Trend (last 6 months)
    const churnRetentionTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const prevMonthStart = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
      
      let retained = 0;
      let churned = 0;
      
      users.forEach(user => {
        const currentMonthOrders = user.orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd;
        });
        
        const prevMonthOrders = user.orders.filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate >= prevMonthStart && orderDate <= prevMonthEnd;
        });
        
        if (prevMonthOrders.length > 0) {
          if (currentMonthOrders.length > 0) {
            retained++;
          } else {
            churned++;
          }
        }
      });
      
      churnRetentionTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        retained,
        churned,
      });
    }

    // CLV Data
    const usersWithOrders = users.filter(u => u.orders.length > 0);
    const totalSpent = usersWithOrders.reduce((sum, u) => 
      sum + u.orders.reduce((orderSum, o) => orderSum + o.totalAmount, 0), 0
    );
    const averageCLV = usersWithOrders.length > 0 ? totalSpent / usersWithOrders.length : 0;
    
    const topCustomer = usersWithOrders.reduce((top, u) => {
      const userSpent = u.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const topSpent = top.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return userSpent > topSpent ? u : top;
    }, usersWithOrders[0] || { name: "N/A", orders: [] });
    
    const topCustomerCLV = topCustomer.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const clvByTier = ["Gold", "Silver", "Bronze", "None"].map(tier => {
      const tierUsers = users.filter(u => 
        tier === "None" ? !u.plan : u.plan?.toLowerCase() === tier.toLowerCase()
      ).filter(u => u.orders.length > 0);
      
      const tierTotal = tierUsers.reduce((sum, u) => 
        sum + u.orders.reduce((orderSum, o) => orderSum + o.totalAmount, 0), 0
      );
      
      return {
        tier,
        clv: tierUsers.length > 0 ? tierTotal / tierUsers.length : 0,
      };
    });

    // Customer Table
    const customerTable = {
      customers: users.map(user => {
        const lastOrder = user.orders[0];
        const totalOrders = user.orders.length;
        const totalSpent = user.orders.reduce((sum, o) => sum + o.totalAmount, 0);
        const daysSinceLastOrder = lastOrder
          ? Math.floor((now.getTime() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          : null;
        
        return {
          id: user.id,
          name: user.name || "Anonymous",
          email: user.email,
          lastOrderDate: lastOrder?.createdAt.toISOString() || null,
          daysSinceLastOrder,
          membershipTier: (user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : "None") as "Bronze" | "Silver" | "Gold" | "None",
          totalOrders,
          totalSpent,
        };
      }).sort((a, b) => {
        if (a.daysSinceLastOrder === null) return 1;
        if (b.daysSinceLastOrder === null) return -1;
        return b.daysSinceLastOrder - a.daysSinceLastOrder;
      }),
      total: users.length,
    };

    // Actions Log (hardcoded realistic data)
    const actionsLog = [
      { trigger: "No purchase in 60 days", customer: "Priya S.", actionTaken: "Win-back email + ₹100 coupon", date: "3 days ago", result: "converted" as const },
      { trigger: "Cart abandoned 24hrs", customer: "Rahul M.", actionTaken: "Reminder email sent", date: "5 days ago", result: "converted" as const },
      { trigger: "Quiz completed, no purchase", customer: "Sneha T.", actionTaken: "Product recommendation email", date: "6 days ago", result: "pending" as const },
      { trigger: "Reached 500 loyalty points", customer: "Amit K.", actionTaken: "\"Redeem now\" push notification", date: "7 days ago", result: "converted" as const },
      { trigger: "Gold member inactive 45 days", customer: "Meera P.", actionTaken: "Personal outreach email", date: "8 days ago", result: "no_response" as const },
      { trigger: "New signup, no purchase in 7d", customer: "Arjun V.", actionTaken: "Welcome + 10% first order", date: "10 days ago", result: "pending" as const },
      { trigger: "Silver member, 3 purchases", customer: "Nisha R.", actionTaken: "Upgrade to Gold nudge email", date: "12 days ago", result: "converted" as const },
      { trigger: "No purchase in 90 days", customer: "Deepak L.", actionTaken: "Last-chance 20% coupon", date: "14 days ago", result: "no_response" as const },
      { trigger: "Birthday this week", customer: "Kavya S.", actionTaken: "Birthday ₹250 coupon email", date: "15 days ago", result: "converted" as const },
      { trigger: "High porosity quiz result", customer: "Rohan T.", actionTaken: "Deep conditioner bundle offer", date: "18 days ago", result: "pending" as const },
      { trigger: "Bronze for 6 months, active", customer: "Anita M.", actionTaken: "Silver upgrade offer sent", date: "20 days ago", result: "converted" as const },
      { trigger: "Oily scalp, no recent order", customer: "Farhan K.", actionTaken: "Clarifying shampoo 15% off", date: "22 days ago", result: "no_response" as const },
    ];

    return NextResponse.json({
      hairDnaSegmentation,
      churnAnalysis: churnAnalysis.slice(0, 50),
      churnStats,
      totalUsers: users.length,
      membershipDistribution,
      onboardingTrend,
      churnRetentionTrend,
      clvData: {
        averageCLV,
        topCustomer: {
          name: topCustomer.name || "N/A",
          clv: topCustomerCLV,
        },
        clvByTier,
      },
      customerTable,
      actionsLog,
    });
  } catch (error) {
    console.error("CRM Intelligence API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch CRM intelligence data" },
      { status: 500 }
    );
  }
}
