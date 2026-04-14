"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Users,
  Megaphone,
  Sparkles,
  DollarSign,
  Zap,
  IndianRupee,
  Leaf,
  Box,
  HardHat,
  FlaskConical,
  Megaphone as MegaphoneIcon,
  Server,
  Truck,
  TrendingUp as ProfitIcon,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/price-utils";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
  darkText: "#2C4A42",
};

// Constants
const PROFIT_MARGIN_DIRECT = 0.27;
const PROFIT_MARGIN_AFFILIATE = 0.22;
const MEMBERSHIP_SILVER_PRICE = 499;
const MEMBERSHIP_GOLD_PRICE = 999;
const MEMBERSHIP_SILVER_COUNT = 380;
const MEMBERSHIP_GOLD_COUNT = 210;
const SPONSORED_REVENUE = 95000;
const INFLUENCER_CODES = ["PRIYA15", "NEHA20", "SCALP10", "TRICH12", "OILY10"];

// Cost breakdown percentages
const COST_BREAKDOWN = {
  rawIngredients: 0.28,
  packaging: 0.08,
  labor: 0.07,
  quality: 0.03,
  marketing: 0.12,
  platform: 0.04,
  shipping: 0.06,
  affiliate: 0.05,
};

// Operational Expenses (static)
const fixedCosts = [
  { name: "Server & Cloud Hosting (Vercel + Neon)", cost: 12000 },
  { name: "API Costs (Gemini AI, Razorpay, Clerk)", cost: 18500 },
  { name: "Office & Warehouse Rent", cost: 45000 },
  { name: "Salaries (dev, marketing, ops team — 8 people)", cost: 320000 },
  { name: "Insurance & Compliance", cost: 8000 },
];

const variableCosts = [
  { name: "Shipping & Logistics (Shiprocket)", cost: 67000 },
  { name: "Marketing & Ad Spend (Google + Instagram)", cost: 85000 },
  { name: "Customer Loyalty Rewards Payouts", cost: 22000 },
  { name: "Packaging Materials (beyond COGS)", cost: 14000 },
  { name: "Affiliate Commission Payouts", cost: 38000 },
];

