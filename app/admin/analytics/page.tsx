"use client";

import { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Calendar, TrendingUp, ShoppingBag, DollarSign } from "lucide-react";

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

interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
  revenueTimeSeries: Array<{ date: string; amount: number }>;
  orderTimeSeries: Array<{ date: string; count: number }>;
  salesByCategory: Array<{
    name: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  topProducts: Array<{
    name: string;
    views: number;
    addToCart: number;
    conversions: number;
    cancellations: number;
    conversionRate: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [dateRange, setDateRange] = useState<"today" | "7" | "30" | "month">("30");
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      // Show table loading only if we already have data
      if (data) {
        setTableLoading(true);
      } else {
        setLoading(true);
      }
      
      const res = await fetch(`/api/admin/analytics?range=${dateRange}`);
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: B.bodyText, fontSize: "0.85rem" }}>Loading analytics...</p>
      </div>
    );
  }

  const calculateConversionRate = (conversions: number, views: number) => {
    if (views === 0) return 0;
    return Math.round((conversions / views) * 100);
  };

  return (
    <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
      {/* Header with Date Range Picker */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "1.75rem",
              fontWeight: 400,
              color: B.darkText,
              marginBottom: "0.4rem",
            }}
          >
            Analytics Dashboard
          </h1>
          <p style={{ fontSize: "0.8rem", color: B.bodyText }}>
            Deep insights into revenue, orders, and product engagement
          </p>
        </div>

        {/* Date Range Picker */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Calendar size={16} color={B.midGray} />
          {["today", "7", "30", "month"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range as typeof dateRange)}
              style={{
                padding: "0.5rem 1rem",
                background: dateRange === range ? B.teal : "white",
                color: dateRange === range ? "white" : B.darkText,
                border: `1px solid ${dateRange === range ? B.teal : B.lightGray}`,
                borderRadius: "6px",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                fontWeight: dateRange === range ? 600 : 400,
              }}
            >
              {range === "today" ? "Today" : range === "7" ? "Last 7 Days" : range === "30" ? "Last 30 Days" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.85rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "8px", 
            background: "#E8F5E9", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <DollarSign size={20} color={B.seafoam} />
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Total Revenue
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.darkText }}>
              ₹{data.summary.totalRevenue > 0 ? Math.round(data.summary.totalRevenue / 1000).toLocaleString("en-IN") + "k" : "0"}
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "8px", padding: "1rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "8px", 
            background: "#E3F2FD", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <ShoppingBag size={20} color="#1976D2" />
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Total Orders
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.darkText }}>
              {data.summary.totalOrders.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "8px", padding: "1rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "8px", 
            background: "#FFF3E0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <TrendingUp size={20} color="#FF9800" />
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Avg Order Value
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.darkText }}>
              ₹{data.summary.avgOrderValue > 0 ? Math.round(data.summary.avgOrderValue).toLocaleString("en-IN") : "0"}
            </div>
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {data.summary.totalOrders === 0 && data.topProducts.length === 0 && (
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1.25rem",
          border: `2px dashed ${B.lightGray}`,
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.25rem", color: B.darkText, marginBottom: "0.5rem" }}>
            No Analytics Data Yet
          </h3>
          <p style={{ fontSize: "0.85rem", color: B.bodyText, marginBottom: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            Start generating analytics data by:
          </p>
          <ul style={{ fontSize: "0.85rem", color: B.bodyText, textAlign: "left", maxWidth: "400px", margin: "1rem auto", lineHeight: "1.8" }}>
            <li>Viewing products on the storefront (tracks views)</li>
            <li>Adding items to cart (tracks add-to-cart)</li>
            <li>Completing purchases (tracks conversions)</li>
          </ul>
        </div>
      )}

      {/* Charts Grid - 2x2 Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem", marginBottom: "1.25rem" }}>
        {/* Revenue Over Time */}
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
                Revenue Over Time
              </h3>
              <p style={{ fontSize: "0.75rem", color: B.bodyText }}>Track revenue trends</p>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button
                onClick={() => setViewMode("daily")}
                style={{
                  padding: "0.4rem 0.75rem",
                  background: viewMode === "daily" ? B.seafoam : "transparent",
                  color: viewMode === "daily" ? "white" : B.bodyText,
                  border: `1px solid ${viewMode === "daily" ? B.seafoam : B.lightGray}`,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode("monthly")}
                style={{
                  padding: "0.4rem 0.75rem",
                  background: viewMode === "monthly" ? B.seafoam : "transparent",
                  color: viewMode === "monthly" ? "white" : B.bodyText,
                  border: `1px solid ${viewMode === "monthly" ? B.seafoam : B.lightGray}`,
                  borderRadius: "6px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Monthly
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.revenueTimeSeries}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={B.seafoam} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={B.seafoam} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
              <XAxis 
                dataKey="date" 
                stroke={B.midGray}
                style={{ fontSize: "0.65rem" }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke={B.midGray}
                style={{ fontSize: "0.65rem" }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{
                  background: B.teal,
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "0.75rem",
                }}
                formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke={B.seafoam} 
                strokeWidth={2.5}
                fill="url(#revenueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Volume */}
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
          <div style={{ marginBottom: "0.85rem" }}>
            <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
              Order Volume
            </h3>
            <p style={{ fontSize: "0.75rem", color: B.bodyText }}>Orders placed per day</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.orderTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
              <XAxis 
                dataKey="date" 
                stroke={B.midGray}
                style={{ fontSize: "0.65rem" }}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke={B.midGray}
                style={{ fontSize: "0.65rem" }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{
                  background: B.teal,
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "0.75rem",
                }}
                formatter={(value) => [`${value} orders`, "Count"]}
              />
              <Bar dataKey="count" fill={B.teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
          <div style={{ marginBottom: "0.85rem" }}>
            <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
              Sales by Category
            </h3>
            <p style={{ fontSize: "0.75rem", color: B.bodyText }}>Revenue distribution</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={data.salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{
                    background: B.teal,
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {data.salesByCategory.map((category, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: category.color }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: B.darkText }}>{category.name}</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: B.bodyText, marginLeft: "1.5rem" }}>
                    {category.percentage}% • ₹{Math.round(category.value / 1000).toLocaleString("en-IN")}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Interaction Funnel - Placeholder */}
        <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
          <div style={{ marginBottom: "0.85rem" }}>
            <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
              Top Performing Products
            </h3>
            <p style={{ fontSize: "0.75rem", color: B.bodyText }}>Conversion metrics</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "200px", overflowY: "auto" }}>
            {data.topProducts.slice(0, 5).map((product, index) => {
              // Use conversion rate from API
              const conversionRate = product.conversionRate || 0;
              return (
                <div 
                  key={index}
                  style={{ 
                    padding: "0.6rem",
                    background: B.cream,
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: B.darkText, marginBottom: "0.2rem" }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: B.bodyText }}>
                      {product.views} views • {product.conversions} sold
                    </div>
                  </div>
                  <div style={{
                    padding: "0.3rem 0.6rem",
                    background: conversionRate > 10 ? "#E8F5E9" : conversionRate > 0 ? "#FFF3E0" : B.lightGray,
                    color: conversionRate > 10 ? B.seafoam : conversionRate > 0 ? "#FF9800" : B.midGray,
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}>
                    {conversionRate}%
                  </div>
                </div>
              );
            })}
            {data.topProducts.length === 0 && (
              <div style={{ padding: "2rem", textAlign: "center", color: B.midGray, fontSize: "0.8rem" }}>
                No product data available yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Interaction Funnel Table */}
      <div style={{ background: "white", borderRadius: "8px", padding: "1rem", position: "relative" }}>
        {/* Loading Overlay */}
        {tableLoading && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(2px)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "40px",
                height: "40px",
                border: `3px solid ${B.lightGray}`,
                borderTop: `3px solid ${B.seafoam}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 0.5rem",
              }} />
              <p style={{ fontSize: "0.8rem", color: B.bodyText, fontWeight: 500 }}>
                Loading timed data...
              </p>
            </div>
          </div>
        )}

        <div style={{ marginBottom: "0.85rem" }}>
          <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
            Product Interaction Funnel
          </h3>
          <p style={{ fontSize: "0.75rem", color: B.bodyText }}>
            Track user engagement from view to purchase • Filtered by selected date range
          </p>
        </div>

        {/* Table */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {/* Table Header */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1fr", 
            padding: "0.6rem 0.75rem",
            background: B.cream,
            borderRadius: "6px",
            fontSize: "0.65rem",
            fontWeight: 600,
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            <div>Product Name</div>
            <div>Views/Clicks</div>
            <div>Add to Cart</div>
            <div>Conversions</div>
            <div>Cancellations</div>
          </div>

          {/* Table Rows */}
          {data.topProducts.map((product, index) => {
            // Use conversion rate from API (already calculated server-side)
            const conversionRate = product.conversionRate || 0;
            const progressWidth = conversionRate;
            
            return (
              <div 
                key={index}
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1fr", 
                  padding: "0.75rem",
                  borderBottom: `1px solid ${B.lightGray}`,
                  alignItems: "center"
                }}
              >
                <div style={{ fontSize: "0.85rem", color: B.darkText, fontWeight: 500 }}>
                  {product.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: B.bodyText }}>
                  {product.views.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.8rem", color: B.bodyText }}>
                  {product.addToCart.toLocaleString()}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: B.darkText }}>
                      {product.conversions.toLocaleString()}
                    </span>
                    <span style={{
                      padding: "0.15rem 0.5rem",
                      background: conversionRate > 10 ? "#E8F5E9" : conversionRate > 0 ? "#FFF3E0" : B.lightGray,
                      color: conversionRate > 10 ? B.seafoam : conversionRate > 0 ? "#FF9800" : B.midGray,
                      borderRadius: "10px",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}>
                      {conversionRate}%
                    </span>
                  </div>
                  {/* FUNNEL VISUALIZATION: Seafoam progress bar */}
                  <div style={{ 
                    width: "100%", 
                    height: "4px", 
                    background: B.lightGray, 
                    borderRadius: "2px",
                    overflow: "hidden"
                  }}>
                    <div style={{
                      width: `${progressWidth}%`,
                      height: "100%",
                      background: B.seafoam,
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#D32F2F", fontWeight: 500 }}>
                  {product.cancellations}
                </div>
              </div>
            );
          })}
          {data.topProducts.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: B.midGray, fontSize: "0.85rem" }}>
              No product interaction data available yet. Start tracking by viewing products on the storefront.
            </div>
          )}
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
