"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Package,
  Users,
  Megaphone,
  Sparkles,
  DollarSign,
  Factory,
  Zap,
  TrendingDown,
  ArrowRight,
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
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  items: OrderItem[];
  coupon?: {
    code: string;
  } | null;
}

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

// Influencer promo codes
const INFLUENCER_CODES = ["PRIYA15", "NEHA20", "SCALP10", "TRICH12", "OILY10"];

// Revenue Streams Data (static)
const revenueStreams = [
  {
    id: 1,
    name: "Direct Product Sales",
    amount: 1120000,
    percentage: 60.9,
    icon: Package,
    color: B.seafoam,
    description: "Revenue from customers purchasing shampoos, conditioners, serums, and treatment kits directly through the Follicia website.",
  },
  {
    id: 2,
    name: "Membership Subscriptions",
    amount: 320000,
    percentage: 17.4,
    icon: Users,
    color: "#1976D2",
    description: "Silver (₹499/month) and Gold (₹999/month) plan subscribers. Currently 380 Silver members and 210 Gold members.",
  },
  {
    id: 3,
    name: "Affiliate & Influencer Commissions",
    amount: 180000,
    percentage: 9.8,
    icon: Megaphone,
    color: "#F59E0B",
    description: "Revenue share from influencer promo codes and affiliate partner referrals. Partners earn 8% commission; Follicia earns the remaining margin.",
  },
  {
    id: 4,
    name: "Sponsored Product Placements",
    amount: 95000,
    percentage: 5.2,
    icon: TrendingUp,
    color: "#8B5CF6",
    description: "Partner hair care accessory brands pay to feature their products alongside Follicia products on the platform.",
  },
  {
    id: 5,
    name: "AI Diagnostic Upsell Conversions",
    amount: 125000,
    percentage: 6.8,
    icon: Sparkles,
    color: "#EC4899",
    description: "Revenue from users who completed the Hair DNA quiz and then purchased a recommended product bundle within 48 hours.",
  },
];

const totalRevenue = 1840000;

// COGS Data (static)
const rawMaterialCosts = [
  { name: "Argan Oil (imported, Morocco)", cost: 38000 },
  { name: "Keratin Protein Concentrate", cost: 29500 },
  { name: "Aloe Vera Extract (domestic supplier)", cost: 12000 },
  { name: "Biotin & Vitamin B7 Complex", cost: 18500 },
  { name: "Fragrance & Preservatives", cost: 9000 },
  { name: "Packaging (bottles, pumps, labels, boxes)", cost: 22000 },
];

const manufacturingCosts = [
  { name: "Labour (production staff, QA team)", cost: 24000 },
  { name: "Electricity & Utilities", cost: 8500 },
  { name: "Equipment Depreciation", cost: 6000 },
  { name: "Quality Testing & Lab Fees", cost: 11000 },
];

const totalRawMaterial = 129000;
const totalManufacturing = 49500;
const totalCOGS = 178500;
const cogsPerUnit = 357;

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

// P&L Data (static)
const unitsSold = 2800;
const totalCOGSMonth = cogsPerUnit * unitsSold;
const grossProfit = totalRevenue - totalCOGSMonth;
const netProfit = grossProfit - totalOpEx;
const grossMargin = ((grossProfit / totalRevenue) * 100).toFixed(1);
const netMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
const revenuePerUnit = Math.round(totalRevenue / unitsSold);

// Chart Data (static)
const revenueStreamChartData = revenueStreams.map((stream) => ({
  name: stream.name.split(" ")[0] + (stream.name.split(" ")[1] ? " " + stream.name.split(" ")[1] : ""),
  value: stream.amount,
  percentage: stream.percentage,
  color: stream.color,
}));

const cogsComparisonData = [
  { name: "Raw Materials", value: totalRawMaterial, color: B.seafoam },
  { name: "Manufacturing", value: totalManufacturing, color: "#F59E0B" },
];

const opexComparisonData = [
  { name: "Fixed Costs", value: totalFixed, color: B.teal },
  { name: "Variable Costs", value: totalVariable, color: "#EC4899" },
];

