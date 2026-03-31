"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart,
  AlertTriangle, 
  RefreshCw, 
  UserPlus,
  FileText
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
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

interface DashboardStats {
  revenue: {
    total: number;
    formatted: string;
  };
  activeUsers: number;
  orderVolume: number;
  loyaltyLiabilities: number;
  criticalStock: {
    count: number;
  };
  salesVelocity: Array<{ date: string; amount: number }>;
  hairTypeDistribution: Array<{
    name: string;
    value: number;
  }>;
  biologicalDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  atRiskProducts: Array<{
    id: string;
    name: string;
    stock: number;
    riskLevel: string;
    depletionForecast: string;
  }>;
  topRegions: Array<{
    city: string;
    orders: number;
  }>;
  error?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: B.bodyText, fontSize: "0.85rem" }}>Loading Command Center...</p>
      </div>
    );
  }

  const totalBioProfiles = stats.biologicalDistribution.reduce((sum, b) => sum + b.value, 0);
  
  // Hair Type Distribution with colors
  const hairTypeColors: Record<string, string> = {
    Straight: "#2A9D8F", // Seafoam
    Wavy: "#E9C46A",     // Sand/Gold
    Curly: "#F4A261",    // Ochre
    Coily: "#264653",    // Dark Slate
  };

  const hairTypeData = stats.hairTypeDistribution.map(item => ({
    ...item,
    color: hairTypeColors[item.name] || B.midGray,
  }));

  const totalHairProfiles = hairTypeData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip for donut chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: B.teal,
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            color: "white",
            fontSize: "0.75rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].name}</p>
          <p style={{ margin: "0.25rem 0 0 0", opacity: 0.9 }}>
            {payload[0].value} users
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
      {/* Header with Quick Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: B.darkText,
          }}
        >
          Command Center
        </h1>
        
        {/* Quick Actions Bar */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin/customers" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "0.5rem 1rem",
                background: "white",
                color: B.darkText,
                border: `1px solid ${B.lightGray}`,
                borderRadius: "6px",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <UserPlus size={14} />
              Manage Users
            </button>
          </Link>
          <button
            onClick={() => alert("CSV export feature coming soon")}
            style={{
              padding: "0.5rem 1rem",
              background: "white",
              color: B.darkText,
              border: `1px solid ${B.lightGray}`,
              borderRadius: "6px",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <FileText size={14} />
            Monthly Report
          </button>
          <button
            onClick={fetchStats}
            style={{
              padding: "0.5rem 1rem",
              background: B.teal,
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {stats.error && (
        <div style={{ 
          padding: "0.6rem 0.85rem", 
          background: "#FFF4E5", 
          color: "#FF6B00", 
          borderRadius: "6px", 
          marginBottom: "1.25rem",
          fontSize: "0.8rem"
        }}>
          ⚠️ {stats.error}
        </div>
      )}

      {/* Condensed KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.85rem", marginBottom: "1.25rem" }}>
        {/* Revenue Insight */}
        <div style={{ background: "white", borderRadius: "8px", padding: "0.85rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "8px", 
            background: "#E8F5E9", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <TrendingUp size={18} color={B.seafoam} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Revenue (MTD)
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.35rem", fontWeight: 600, color: B.darkText }}>
              {stats.revenue.formatted}
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div style={{ background: "white", borderRadius: "8px", padding: "0.85rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "8px", 
            background: "#E3F2FD", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Users size={18} color="#1976D2" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Active Users
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.35rem", fontWeight: 600, color: B.darkText }}>
              {stats.activeUsers.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Order Volume */}
        <div style={{ background: "white", borderRadius: "8px", padding: "0.85rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "8px", 
            background: "#FFF3E0", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <ShoppingCart size={18} color="#FF9800" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Order Volume
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.35rem", fontWeight: 600, color: B.darkText }}>
              {stats.orderVolume.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Loyalty Liabilities */}
        <div style={{ background: "linear-gradient(135deg, rgba(42,157,143,0.12), rgba(42,157,143,0.06))", borderRadius: "8px", padding: "0.85rem", display: "flex", alignItems: "center", gap: "0.85rem", border: "1px solid rgba(42,157,143,0.2)" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "8px", 
            background: "rgba(42,157,143,0.2)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={B.seafoam} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: B.seafoam, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Loyalty Pts
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.35rem", fontWeight: 700, color: B.seafoam }}>
              {stats.loyaltyLiabilities.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Critical Stock Alert */}
        <div style={{ background: "#FFE5E5", borderRadius: "8px", padding: "0.85rem", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ 
            width: "36px", 
            height: "36px", 
            borderRadius: "8px", 
            background: "#FFCDD2", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0
          }}>
            <AlertTriangle size={18} color="#D32F2F" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "#8B0000", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>
              Critical Stock
            </div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.35rem", fontWeight: 600, color: "#D32F2F" }}>
              {stats.criticalStock.count.toString().padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* ERP Decision Support & CRM Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
        {/* Left Column: ERP Decision Support */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Sales Velocity Chart */}
          <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
            <div style={{ marginBottom: "0.85rem" }}>
              <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
                Sales Velocity
              </h3>
              <p style={{ fontSize: "0.75rem", color: B.bodyText }}>Last 30 days revenue trend</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.salesVelocity}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={B.seafoam} stopOpacity={0.3} />
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
                  formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Amount"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke={B.seafoam} 
                  strokeWidth={2}
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* At-Risk Inventory Heatmap */}
          <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
              <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText }}>
                At-Risk Inventory Heatmap
              </h3>
              <span style={{ 
                padding: "0.2rem 0.6rem", 
                background: "#FFE5E5", 
                color: "#D32F2F", 
                borderRadius: "10px", 
                fontSize: "0.65rem", 
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                TOP 5
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {/* Table Header */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "2fr 1fr 1.2fr 1.5fr", 
                padding: "0.5rem 0.65rem",
                background: B.cream,
                borderRadius: "6px",
                fontSize: "0.65rem",
                fontWeight: 600,
                color: B.bodyText,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                <div>Product Name</div>
                <div>Stock</div>
                <div>Risk Level</div>
                <div>Depletion Forecast</div>
              </div>

              {/* Table Rows */}
              {stats.atRiskProducts.length > 0 ? (
                stats.atRiskProducts.map((product) => (
                  <div 
                    key={product.id}
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "2fr 1fr 1.2fr 1.5fr", 
                      padding: "0.6rem 0.65rem",
                      borderBottom: `1px solid ${B.lightGray}`,
                      alignItems: "center"
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: B.darkText, fontWeight: 500 }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: B.bodyText }}>
                      {product.stock}
                    </div>
                    <div>
                      <span style={{
                        padding: "0.15rem 0.5rem",
                        background: product.riskLevel === "CRITICAL" ? "#FFE5E5" : product.riskLevel === "HIGH" ? "#FFF4E5" : "#FFF9E5",
                        color: product.riskLevel === "CRITICAL" ? "#D32F2F" : product.riskLevel === "HIGH" ? "#FF6B00" : "#FF9800",
                        borderRadius: "8px",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textTransform: "uppercase"
                      }}>
                        {product.riskLevel}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: product.depletionForecast === "Restock Required" ? "#D32F2F" : B.bodyText, fontWeight: 500 }}>
                      {product.depletionForecast}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "1.25rem", textAlign: "center", color: B.midGray, fontSize: "0.8rem" }}>
                  All products are well-stocked
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: CRM Insights */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Hair Type Distribution */}
          <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
              Hair Type Distribution
            </h3>
            <p style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.85rem" }}>
              Based on completed clinical diagnostics
            </p>
            
            {totalHairProfiles > 0 ? (
              <>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.85rem" }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={hairTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {hairTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {hairTypeData.map((item, index) => {
                    const percentage = Math.round((item.value / totalHairProfiles) * 100);
                    return (
                      <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                          <span style={{ fontSize: "13px", color: B.bodyText, fontFamily: "var(--font-inter), sans-serif" }}>
                            {item.name}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: B.darkText, fontFamily: "var(--font-inter), sans-serif" }}>
                          {percentage}% ({item.value})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ 
                padding: "2rem 0.85rem", 
                textAlign: "center", 
                background: B.lightGray, 
                borderRadius: "8px",
                color: B.midGray,
                fontSize: "0.8rem"
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.85rem" }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={[{ name: "No Data", value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        dataKey="value"
                      >
                        <Cell fill={B.lightGray} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p style={{ margin: 0, fontWeight: 500 }}>Awaiting Diagnostic Data</p>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.7rem", opacity: 0.7 }}>
                  No users have completed the quiz yet
                </p>
              </div>
            )}
          </div>

          {/* Top Purchasing Regions */}
          <div style={{ background: "white", borderRadius: "8px", padding: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1rem", color: B.darkText, marginBottom: "0.2rem" }}>
              Top Purchasing Regions
            </h3>
            <p style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.85rem" }}>Order distribution by city</p>
            
            {stats.topRegions.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {stats.topRegions.map((region, index) => (
                  <div 
                    key={index}
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "0.6rem",
                      background: B.cream,
                      borderRadius: "6px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        color: "white"
                      }}>
                        {index + 1}
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: B.darkText }}>
                        {region.city}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: B.seafoam }}>
                      {region.orders} orders
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: "1.25rem", 
                textAlign: "center", 
                background: B.cream, 
                borderRadius: "8px",
                color: B.midGray,
                fontSize: "0.8rem"
              }}>
                No regional data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
