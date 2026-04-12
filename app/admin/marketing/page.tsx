"use client";

import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Instagram,
  Search,
  Megaphone,
  Mail,
  UserPlus,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
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

// Marketing Strategies Data
const marketingStrategies = [
  {
    id: 1,
    name: "Instagram Ads",
    icon: Instagram,
    color: "#E4405F",
    spend: 45000,
    revenue: 140000,
    roas: 3.1,
    description: "Targeting women 18-35 via Reels and Story ads. Promotes Hair DNA Quiz and product launches.",
    impressions: 420000,
    ctr: 2.3,
    conversions: 284,
    channel: "Social Media",
  },
  {
    id: 2,
    name: "Google Ads (Search + Display)",
    icon: Search,
    color: "#4285F4",
    spend: 40000,
    revenue: 135000,
    roas: 3.4,
    description: 'Search keywords: "best hair serum India", "curly hair care online". Display retargeting for cart abandoners.',
    impressions: 310000,
    ctr: 3.1,
    conversions: 241,
    channel: "Search",
  },
  {
    id: 3,
    name: "Influencer & Affiliate Marketing",
    icon: Megaphone,
    color: "#F59E0B",
    spend: 38000,
    revenue: 180000,
    roas: 4.7,
    description: "12 active micro-influencers. 8% commission per sale. Top code: SCALP10 — 112 orders this month.",
    impressions: null,
    ctr: null,
    conversions: 387,
    channel: "Affiliate",
  },
  {
    id: 4,
    name: "Email & WhatsApp Campaigns",
    icon: Mail,
    color: "#10B981",
    spend: 4000,
    revenue: 125000,
    roas: 31,
    description: "Post-quiz emails, abandoned cart recovery, membership upsells. This directly feeds the AI Upsell Conversions revenue stream.",
    impressions: 8400,
    ctr: 14,
    conversions: 412,
    channel: "Email",
    openRate: 38,
  },
  {
    id: 5,
    name: "Referral Program",
    icon: UserPlus,
    color: "#8B5CF6",
    spend: 18000,
    revenue: 85000,
    roas: 4.7,
    description: "Existing customers refer friends. Both get 200 bonus points. Referrals sent: 520 | Signups: 198 | Converted to purchase: 134",
    impressions: null,
    ctr: null,
    conversions: 134,
    channel: "Referral",
  },
];

const totalSpend = 105000;
const totalRevenue = 410000;
const overallROAS = 3.9;
const newCustomers = 312;
const cac = 336;

// Chart Data
const spendVsRevenueData = marketingStrategies.map((strategy) => ({
  name: strategy.name.split(" ")[0],
  spend: strategy.spend,
  revenue: strategy.revenue,
}));

const budgetAllocationData = [
  { name: "Instagram Ads", value: 43, color: "#E4405F" },
  { name: "Google Ads", value: 38, color: "#4285F4" },
  { name: "Affiliates", value: 36, color: "#F59E0B" },
  { name: "Email", value: 4, color: "#10B981" },
  { name: "Referral", value: 17, color: "#8B5CF6" },
];

const customerAcquisitionData = [
  { month: "Oct", customers: 198 },
  { month: "Nov", customers: 224 },
  { month: "Dec", customers: 287 },
  { month: "Jan", customers: 265 },
  { month: "Feb", customers: 298 },
  { month: "Mar", customers: 312 },
];

// Funnel Data
const funnelSteps = [
  { step: "Quiz Started", count: 3200, percentage: 100, color: B.seafoam },
  { step: "Quiz Completed", count: 2180, percentage: 68, color: "#4285F4" },
  { step: "Recommendation Viewed", count: 1740, percentage: 80, color: "#F59E0B" },
  { step: "Added to Cart", count: 890, percentage: 51, color: "#EC4899" },
  { step: "Purchased within 48hrs", count: 412, percentage: 46, color: "#10B981" },
];