// Revenue Model Types (static)
const revenueModels = [
  { stream: "Direct Sales", type: "Sales Revenue Model", icon: Package, color: B.seafoam },
  { stream: "Memberships", type: "Subscription Revenue Model", icon: Users, color: "#1976D2" },
  { stream: "Affiliates", type: "Affiliate Revenue Model", icon: Megaphone, color: "#F59E0B" },
  { stream: "Sponsored Listings", type: "Advertising Revenue Model", icon: TrendingUp, color: "#8B5CF6" },
  { stream: "AI Upsell", type: "Sales Revenue Model (conversion-driven)", icon: Sparkles, color: "#EC4899" },
];

export default function RevenuePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      if (productsData.products && productsData.products.length > 0) {
        setSelectedProduct(productsData.products[0]);
      }
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

  // Check if order is affiliate
  const isAffiliateOrder = (order: Order) => {
    if (!order.coupon?.code) return false;
    return INFLUENCER_CODES.includes(order.coupon.code.toUpperCase());
  };

  // Calculate product revenue contribution
  const calculateProductRevenue = () => {
    const productStats: Record<string, { revenue: number; profit: number; units: number }> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product.id;
        const isAffiliate = isAffiliateOrder(order);
        const costs = calculateCosts(item.price, isAffiliate);

        if (!productStats[productId]) {
          productStats[productId] = {
            revenue: 0,
            profit: 0,
            units: 0,
          };
        }

        productStats[productId].revenue += item.price * item.quantity;
        productStats[productId].profit += costs.profit * item.quantity;
        productStats[productId].units += item.quantity;
      });
    });

    return products.map((product) => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name,
      revenue: productStats[product.id]?.revenue || 0,
      profit: productStats[product.id]?.profit || 0,
      units: productStats[product.id]?.units || 0,
    }));
  };

  // Calculate order table data
  const calculateOrderTableData = () => {
    const tableData: any[] = [];

    orders.slice(0, 20).forEach((order) => {
      order.items.forEach((item) => {
        const isAffiliate = isAffiliateOrder(order);
        const costs = calculateCosts(item.price, isAffiliate);
        const otherCosts = costs.packaging + costs.labor + costs.quality + costs.platform + costs.shipping;

        tableData.push({
          orderId: order.id,
          productName: item.product.name,
          units: item.quantity,
          sellingPrice: item.price,
          rawMatCost: costs.rawIngredients,
          marketingCost: costs.marketing,
          otherCosts,
          isAffiliate,
          affiliateCost: costs.affiliate,
          netProfit: costs.profit,
          margin: costs.margin,
        });
      });
    });

    return tableData;
  };

  const orderTableData = calculateOrderTableData();
  const productRevenueData = calculateProductRevenue();

  // Calculate summary stats
  const avgProfitPerUnit = orderTableData.length > 0
    ? orderTableData.reduce((sum, row) => sum + row.netProfit, 0) / orderTableData.reduce((sum, row) => sum + row.units, 0)
    : 0;

  const totalProfitDisplayed = orderTableData.reduce((sum, row) => sum + row.netProfit * row.units, 0);

  const affiliateOrderCount = orderTableData.filter((row) => row.isAffiliate).length;
  const directOrderCount = orderTableData.length - affiliateOrderCount;
  const affiliatePercentage = orderTableData.length > 0 ? (affiliateOrderCount / orderTableData.length) * 100 : 0;
  const directPercentage = 100 - affiliatePercentage;

  return (
    <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
      {/* Header */}
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

      {/* Total Revenue Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${B.seafoam}, ${B.teal})`,
          borderRadius: "12px",
          padding: "2rem",
          marginBottom: "2rem",
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
            ₹{(totalRevenue / 100000).toFixed(2)}L
          </div>
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.5rem" }}>
            ₹{totalRevenue.toLocaleString("en-IN")}
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

      {/* SECTION 1: Revenue Streams (Static) */}
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
          {revenueStreams.map((stream) => {
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
                        ₹{(stream.amount / 100000).toFixed(2)}L
                      </span>
                      <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.seafoam }}>
                        {stream.percentage}%
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
                data={revenueStreamChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.percent}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueStreamChartData.map((entry, index) => (
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

      {/* NEW DYNAMIC SECTION: Per-Product Unit Economics */}
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
          Per-Product Unit Economics & Order Revenue Breakdown
        </h2>
        <p style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "1.5rem" }}>
          Dynamic cost analysis based on actual product prices and order data
        </p>

        {loading ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "3rem", border: `1px solid ${B.lightGray}`, textAlign: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                border: `4px solid ${B.lightGray}`,
                borderTop: `4px solid ${B.seafoam}`,
                borderRadius: "50%",
                margin: "0 auto 1rem",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: B.bodyText }}>Loading product and order data...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: `2px solid #EF4444`, textAlign: "center" }}>
            <AlertCircle size={48} color="#EF4444" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "#EF4444", marginBottom: "1rem", fontSize: "1.1rem", fontWeight: 600 }}>{error}</p>
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
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: `1px solid ${B.lightGray}`, textAlign: "center" }}>
            <Package size={48} color={B.midGray} style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: B.bodyText }}>No products found in the database.</p>
          </div>
        ) : (
          <>
            {/* PART A: Product Cost Breakdown Explorer */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}`, marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: B.darkText }}>
                  Product Cost Breakdown Explorer
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* Affiliate Toggle */}
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

              {/* Product Selector */}
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
                    {/* Horizontal Cost Breakdown Bar */}
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

                    {/* Affiliate Callout */}
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

                    {/* Cost Component Cards */}
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

                    {/* Summary Row */}
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

            {/* PART B: Recent Orders Revenue Table */}
            <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}`, marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: B.darkText, marginBottom: "1.5rem" }}>
                Recent Orders — Per-Order Unit Economics
              </h3>

              {orderTableData.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: B.bodyText }}>
                  <Package size={48} color={B.midGray} style={{ margin: "0 auto 1rem" }} />
                  <p>No orders found.</p>
                </div>
              ) : (
                <>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ borderBottom: `2px solid ${B.lightGray}` }}>
                          <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Order ID
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Product Name
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Units
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Selling Price
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Raw Mat. Cost
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Marketing Cost
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Other Costs
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Affiliate?
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Net Profit
                          </th>
                          <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase" }}>
                            Margin %
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderTableData.map((row, index) => (
                          <tr
                            key={index}
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
                              {row.orderId.substring(0, 8)}...
                            </td>
                            <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: B.darkText, fontWeight: 500 }}>
                              {row.productName.length > 30 ? row.productName.substring(0, 30) + "..." : row.productName}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.85rem", fontWeight: 600, color: B.darkText }}>
                              {row.units}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: B.darkText }}>
                              ₹{row.sellingPrice.toFixed(0)}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>
                              ₹{row.rawMatCost.toFixed(0)}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>
                              ₹{row.marketingCost.toFixed(0)}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.85rem", color: "#EF4444" }}>
                              ₹{row.otherCosts.toFixed(0)}
                            </td>
                            <td style={{ padding: "0.75rem", textAlign: "center" }}>
                              {row.isAffiliate ? (
                                <span
                                  style={{
                                    padding: "0.25rem 0.5rem",
                                    background: "#FEE2E2",
                                    color: "#DC2626",
                                    borderRadius: "4px",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  YES
                                </span>
                              ) : (
                                <span style={{ fontSize: "0.75rem", color: B.midGray }}>—</span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem",
                                textAlign: "right",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: row.margin > 25 ? "#10B981" : row.margin >= 20 ? "#F59E0B" : "#EF4444",
                              }}
                            >
                              ₹{row.netProfit.toFixed(0)}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem",
                                textAlign: "right",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: row.margin > 25 ? "#10B981" : row.margin >= 20 ? "#F59E0B" : "#EF4444",
                              }}
                            >
                              {row.margin.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Row */}
                  <div
                    style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      background: `${B.seafoam}10`,
                      borderRadius: "8px",
                      border: `1px solid ${B.seafoam}30`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>
                      Total from {orderTableData.length} order items
                    </div>
                    <div style={{ display: "flex", gap: "2rem" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: B.bodyText }}>Total Units: </span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: B.darkText }}>
                          {orderTableData.reduce((sum, row) => sum + row.units, 0)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: B.bodyText }}>Total Revenue: </span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: B.darkText }}>
                          ₹{orderTableData.reduce((sum, row) => sum + row.sellingPrice * row.units, 0).toFixed(0)}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: B.bodyText }}>Total Profit: </span>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: B.seafoam }}>
                          ₹{totalProfitDisplayed.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Average Profit per Unit Sold
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.seafoam }}>
                  ₹{avgProfitPerUnit.toFixed(0)}
                </div>
              </div>

              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Total Profit from Displayed Orders
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.seafoam }}>
                  ₹{(totalProfitDisplayed / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
                <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Affiliate vs Direct Orders
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Affiliate", value: affiliatePercentage, color: "#EF4444" },
                        { name: "Direct", value: directPercentage, color: B.seafoam },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      <Cell fill="#EF4444" />
                      <Cell fill={B.seafoam} />
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => `${Number(value).toFixed(1)}%`}
                      contentStyle={{
                        background: "white",
                        border: `1px solid ${B.lightGray}`,
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", fontSize: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EF4444" }} />
                    <span style={{ color: B.bodyText }}>Affiliate {affiliatePercentage.toFixed(0)}%</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: B.seafoam }} />
                    <span style={{ color: B.bodyText }}>Direct {directPercentage.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PART D: Per-Product Revenue Contribution Chart */}
            {productRevenueData.length > 0 && (
              <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
                  Per-Product Revenue & Profit Contribution
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={productRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
                    <XAxis dataKey="name" stroke={B.midGray} style={{ fontSize: "0.75rem" }} angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke={B.midGray} style={{ fontSize: "0.75rem" }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(value: any) => `₹${Number(value).toLocaleString("en-IN")}`}
                      contentStyle={{
                        background: "white",
                        border: `1px solid ${B.lightGray}`,
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "0.85rem" }} />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Total Revenue" />
                    <Bar dataKey="profit" fill={B.seafoam} radius={[8, 8, 0, 0]} name="Total Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>

      {/* SECTION 2: Cost of Manufacturing (COGS) - Static */}
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
          Cost of Goods Sold (COGS) — Per Batch of 500 Units
        </h2>
        <p style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "1.5rem" }}>
          We manufacture our own hair care products in-house
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Raw Material Costs */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: `${B.seafoam}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Package size={20} color={B.seafoam} />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText }}>Raw Material Costs</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {rawMaterialCosts.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: B.cream,
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: B.bodyText }}>{item.name}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>
                    ₹{item.cost.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: `${B.seafoam}10`,
                  borderRadius: "8px",
                  border: `1px solid ${B.seafoam}30`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total Raw Material Cost</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: B.seafoam }}>
                    ₹{totalRawMaterial.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.8rem", color: B.bodyText }}>Cost per unit</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.seafoam }}>₹258</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manufacturing Costs */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#F59E0B15",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Factory size={20} color="#F59E0B" />
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText }}>Manufacturing Costs</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {manufacturingCosts.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: B.cream,
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: B.bodyText }}>{item.name}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>
                    ₹{item.cost.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: "0.5rem",
                  padding: "1rem",
                  background: "#F59E0B10",
                  borderRadius: "8px",
                  border: "1px solid #F59E0B30",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total Manufacturing Cost</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F59E0B" }}>
                    ₹{totalManufacturing.toLocaleString("en-IN")}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid #F59E0B30",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total COGS per 500 units</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#D32F2F" }}>
                    ₹{totalCOGS.toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", color: B.bodyText }}>COGS per unit</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#D32F2F" }}>₹{cogsPerUnit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COGS Comparison Chart */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
            Raw Material vs Manufacturing Cost Split
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cogsComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
              <XAxis dataKey="name" stroke={B.midGray} style={{ fontSize: "0.85rem" }} />
              <YAxis stroke={B.midGray} style={{ fontSize: "0.85rem" }} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: any) => `₹${Number(value).toLocaleString("en-IN")}`}
                contentStyle={{
                  background: "white",
                  border: `1px solid ${B.lightGray}`,
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {cogsComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3: Operational Expenses - Static */}
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
                  data={opexComparisonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}`}
                >
                  {opexComparisonData.map((entry, index) => (
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

      {/* SECTION 4: Profit & Loss Summary - Static */}
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
          Profit & Loss Summary
        </h2>

        {/* KPI Chips */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <div
            style={{
              background: "white",
              border: `2px solid ${B.seafoam}`,
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Gross Margin
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 600, color: B.seafoam }}>
              {grossMargin}%
            </div>
          </div>
          <div
            style={{
              background: "white",
              border: `2px solid #10B981`,
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Net Margin
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 600, color: "#10B981" }}>
              {netMargin}%
            </div>
          </div>
          <div
            style={{
              background: "white",
              border: `2px solid ${B.teal}`,
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              flex: 1,
            }}
          >
            <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Revenue per Unit Sold
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 600, color: B.teal }}>
              ₹{revenuePerUnit}
            </div>
          </div>
        </div>

        {/* Waterfall P&L */}
        <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: `1px solid ${B.lightGray}` }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: B.darkText, marginBottom: "1.5rem" }}>
            Monthly P&L Waterfall
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Revenue */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: `${B.seafoam}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={24} color={B.seafoam} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: B.bodyText }}>Total Monthly Revenue</div>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: "#10B981" }}>
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <TrendingDown size={24} color={B.midGray} />
            </div>

            {/* Less COGS */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "2rem" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#EF444415",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Package size={24} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: B.bodyText }}>Less: COGS ({unitsSold} units)</div>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: "#EF4444" }}>
                    -₹{totalCOGSMonth.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Equals Gross Profit */}
            <div
              style={{
                padding: "1.5rem",
                background: `${B.seafoam}10`,
                borderRadius: "12px",
                border: `2px solid ${B.seafoam}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "0.25rem" }}>Gross Profit</div>
                  <div style={{ fontSize: "0.75rem", color: B.seafoam, fontWeight: 600 }}>
                    {grossMargin}% margin
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: B.seafoam }}>
                  ₹{grossProfit.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <TrendingDown size={24} color={B.midGray} />
            </div>

            {/* Less OpEx */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "2rem" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "#EF444415",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DollarSign size={24} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: B.bodyText }}>Less: Operating Expenses</div>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: "#EF4444" }}>
                    -₹{totalOpEx.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Equals Net Profit */}
            <div
              style={{
                padding: "1.5rem",
                background: "linear-gradient(135deg, #10B98115, #10B98108)",
                borderRadius: "12px",
                border: "2px solid #10B981",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "0.25rem" }}>Net Profit</div>
                  <div style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600 }}>
                    {netMargin}% net margin
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "2rem", fontWeight: 700, color: "#10B981" }}>
                  ₹{netProfit.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Revenue Model Explanation - Static */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "0.5rem",
          }}
        >
          Revenue Model Explanation
        </h2>
        <p style={{ fontSize: "0.9rem", color: B.bodyText, marginBottom: "1.5rem" }}>
          Follicia operates on a diversified revenue model with 5 distinct streams
        </p>

        <div style={{ background: "white", borderRadius: "12px", padding: "2rem", border: `1px solid ${B.lightGray}` }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {revenueModels.map((model, index) => {
              const Icon = model.icon;
              return (
                <div key={index}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        background: `${model.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={28} color={model.color} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "0.25rem" }}>
                        {model.stream}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: model.color,
                          fontWeight: 500,
                          fontStyle: "italic",
                        }}
                      >
                        {model.type}
                      </div>
                    </div>

                    {index < revenueModels.length - 1 && (
                      <ArrowRight size={20} color={B.midGray} style={{ flexShrink: 0 }} />
                    )}
                  </div>

                  {index < revenueModels.length - 1 && (
                    <div
                      style={{
                        height: "1px",
                        background: B.lightGray,
                        marginTop: "1.5rem",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: `linear-gradient(135deg, ${B.teal}08, ${B.seafoam}05)`,
              borderRadius: "12px",
              border: `1px solid ${B.seafoam}30`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <Sparkles size={20} color={B.seafoam} />
              <h4 style={{ fontSize: "1rem", fontWeight: 600, color: B.darkText }}>Business Model Summary</h4>
            </div>
            <p style={{ fontSize: "0.9rem", color: B.bodyText, lineHeight: 1.6, margin: 0 }}>
              Follicia is a vertically integrated, AI-powered hair care brand that manufactures its own products. 
              We generate revenue through direct e-commerce sales, subscription memberships, affiliate partnerships, 
              sponsored placements, and AI-driven product recommendations. Our manufacturing model gives us control 
              over quality and margins, while our diversified revenue streams reduce dependency on any single channel.
            </p>
          </div>
        </div>
      </div>
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