const totalFixed = 403500;
const totalVariable = 226000;
const totalOpEx = 629500;

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Order {
  id: string;
  totalAmount: number;
  couponId: string | null;
  createdAt: string;
  status: string;
  items: OrderItem[];
  coupon?: {
    code: string;
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
}

interface Metrics {
  totalRevenue: number;
  directSalesRevenue: number;
  affiliateSalesRevenue: number;
  membershipRevenue: number;
  upsellRevenue: number;
  sponsoredRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalUnitsSold: number;
  avgOrderValue: number;
  affiliateOrderCount: number;
  affiliatePercentage: number;
  monthlyData: MonthlyData[];
  revenueStreams: any[];
}

// Helper function
const isAffiliateOrder = (order: Order): boolean => {
  if (!order.coupon?.code) return false;
  return INFLUENCER_CODES.includes(order.coupon.code.toUpperCase());
};

// Calculate all metrics from orders
const calculateMetrics = (orders: Order[]): Metrics => {
  // Filter paid orders
  const paidOrders = orders.filter(
    (o) => o.status === "PAID" || o.status === "SHIPPED" || o.status === "DELIVERED"
  );

  let directSalesRevenue = 0;
  let affiliateSalesRevenue = 0;
  let totalProfit = 0;
  let totalUnitsSold = 0;
  let affiliateOrderCount = 0;

  // Calculate revenue and profit
  paidOrders.forEach((order) => {
    const isAffiliate = isAffiliateOrder(order);
    const profitMargin = isAffiliate ? PROFIT_MARGIN_AFFILIATE : PROFIT_MARGIN_DIRECT;
    
    if (isAffiliate) {
      affiliateSalesRevenue += order.totalAmount;
      affiliateOrderCount++;
    } else {
      directSalesRevenue += order.totalAmount;
    }

    totalProfit += order.totalAmount * profitMargin;

    // Count units
    order.items.forEach((item) => {
      totalUnitsSold += item.quantity;
    });
  });

  // Membership revenue (static)
  const membershipRevenue =
    MEMBERSHIP_SILVER_COUNT * MEMBERSHIP_SILVER_PRICE +
    MEMBERSHIP_GOLD_COUNT * MEMBERSHIP_GOLD_PRICE;

  // AI Upsell revenue (estimate as 10% of direct sales)
  const upsellRevenue = directSalesRevenue * 0.1;

  // Total revenue
  const totalRevenue =
    directSalesRevenue +
    affiliateSalesRevenue +
    membershipRevenue +
    upsellRevenue +
    SPONSORED_REVENUE;

  // Monthly data
  const monthlyMap = new Map<string, { revenue: number; profit: number; orders: number }>();

  paidOrders.forEach((order) => {
    const date = new Date(order.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleString("en-IN", { month: "short", year: "2-digit" });

    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { revenue: 0, profit: 0, orders: 0 });
    }

    const data = monthlyMap.get(monthKey)!;
    const profitMargin = isAffiliateOrder(order) ? PROFIT_MARGIN_AFFILIATE : PROFIT_MARGIN_DIRECT;
    
    data.revenue += order.totalAmount;
    data.profit += order.totalAmount * profitMargin;
    data.orders += 1;
  });

  // Convert to array and sort by date
  const monthlyData: MonthlyData[] = Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, data]) => {
      const [year, month] = key.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return {
        month: date.toLocaleString("en-IN", { month: "short", year: "2-digit" }),
        revenue: data.revenue,
        profit: data.profit,
        orders: data.orders,
      };
    });

  // Revenue streams
  const revenueStreams = [
    {
      id: 1,
      name: "Direct Product Sales",
      amount: directSalesRevenue,
      percentage: (directSalesRevenue / totalRevenue) * 100,
      icon: Package,
      color: B.seafoam,
      description: "Revenue from customers purchasing shampoos, conditioners, serums, and treatment kits directly through the Follicia website.",
    },
    {
      id: 2,
      name: "Membership Subscriptions",
      amount: membershipRevenue,
      percentage: (membershipRevenue / totalRevenue) * 100,
      icon: Users,
      color: "#1976D2",
      description: `Silver (₹${MEMBERSHIP_SILVER_PRICE}/month) and Gold (₹${MEMBERSHIP_GOLD_PRICE}/month) plan subscribers. Currently ${MEMBERSHIP_SILVER_COUNT} Silver members and ${MEMBERSHIP_GOLD_COUNT} Gold members.`,
    },
    {
      id: 3,
      name: "Affiliate & Influencer Commissions",
      amount: affiliateSalesRevenue,
      percentage: (affiliateSalesRevenue / totalRevenue) * 100,
      icon: Megaphone,
      color: "#F59E0B",
      description: "Revenue share from influencer promo codes and affiliate partner referrals. Partners earn 8% commission; Follicia earns the remaining margin.",
    },
    {
      id: 4,
      name: "Sponsored Product Placements",
      amount: SPONSORED_REVENUE,
      percentage: (SPONSORED_REVENUE / totalRevenue) * 100,
      icon: TrendingUp,
      color: "#8B5CF6",
      description: "Partner hair care accessory brands pay to feature their products alongside Follicia products on the platform.",
    },
    {
      id: 5,
      name: "AI Diagnostic Upsell Conversions",
      amount: upsellRevenue,
      percentage: (upsellRevenue / totalRevenue) * 100,
      icon: Sparkles,
      color: "#EC4899",
      description: "Revenue from users who completed the Hair DNA quiz and then purchased a recommended product bundle within 48 hours. (Estimated)",
    },
  ];

  return {
    totalRevenue,
    directSalesRevenue,
    affiliateSalesRevenue,
    membershipRevenue,
    upsellRevenue,
    sponsoredRevenue: SPONSORED_REVENUE,
    totalProfit,
    totalOrders: paidOrders.length,
    totalUnitsSold,
    avgOrderValue: paidOrders.length > 0 ? (directSalesRevenue + affiliateSalesRevenue) / paidOrders.length : 0,
    affiliateOrderCount,
    affiliatePercentage: paidOrders.length > 0 ? (affiliateOrderCount / paidOrders.length) * 100 : 0,
    monthlyData,
    revenueStreams,
  };
};