// Influencer Data
const influencers = [
  {
    handle: "@hairwithpriya",
    platform: "Instagram",
    followers: "1,20,000",
    promoCode: "PRIYA15",
    orders: 84,
    revenue: 48300,
    commission: 7200,
    status: "Active",
  },
  {
    handle: "@curlsbyneha",
    platform: "YouTube",
    followers: "89,000",
    promoCode: "NEHA20",
    orders: 67,
    revenue: 38500,
    commission: 5800,
    status: "Active",
  },
  {
    handle: "@scalpcareclub",
    platform: "Instagram",
    followers: "2,10,000",
    promoCode: "SCALP10",
    orders: 112,
    revenue: 64400,
    commission: 9600,
    status: "Active",
  },
  {
    handle: "@trichologytalks",
    platform: "YouTube",
    followers: "1,45,000",
    promoCode: "TRICH12",
    orders: 58,
    revenue: 33400,
    commission: 6000,
    status: "Active",
  },
  {
    handle: "@oilycurlygirl",
    platform: "Instagram",
    followers: "67,000",
    promoCode: "OILY10",
    orders: 66,
    revenue: 37900,
    commission: 5700,
    status: "Active",
  },
];

// Email Campaign Data
const emailCampaigns = [
  {
    name: "Your Hair DNA Results",
    sentTo: "Quiz completers (2,180)",
    date: "1 Mar",
    openRate: 52,
    clickRate: 21,
    conversions: 198,
    revenue: 38200,
  },
  {
    name: "You left something behind",
    sentTo: "Cart abandoners (640)",
    date: "8 Mar",
    openRate: 44,
    clickRate: 18,
    conversions: 87,
    revenue: 16700,
  },
  {
    name: "Upgrade to Gold — You're Close",
    sentTo: "Silver members (380)",
    date: "15 Mar",
    openRate: 31,
    clickRate: 12,
    conversions: 34,
    revenue: 33600,
  },
  {
    name: "New Launch: BioKeratin Serum",
    sentTo: "All subscribers (8,400)",
    date: "22 Mar",
    openRate: 28,
    clickRate: 9,
    conversions: 93,
    revenue: 36500,
  },
];