export default function RevenuePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
      ]);

      if (!productsRes.ok || !ordersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);

      // Calculate metrics
      const calculatedMetrics = calculateMetrics(ordersData.orders || []);
      setMetrics(calculatedMetrics);

      if (productsData.products && productsData.products.length > 0) {
        setSelectedProduct(productsData.products[0]);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate cost breakdown for selected product
  const calculateCosts = (price: number, includeAffiliate: boolean) => {
    const rawIngredients = price * COST_BREAKDOWN.rawIngredients;
    const packaging = price * COST_BREAKDOWN.packaging;
    const labor = price * COST_BREAKDOWN.labor;
    const quality = price * COST_BREAKDOWN.quality;
    const marketing = price * COST_BREAKDOWN.marketing;
    const platform = price * COST_BREAKDOWN.platform;
    const shipping = price * COST_BREAKDOWN.shipping;
    const affiliate = includeAffiliate ? price * COST_BREAKDOWN.affiliate : 0;

    const totalCost = rawIngredients + packaging + labor + quality + marketing + platform + shipping + affiliate;
    const profit = price - totalCost;
    const margin = (profit / price) * 100;

    return {
      rawIngredients,
      packaging,
      labor,
      quality,
      marketing,
      platform,
      shipping,
      affiliate,
      totalCost,
      profit,
      margin,
    };
  };

  // Calculate order metrics
  const calculateOrderMetrics = (order: Order) => {
    const isAffiliate = isAffiliateOrder(order);
    const profitMargin = isAffiliate ? PROFIT_MARGIN_AFFILIATE : PROFIT_MARGIN_DIRECT;
    
    let orderTotalRevenue = 0;
    let orderTotalProfit = 0;
    const productCount = order.items.length;

    order.items.forEach((item) => {
      const itemRevenue = item.price * item.quantity;
      const itemProfit = itemRevenue * profitMargin;
      orderTotalRevenue += itemRevenue;
      orderTotalProfit += itemProfit;
    });

    const orderMargin = orderTotalRevenue > 0 ? (orderTotalProfit / orderTotalRevenue) * 100 : 0;

    return {
      totalRevenue: orderTotalRevenue,
      totalProfit: orderTotalProfit,
      margin: orderMargin,
      productCount,
      isAffiliate,
    };
  };

  // Get recent 10 orders
  const recentOrders = [...orders]
    .filter((o) => o.status === "PAID" || o.status === "SHIPPED" || o.status === "DELIVERED")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  // Calculate summary for recent 10 orders
  const recentOrdersSummary = recentOrders.reduce(
    (acc, order) => {
      const orderMetrics = calculateOrderMetrics(order);
      return {
        totalRevenue: acc.totalRevenue + orderMetrics.totalRevenue,
        totalProfit: acc.totalProfit + orderMetrics.totalProfit,
        count: acc.count + 1,
      };
    },
    { totalRevenue: 0, totalProfit: 0, count: 0 }
  );

  const avgMargin = recentOrdersSummary.totalRevenue > 0
    ? (recentOrdersSummary.totalProfit / recentOrdersSummary.totalRevenue) * 100
    : 0;

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Monthly growth calculation
  const getMonthlyGrowth = () => {
    if (!metrics || metrics.monthlyData.length < 2) return null;
    
    const currentMonth = metrics.monthlyData[metrics.monthlyData.length - 1];
    const lastMonth = metrics.monthlyData[metrics.monthlyData.length - 2];
    
    const growth = ((currentMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100;
    return {
      percentage: growth,
      isPositive: growth >= 0,
    };
  };

  const getBestMonth = () => {
    if (!metrics || metrics.monthlyData.length === 0) return null;
    
    return metrics.monthlyData.reduce((best, current) => 
      current.revenue > best.revenue ? current : best
    );
  };

  const getCurrentMonthData = () => {
    if (!metrics || metrics.monthlyData.length === 0) return null;
    return metrics.monthlyData[metrics.monthlyData.length - 1];
  };

  if (loading) {
    return (
      <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: "300px", height: "32px", background: B.lightGray, borderRadius: "8px", marginBottom: "0.5rem", animation: "pulse 2s infinite" }} />
          <div style={{ width: "400px", height: "20px", background: B.lightGray, borderRadius: "8px", animation: "pulse 2s infinite" }} />
        </div>

        <div style={{ width: "100%", height: "200px", background: B.lightGray, borderRadius: "12px", marginBottom: "2rem", animation: "pulse 2s infinite" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: "100px", background: B.lightGray, borderRadius: "12px", animation: "pulse 2s infinite" }} />
          ))}
        </div>

        <div style={{ width: "100%", height: "320px", background: B.lightGray, borderRadius: "12px", marginBottom: "2rem", animation: "pulse 2s infinite" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ height: "200px", background: B.lightGray, borderRadius: "12px", animation: "pulse 2s infinite" }} />
          ))}
        </div>

        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "3rem", border: `2px solid #EF4444`, textAlign: "center", maxWidth: "500px" }}>
          <AlertCircle size={64} color="#EF4444" style={{ margin: "0 auto 1.5rem" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#EF4444", marginBottom: "1rem" }}>
            Failed to load revenue data
          </h2>
          <p style={{ color: B.bodyText, marginBottom: "2rem", fontSize: "0.9rem" }}>{error}</p>
          <button
            onClick={fetchData}
            style={{
              padding: "0.75rem 1.5rem",
              background: B.seafoam,
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!metrics || orders.length === 0) {
    return (
      <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: B.darkText,
              marginBottom: "0.5rem",
            }}
          >
            Revenue Model & Financial Overview
          </h1>
          <p style={{ fontSize: "0.9rem", color: B.bodyText }}>
            Fiscal Year 2024–25 | Manufacturing-Based Business Model
          </p>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "3rem", border: `1px solid ${B.lightGray}`, textAlign: "center" }}>
          <ShoppingCart size={64} color={B.midGray} style={{ margin: "0 auto 1.5rem" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
            No orders yet
          </h2>
          <p style={{ color: B.bodyText, fontSize: "0.9rem" }}>
            Revenue data will appear as customers place orders
          </p>
        </div>
      </div>
    );
  }

  const monthlyGrowth = getMonthlyGrowth();
  const bestMonth = getBestMonth();
  const currentMonthData = getCurrentMonthData();

  return (
    <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "2rem",
                fontWeight: 400,
                color: B.darkText,
                marginBottom: "0.5rem",
              }}
            >
              Revenue Model & Financial Overview
            </h1>
            <p style={{ fontSize: "0.9rem", color: B.bodyText }}>
              Fiscal Year 2024–25 | Manufacturing-Based Business Model
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: B.midGray }}>
              Last updated: {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={fetchData}
              style={{
                padding: "0.5rem 1rem",
                background: "white",
                border: `1px solid ${B.lightGray}`,
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: B.darkText,
              }}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Total Revenue Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${B.seafoam}, ${B.teal})`,
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "1.5rem",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            Total Monthly Revenue
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "3rem", fontWeight: 600 }}>
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.5rem" }}>
            ₹{metrics.totalRevenue.toLocaleString("en-IN")}
          </div>
        </div>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IndianRupee size={40} />
        </div>
      </div>

      {/* KPI Chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total Orders
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.darkText }}>
            {metrics.totalOrders}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Units Sold
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.darkText }}>
            {metrics.totalUnitsSold}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Avg Order Value
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.darkText }}>
            ₹{Math.round(metrics.avgOrderValue).toLocaleString("en-IN")}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total Profit
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.seafoam }}>
            {formatCurrency(metrics.totalProfit)}
          </div>
        </div>
      </div>

      {/* SECTION 2: Monthly Revenue Trend */}
      {metrics.monthlyData.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: B.darkText,
              marginBottom: "1.5rem",
            }}
          >
            Monthly Revenue Trend
          </h2>

          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}`, marginBottom: "1.5rem" }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={metrics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
                <XAxis 
                  dataKey="month" 
                  stroke={B.midGray}
                  style={{ fontSize: "0.75rem" }}
                />
                <YAxis 
                  stroke={B.midGray}
                  style={{ fontSize: "0.75rem" }}
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                  }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={B.seafoam} 
                  strokeWidth={3}
                  dot={{ fill: B.seafoam, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {bestMonth && (
              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Best Month
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 700, color: B.seafoam, marginBottom: "0.25rem" }}>
                  {bestMonth.month}
                </div>
                <div style={{ fontSize: "0.85rem", color: B.bodyText }}>
                  {formatCurrency(bestMonth.revenue)}
                </div>
              </div>
            )}

            {currentMonthData && (
              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Current Month
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 700, color: B.darkText, marginBottom: "0.25rem" }}>
                  {currentMonthData.month}
                </div>
                <div style={{ fontSize: "0.85rem", color: B.bodyText }}>
                  {formatCurrency(currentMonthData.revenue)}
                </div>
              </div>
            )}

            {monthlyGrowth ? (
              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Growth (MoM)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 700, color: monthlyGrowth.isPositive ? "#10B981" : "#EF4444" }}>
                    {monthlyGrowth.percentage.toFixed(1)}%
                  </div>
                  {monthlyGrowth.isPositive ? (
                    <ArrowUpRight size={24} color="#10B981" />
                  ) : (
                    <ArrowDownRight size={24} color="#EF4444" />
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "0.85rem", color: B.midGray, textAlign: "center" }}>
                  More data will appear as orders grow
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Revenue Streams */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "1.5rem",
          }}
        >
          Revenue Streams (Money Coming In)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {metrics.revenueStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <div
                key={stream.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  border: `1px solid ${B.lightGray}`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: `${stream.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color={stream.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: B.darkText, marginBottom: "0.25rem" }}>
                      {stream.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                      <span style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: stream.color }}>
                        {formatCurrency(stream.amount)}
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.seafoam }}>
                        {stream.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: B.bodyText, lineHeight: 1.6 }}>
                  {stream.description}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
            Revenue Distribution by Stream
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics.revenueStreams.map(s => ({ name: s.name.split(" ")[0] + (s.name.split(" ")[1] ? " " + s.name.split(" ")[1] : ""), value: s.amount, color: s.color }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {metrics.revenueStreams.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => `₹${Number(value).toLocaleString("en-IN")}`}
                contentStyle={{
                  background: "white",
                  border: `1px solid ${B.lightGray}`,
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 4: Operational Expenses - Static */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "1.5rem",
          }}
        >
          Operational Expenses (Monthly Fixed + Variable Costs)
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Fixed Costs */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${B.teal}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarSign size={20} color={B.teal} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText }}>Fixed Costs</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {fixedCosts.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "0.75rem",
                    background: B.cream,
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: B.bodyText, flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: B.darkText, whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                    ₹{item.cost.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: `${B.teal}10`,
                  borderRadius: "8px",
                  border: `1px solid ${B.teal}30`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total Fixed</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: B.teal }}>
                    ₹{totalFixed.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Variable Costs */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#EC489915",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Zap size={20} color="#EC4899" />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText }}>Variable Costs</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {variableCosts.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "0.75rem",
                    background: B.cream,
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: B.bodyText, flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: B.darkText, whiteSpace: "nowrap", marginLeft: "0.5rem" }}>
                    ₹{item.cost.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: "#EC489910",
                  borderRadius: "8px",
                  border: "1px solid #EC489930",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total Variable</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#EC4899" }}>
                    ₹{totalVariable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* OpEx Chart */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              Fixed vs Variable Split
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Fixed Costs", value: totalFixed, color: B.teal },
                    { name: "Variable Costs", value: totalVariable, color: "#EC4899" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry: any) => `${entry.name}`}
                >
                  <Cell fill={B.teal} />
                  <Cell fill="#EC4899" />
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${Number(value).toLocaleString("en-IN")}`}
                  contentStyle={{
                    background: "white",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: B.cream,
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total Monthly OpEx</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#D32F2F" }}>
                  ₹{totalOpEx.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Product Cost Breakdown Explorer */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "0.5rem",
          }}
        >
          Product Cost Breakdown Explorer
        </h2>
        <p style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "1.5rem" }}>
          Dynamic cost analysis based on actual product prices
        </p>

        {products.length === 0 ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: `1px solid ${B.lightGray}`, textAlign: "center" }}>
            <Package size={48} color={B.midGray} style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: B.bodyText }}>No products found in the database.</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: B.darkText }}>
                Cost Breakdown by Product
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isAffiliate}
                    onChange={(e) => setIsAffiliate(e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500, color: B.darkText }}>
                    Simulate Affiliate Sale
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.5rem" }}>
                Select Product:
              </label>
              <select
                value={selectedProduct?.id || ""}
                onChange={(e) => {
                  const product = products.find((p) => p.id === e.target.value);
                  setSelectedProduct(product || null);
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  border: `1px solid ${B.lightGray}`,
                  fontSize: "0.9rem",
                  color: B.darkText,
                  background: "white",
                  cursor: "pointer",
                }}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — ₹{product.price.toLocaleString("en-IN")}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (() => {
              const costs = calculateCosts(selectedProduct.price, isAffiliate);
              const costComponents = [
                { name: "Raw Ingredients", value: costs.rawIngredients, percentage: COST_BREAKDOWN.rawIngredients * 100, color: "#10B981" },
                { name: "Packaging", value: costs.packaging, percentage: COST_BREAKDOWN.packaging * 100, color: "#F59E0B" },
                { name: "Labor", value: costs.labor, percentage: COST_BREAKDOWN.labor * 100, color: "#8B5CF6" },
                { name: "Quality", value: costs.quality, percentage: COST_BREAKDOWN.quality * 100, color: "#EC4899" },
                { name: "Marketing", value: costs.marketing, percentage: COST_BREAKDOWN.marketing * 100, color: "#EF4444" },
                { name: "Platform", value: costs.platform, percentage: COST_BREAKDOWN.platform * 100, color: "#3B82F6" },
                { name: "Shipping", value: costs.shipping, percentage: COST_BREAKDOWN.shipping * 100, color: "#F97316" },
              ];

              if (isAffiliate) {
                costComponents.push({ name: "Affiliate", value: costs.affiliate, percentage: COST_BREAKDOWN.affiliate * 100, color: "#DC2626" });
              }

              costComponents.push({ name: "Profit", value: costs.profit, percentage: costs.margin, color: B.seafoam });

              return (
                <>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.75rem" }}>
                      Cost Breakdown Visualization
                    </h4>
                    <div style={{ display: "flex", height: "60px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${B.lightGray}` }}>
                      {costComponents.map((component, index) => (
                        <div
                          key={index}
                          style={{
                            width: `${component.percentage}%`,
                            background: component.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            padding: "0.25rem",
                            textAlign: "center",
                            position: "relative",
                          }}
                          title={`${component.name}: ${component.percentage.toFixed(1)}%`}
                        >
                          {component.percentage > 8 && (
                            <span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                              {component.percentage.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "0.75rem" }}>
                      {costComponents.map((component, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: component.color }} />
                          <span style={{ fontSize: "0.75rem", color: B.bodyText }}>
                            {component.name} ({component.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {isAffiliate && (
                    <div
                      style={{
                        padding: "1rem",
                        background: "#FEF3C7",
                        border: "1px solid #F59E0B",
                        borderRadius: "8px",
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <AlertCircle size={20} color="#F59E0B" />
                      <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                        When sold via influencer promo code, ₹{costs.affiliate.toFixed(2)} goes to affiliate commission, reducing your margin by 5%.
                      </p>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    <CostCard
                      icon={Leaf}
                      name="Raw Ingredients"
                      percentage={28}
                      amount={costs.rawIngredients}
                      description="Argan oil, keratin, aloe vera, biotin sourced from suppliers"
                      color="#10B981"
                    />
                    <CostCard
                      icon={Box}
                      name="Packaging"
                      percentage={8}
                      amount={costs.packaging}
                      description="Bottles, pumps, labels, outer box per unit"
                      color="#F59E0B"
                    />
                    <CostCard
                      icon={HardHat}
                      name="Manufacturing Labor"
                      percentage={7}
                      amount={costs.labor}
                      description="Production staff + QA team cost per unit"
                      color="#8B5CF6"
                    />
                    <CostCard
                      icon={FlaskConical}
                      name="Quality Testing"
                      percentage={3}
                      amount={costs.quality}
                      description="Lab testing, safety certification per batch"
                      color="#EC4899"
                    />
                    <CostCard
                      icon={MegaphoneIcon}
                      name="Marketing"
                      percentage={12}
                      amount={costs.marketing}
                      description="Share of monthly ad spend allocated per unit sold"
                      color="#EF4444"
                    />
                    <CostCard
                      icon={Server}
                      name="Platform & APIs"
                      percentage={4}
                      amount={costs.platform}
                      description="Vercel hosting, Gemini AI, Razorpay, Clerk fees"
                      color="#3B82F6"
                    />
                    <CostCard
                      icon={Truck}
                      name="Shipping"
                      percentage={6}
                      amount={costs.shipping}
                      description="Shiprocket fulfillment cost per unit"
                      color="#F97316"
                    />
                    {isAffiliate && (
                      <CostCard
                        icon={Users}
                        name="Affiliate Commission"
                        percentage={5}
                        amount={costs.affiliate}
                        description="Commission paid to influencer for this sale"
                        color="#DC2626"
                      />
                    )}
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${B.seafoam}15, ${B.seafoam}08)`,
                        borderRadius: "12px",
                        padding: "1.25rem",
                        border: `2px solid ${B.seafoam}`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: B.seafoam,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <ProfitIcon size={20} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: B.bodyText, fontWeight: 600 }}>Net Profit</div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: B.seafoam }}>
                            {costs.margin.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 700, color: B.seafoam, marginBottom: "0.5rem" }}>
                        ₹{costs.profit.toFixed(2)}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: B.bodyText, margin: 0 }}>
                        Revenue retained per unit sold
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "1.25rem",
                      background: B.cream,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.85rem", color: B.bodyText }}>Selling Price: </span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: B.darkText }}>
                        ₹{selectedProduct.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: B.bodyText }}>Total Cost: </span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#EF4444" }}>
                        ₹{costs.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: B.bodyText }}>Profit per Unit: </span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: B.seafoam }}>
                        ₹{costs.profit.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: B.bodyText }}>Margin: </span>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: B.seafoam }}>
                        {costs.margin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* SECTION 6: Recent Orders Profit Summary */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "0.5rem",
          }}
        >
          Recent Orders Profit Summary
        </h2>
        <p style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "1.5rem" }}>
          Latest 10 orders with profit analysis
        </p>

        {recentOrders.length === 0 ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: `1px solid ${B.lightGray}`, textAlign: "center" }}>
            <Package size={48} color={B.midGray} style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: B.bodyText }}>No orders found.</p>
          </div>
        ) : (
          <>
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}`, marginBottom: "1.5rem" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${B.lightGray}` }}>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Order ID
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Customer Name
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Products Bought
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Total Revenue
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Total Profit
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Margin %
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        Date
                      </th>
                      <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                        View Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const orderMetrics = calculateOrderMetrics(order);
                      const marginColor = orderMetrics.margin > 25 ? "#10B981" : orderMetrics.margin >= 20 ? "#F59E0B" : "#EF4444";
                      
                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: `1px solid ${B.lightGray}`,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = B.cream;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: B.bodyText, fontFamily: "monospace" }}>
                            {order.id.substring(0, 8)}...
                          </td>
                          <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: B.darkText, fontWeight: 500 }}>
                            {order.user?.name || "Guest"}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.85rem", color: B.bodyText }}>
                            {orderMetrics.productCount} {orderMetrics.productCount === 1 ? "product" : "products"}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: B.darkText }}>
                            ₹{orderMetrics.totalRevenue.toFixed(0)}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: B.seafoam }}>
                            ₹{orderMetrics.totalProfit.toFixed(0)}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "center" }}>
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                background: `${marginColor}20`,
                                color: marginColor,
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {orderMetrics.margin.toFixed(1)}%
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: B.bodyText }}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td style={{ padding: "0.75rem", textAlign: "center" }}>
                            <button
                              onClick={() => openOrderModal(order)}
                              style={{
                                padding: "0.4rem 0.6rem",
                                background: "white",
                                border: `1px solid ${B.lightGray}`,
                                borderRadius: "6px",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Eye size={16} color={B.seafoam} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Bar */}
            <div
              style={{
                padding: "1.5rem",
                background: `${B.seafoam}10`,
                borderRadius: "12px",
                border: `1px solid ${B.seafoam}30`,
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Revenue from Last 10 Orders
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: B.darkText }}>
                  {formatCurrency(recentOrdersSummary.totalRevenue)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Profit from Last 10 Orders
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: B.seafoam }}>
                  {formatCurrency(recentOrdersSummary.totalProfit)}
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Average Margin
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: B.seafoam }}>
                  {avgMargin.toFixed(1)}%
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeOrderModal}
          calculateCosts={calculateCosts}
          isAffiliateOrder={isAffiliateOrder}
          COST_BREAKDOWN={COST_BREAKDOWN}
          B={B}
        />
      )}
    </div>
  );
}

// Helper Component: Cost Card
function CostCard({
  icon: Icon,
  name,
  percentage,
  amount,
  description,
  color,
}: {
  icon: any;
  name: string;
  percentage: number;
  amount: number;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.25rem",
        border: `1px solid ${B.lightGray}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={20} color={color} />
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color }}>
            {percentage}%
          </div>
        </div>
      </div>
      <div style={{ fontSize: "1.3rem", fontWeight: 700, color, marginBottom: "0.5rem" }}>
        ₹{amount.toFixed(2)}
      </div>
      <p style={{ fontSize: "0.75rem", color: B.bodyText, margin: 0, lineHeight: 1.5 }}>
        {description}
      </p>
    </div>
  );
}

// Order Detail Modal Component
function OrderDetailModal({
  order,
  onClose,
  calculateCosts,
  isAffiliateOrder,
  COST_BREAKDOWN,
  B,
}: {
  order: Order;
  onClose: () => void;
  calculateCosts: (price: number, includeAffiliate: boolean) => any;
  isAffiliateOrder: (order: Order) => boolean;
  COST_BREAKDOWN: any;
  B: any;
}) {
  const isAffiliate = isAffiliateOrder(order);
  const profitMargin = isAffiliate ? PROFIT_MARGIN_AFFILIATE : PROFIT_MARGIN_DIRECT;

  // Calculate order totals
  let orderTotalRevenue = 0;
  let orderTotalCost = 0;
  let orderTotalProfit = 0;

  order.items.forEach((item) => {
    const itemRevenue = item.price * item.quantity;
    const itemProfit = itemRevenue * profitMargin;
    const itemCost = itemRevenue - itemProfit;
    
    orderTotalRevenue += itemRevenue;
    orderTotalCost += itemCost;
    orderTotalProfit += itemProfit;
  });

  const orderMargin = orderTotalRevenue > 0 ? (orderTotalProfit / orderTotalRevenue) * 100 : 0;

  // Cost breakdown for the entire order
  const costBreakdownData = [
    { name: "Raw Ingredients", percentage: 28, color: "#10B981" },
    { name: "Packaging", percentage: 8, color: "#F59E0B" },
    { name: "Labor", percentage: 7, color: "#8B5CF6" },
    { name: "Quality Testing", percentage: 3, color: "#EC4899" },
    { name: "Marketing", percentage: 12, color: "#EF4444" },
    { name: "Platform & APIs", percentage: 4, color: "#3B82F6" },
    { name: "Shipping", percentage: 6, color: "#F97316" },
  ];

  if (isAffiliate) {
    costBreakdownData.push({ name: "Affiliate Comm", percentage: 5, color: "#DC2626" });
  }

  costBreakdownData.push({ name: "Net Profit", percentage: isAffiliate ? 22 : 27, color: B.seafoam });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "16px",
          maxWidth: "900px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: B.teal,
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "white",
                marginBottom: "0.25rem",
              }}
            >
              Order #{order.id.substring(0, 8).toUpperCase()}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.8)",
                margin: 0,
              }}
            >
              {new Date(order.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" • "}
              {order.user?.name || "Guest"} ({order.user?.email || "N/A"})
              {isAffiliate && (
                <span style={{ marginLeft: "0.5rem", padding: "0.25rem 0.5rem", background: "#F59E0B", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600 }}>
                  Affiliate: {order.coupon?.code}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "2rem" }}>
          {/* SECTION A: Products in this Order */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              Products in this Order
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${B.lightGray}`, background: B.cream }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Product Name
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Qty
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Unit Price
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Line Total
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Cost ({isAffiliate ? "78%" : "73%"})
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Profit
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                      Margin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const lineTotal = item.price * item.quantity;
                    const costPct = isAffiliate ? 0.78 : 0.73;
                    const lineCost = lineTotal * costPct;
                    const lineProfit = lineTotal - lineCost;
                    const lineMargin = (lineProfit / lineTotal) * 100;

                    return (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${B.lightGray}` }}>
                        <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: B.darkText, fontWeight: 500 }}>
                          {item.product.name}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 600, color: B.darkText }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: B.bodyText }}>
                          ₹{item.price.toFixed(0)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: B.darkText }}>
                          ₹{lineTotal.toFixed(0)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>
                          ₹{lineCost.toFixed(0)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: B.seafoam }}>
                          ₹{lineProfit.toFixed(0)}
                        </td>
                        <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: B.seafoam }}>
                          {lineMargin.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION B: Cost Breakdown for this Order */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              Cost Breakdown for this Order
            </h3>
            <div style={{ display: "flex", height: "60px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${B.lightGray}`, marginBottom: "1rem" }}>
              {costBreakdownData.map((component, index) => (
                <div
                  key={index}
                  style={{
                    width: `${component.percentage}%`,
                    background: component.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.25rem",
                    textAlign: "center",
                  }}
                  title={`${component.name}: ${component.percentage}%`}
                >
                  {component.percentage > 8 && (
                    <span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                      {component.percentage}%
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {costBreakdownData.map((component, index) => {
                const amount = (orderTotalRevenue * component.percentage) / 100;
                return (
                  <div
                    key={index}
                    style={{
                      padding: "0.75rem",
                      background: B.cream,
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: component.color }} />
                      <span style={{ fontSize: "0.75rem", color: B.bodyText }}>{component.name}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: B.darkText }}>
                      ₹{amount.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C: Order Summary */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              Order Summary
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              <div
                style={{
                  padding: "1.25rem",
                  background: B.cream,
                  borderRadius: "12px",
                  border: `1px solid ${B.lightGray}`,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Order Value
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: B.darkText }}>
                  ₹{orderTotalRevenue.toFixed(0)}
                </div>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  background: B.cream,
                  borderRadius: "12px",
                  border: `1px solid ${B.lightGray}`,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Cost
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: "#EF4444" }}>
                  ₹{orderTotalCost.toFixed(0)}
                </div>
              </div>
              <div
                style={{
                  padding: "1.25rem",
                  background: `${B.seafoam}15`,
                  borderRadius: "12px",
                  border: `2px solid ${B.seafoam}`,
                }}
              >
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Net Profit
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: B.seafoam }}>
                  ₹{orderTotalProfit.toFixed(0)}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: B.cream,
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "0.9rem", color: B.bodyText }}>
                Profit Margin: <span style={{ fontWeight: 700, color: B.seafoam }}>{orderMargin.toFixed(1)}%</span>
                {" "}
                ({isAffiliate ? "Affiliate Sale — 5% commission deducted" : "Direct Sale"})
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderTop: `1px solid ${B.lightGray}`,
            display: "flex",
            justifyContent: "flex-end",
            background: B.cream,
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              background: B.seafoam,
              border: "none",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