export default function MarketingPage() {
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
          Marketing Strategy & Campaign Intelligence
        </h1>
        <p style={{ fontSize: "0.9rem", color: B.bodyText }}>
          Real-time performance tracking across all marketing channels
        </p>
      </div>

      {/* SECTION 1: Header KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {/* Total Marketing Spend */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#EF444415",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <DollarSign size={20} color="#EF4444" />
          </div>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Total Marketing Spend
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.darkText }}>
            ₹{(totalSpend / 1000).toFixed(0)}k
          </div>
          <div style={{ fontSize: "0.7rem", color: B.midGray, marginTop: "0.25rem" }}>per month</div>
        </div>

        {/* Total Attributed Revenue */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: `${B.seafoam}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <TrendingUp size={20} color={B.seafoam} />
          </div>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Attributed Revenue
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.seafoam }}>
            ₹{(totalRevenue / 100000).toFixed(1)}L
          </div>
          <div style={{ fontSize: "0.7rem", color: B.midGray, marginTop: "0.25rem" }}>per month</div>
        </div>

        {/* Overall ROAS */}
        <div style={{ background: `linear-gradient(135deg, ${B.seafoam}15, ${B.teal}10)`, borderRadius: "12px", padding: "1.25rem", border: `2px solid ${B.seafoam}` }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <Target size={20} color={B.seafoam} />
          </div>
          <div style={{ fontSize: "0.75rem", color: B.seafoam, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>
            Overall ROAS
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.8rem", fontWeight: 700, color: B.seafoam }}>
            {overallROAS}x
          </div>
          <div style={{ fontSize: "0.7rem", color: B.seafoam, marginTop: "0.25rem", opacity: 0.8 }}>Return on Ad Spend</div>
        </div>

        {/* New Customers */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#10B98115",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <Users size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            New Customers
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.darkText }}>
            {newCustomers}
          </div>
          <div style={{ fontSize: "0.7rem", color: B.midGray, marginTop: "0.25rem" }}>this month</div>
        </div>

        {/* CAC */}
        <div style={{ background: "white", borderRadius: "12px", padding: "1.25rem", border: `1px solid ${B.lightGray}` }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#F59E0B15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <UserPlus size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: "0.75rem", color: B.bodyText, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            CAC
          </div>
          <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.darkText }}>
            ₹{cac}
          </div>
          <div style={{ fontSize: "0.7rem", color: B.midGray, marginTop: "0.25rem" }}>per customer</div>
        </div>
      </div>

      {/* SECTION 2: Marketing Strategy Cards */}
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
          Active Marketing Channels
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "1.25rem" }}>
          {marketingStrategies.map((strategy) => {
            const Icon = strategy.icon;
            return (
              <div
                key={strategy.id}
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
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: `${strategy.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={24} color={strategy.color} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "0.25rem" }}>
                        {strategy.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.2rem 0.6rem",
                          background: `${strategy.color}15`,
                          color: strategy.color,
                          borderRadius: "6px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {strategy.channel}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0.5rem 0.75rem",
                      background: strategy.roas >= 4 ? "#10B98115" : strategy.roas >= 3 ? `${B.seafoam}15` : "#F59E0B15",
                      borderRadius: "8px",
                      border: `1px solid ${strategy.roas >= 4 ? "#10B98130" : strategy.roas >= 3 ? `${B.seafoam}30` : "#F59E0B30"}`,
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", color: B.bodyText, marginBottom: "0.15rem" }}>ROAS</div>
                    <div
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: strategy.roas >= 4 ? "#10B981" : strategy.roas >= 3 ? B.seafoam : "#F59E0B",
                      }}
                    >
                      {strategy.roas}x
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ padding: "0.75rem", background: B.cream, borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.7rem", color: B.bodyText, marginBottom: "0.25rem" }}>Monthly Spend</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#EF4444" }}>
                      ₹{(strategy.spend / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem", background: B.cream, borderRadius: "8px" }}>
                    <div style={{ fontSize: "0.7rem", color: B.bodyText, marginBottom: "0.25rem" }}>Revenue Attributed</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#10B981" }}>
                      ₹{(strategy.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.85rem", color: B.bodyText, lineHeight: 1.6, marginBottom: "1rem" }}>
                  {strategy.description}
                </p>

                {/* Performance Stats */}
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: B.bodyText }}>
                  {strategy.impressions && (
                    <div>
                      <span style={{ fontWeight: 600, color: B.darkText }}>
                        {strategy.impressions.toLocaleString("en-IN")}
                      </span>{" "}
                      impressions
                    </div>
                  )}
                  {strategy.ctr && (
                    <div>
                      <span style={{ fontWeight: 600, color: B.darkText }}>{strategy.ctr}%</span> CTR
                    </div>
                  )}
                  {strategy.openRate && (
                    <div>
                      <span style={{ fontWeight: 600, color: B.darkText }}>{strategy.openRate}%</span> open rate
                    </div>
                  )}
                  <div>
                    <span style={{ fontWeight: 600, color: B.darkText }}>{strategy.conversions}</span> conversions
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Charts */}
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
          Performance Analytics
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
          {/* Chart 1: Spend vs Revenue */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              Spend vs Revenue per Channel
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={spendVsRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
                <XAxis dataKey="name" stroke={B.midGray} style={{ fontSize: "0.75rem" }} />
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
                <Bar dataKey="spend" fill="#EF4444" radius={[8, 8, 0, 0]} name="Spend" />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Budget Allocation */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              Marketing Budget Allocation
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={budgetAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `${value}%`}
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {/* Chart 3: Customer Acquisition Trend */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "1rem" }}>
              New Customer Acquisition (Last 6 Months)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={customerAcquisitionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
                <XAxis dataKey="month" stroke={B.midGray} style={{ fontSize: "0.75rem" }} />
                <YAxis stroke={B.midGray} style={{ fontSize: "0.75rem" }} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                  }}
                />
                <Line type="monotone" dataKey="customers" stroke={B.seafoam} strokeWidth={3} dot={{ fill: B.seafoam, r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 4: Funnel */}
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: B.darkText, marginBottom: "0.5rem" }}>
              Hair DNA Quiz → Purchase Funnel
            </h3>
            <p style={{ fontSize: "0.8rem", color: B.bodyText, marginBottom: "1.5rem" }}>
              Explains AI Upsell Conversions revenue stream of ₹1,25,000
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {funnelSteps.map((step, index) => {
                const widthPercentage = (step.count / funnelSteps[0].count) * 100;
                return (
                  <div key={index}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: B.darkText }}>{step.step}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>
                          {step.count.toLocaleString("en-IN")}
                        </span>
                        {index > 0 && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.4rem",
                              background: `${step.color}15`,
                              color: step.color,
                              borderRadius: "4px",
                              fontWeight: 600,
                            }}
                          >
                            {step.percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "32px",
                        background: B.cream,
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${widthPercentage}%`,
                          height: "100%",
                          background: `linear-gradient(90deg, ${step.color}, ${step.color}dd)`,
                          borderRadius: "8px",
                          transition: "width 0.5s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Influencer Tracker Table */}
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
          Influencer Performance Tracker
        </h2>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}`, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${B.lightGray}` }}>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Influencer Handle
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Platform
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Followers
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Promo Code
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Orders
                </th>
                <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Revenue
                </th>
                <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Commission
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {influencers.map((influencer, index) => (
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
                  <td style={{ padding: "1rem 0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 500, color: B.darkText }}>{influencer.handle}</span>
                      <ExternalLink size={14} color={B.midGray} style={{ cursor: "pointer" }} />
                    </div>
                  </td>
                  <td style={{ padding: "1rem 0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.6rem",
                        background: influencer.platform === "Instagram" ? "#E440F515" : "#FF000015",
                        color: influencer.platform === "Instagram" ? "#E4405F" : "#FF0000",
                        borderRadius: "6px",
                        fontWeight: 600,
                      }}
                    >
                      {influencer.platform}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 0.75rem", fontSize: "0.85rem", color: B.bodyText }}>{influencer.followers}</td>
                  <td style={{ padding: "1rem 0.75rem" }}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: B.seafoam,
                        fontFamily: "monospace",
                      }}
                    >
                      {influencer.promoCode}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center", fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>
                    {influencer.orders}
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "right", fontSize: "0.9rem", fontWeight: 600, color: "#10B981" }}>
                    ₹{influencer.revenue.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "right", fontSize: "0.9rem", fontWeight: 600, color: "#EF4444" }}>
                    ₹{influencer.commission.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                      <CheckCircle size={14} color="#10B981" />
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10B981" }}>{influencer.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: Email Campaign Log Table */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "1.5rem",
          }}
        >
          Email Campaign Performance Log
        </h2>

        <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", border: `1px solid ${B.lightGray}`, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${B.lightGray}` }}>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Campaign Name
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Sent To
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Date
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Open Rate
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Click Rate
                </th>
                <th style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Conversions
                </th>
                <th style={{ padding: "0.75rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {emailCampaigns.map((campaign, index) => (
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
                  <td style={{ padding: "1rem 0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Mail size={16} color={B.seafoam} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 500, color: B.darkText }}>{campaign.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 0.75rem", fontSize: "0.85rem", color: B.bodyText }}>{campaign.sentTo}</td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center", fontSize: "0.85rem", color: B.bodyText }}>{campaign.date}</td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: campaign.openRate >= 40 ? "#10B981" : campaign.openRate >= 30 ? B.seafoam : "#F59E0B",
                      }}
                    >
                      {campaign.openRate}%
                    </span>
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: campaign.clickRate >= 15 ? "#10B981" : campaign.clickRate >= 10 ? B.seafoam : "#F59E0B",
                      }}
                    >
                      {campaign.clickRate}%
                    </span>
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center", fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>
                    {campaign.conversions}
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "right", fontSize: "0.9rem", fontWeight: 600, color: "#10B981" }}>
                    ₹{campaign.revenue.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Row */}
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
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: B.darkText }}>Total Email Campaign Revenue</div>
            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 700, color: B.seafoam }}>
              ₹{emailCampaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
