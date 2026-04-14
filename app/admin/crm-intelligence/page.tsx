"use client";

import { useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import {
  Users,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Target,
  X,
  Send,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
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
  Legend,
  ResponsiveContainer,
} from "recharts";

// Brand Colors
const B = {
  forestTeal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
  darkText: "#2C4A42",
};

interface UserAnalysis {
  id: string;
  name: string;
  email: string;
  status: "active" | "at-risk" | "churned" | "new";
  daysSinceLastPurchase: number | null;
  lastPurchaseDate: string | null;
  loyaltyPoints: number;
  scalpCondition: string | null;
  porosity: string | null;
  hairType: string | null;
}

interface CRMData {
  hairDnaSegmentation: {
    scalpTypes: Record<string, number>;
    porosityLevels: Record<string, number>;
    hairTypes: Record<string, number>;
  };
  churnAnalysis: UserAnalysis[];
  churnStats: {
    active: number;
    atRisk: number;
    churned: number;
    new: number;
  };
  totalUsers: number;
  membershipDistribution: {
    bronze: number;
    silver: number;
    gold: number;
    none: number;
  };
  onboardingTrend: Array<{
    month: string;
    count: number;
  }>;
  churnRetentionTrend: Array<{
    month: string;
    retained: number;
    churned: number;
  }>;
  clvData: {
    averageCLV: number;
    topCustomer: { name: string; clv: number };
    clvByTier: Array<{ tier: string; clv: number }>;
  };
  customerTable: {
    customers: Array<{
      id: string;
      name: string;
      email: string;
      lastOrderDate: string | null;
      daysSinceLastOrder: number | null;
      membershipTier: "Bronze" | "Silver" | "Gold" | "None";
      totalOrders: number;
      totalSpent: number;
    }>;
    total: number;
  };
  actionsLog: Array<{
    trigger: string;
    customer: string;
    actionTaken: string;
    date: string;
    result: "converted" | "pending" | "no_response";
  }>;
}

interface ActiveFilter {
  type: "scalpCondition" | "porosity" | "hairType";
  value: string;
  displayName: string;
}

export default function CRMIntelligencePage() {
  const [data, setData] = useState<CRMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [campaignModal, setCampaignModal] = useState<{
    type: string;
    value: string;
    count: number;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/crm-intelligence");
      const json = await res.json();
      
      // Limit onboarding trend to last 2 months
      if (json.onboardingTrend && json.onboardingTrend.length > 2) {
        json.onboardingTrend = json.onboardingTrend.slice(-2);
      }
      
      setData(json);
    } catch (error) {
      console.error("Failed to fetch CRM data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on active filter
  const filteredUsers = data?.churnAnalysis.filter((user) => {
    if (!activeFilter) return true;
    
    const userValue = user[activeFilter.type];
    return userValue?.toLowerCase() === activeFilter.value.toLowerCase();
  }) || [];

  const handleFilterClick = (type: ActiveFilter["type"], value: string, displayName: string) => {
    if (activeFilter?.type === type && activeFilter?.value === value) {
      setActiveFilter(null); // Toggle off
    } else {
      setActiveFilter({ type, value, displayName });
    }
  };

  const clearFilter = () => setActiveFilter(null);

  if (loading || !data) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center",
        minHeight: "100vh",
        background: B.offWhite,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: `3px solid ${B.lightGray}`,
            borderTopColor: B.seafoam,
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p style={{ 
            color: B.bodyText, 
            fontSize: "0.9rem",
            fontFamily: "var(--font-inter)"
          }}>
            Loading Intelligence Dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "2rem", 
      background: B.offWhite, 
      minHeight: "100vh" 
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "2rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "2.25rem",
                fontWeight: 400,
                color: B.darkText,
                marginBottom: "0.5rem",
              }}
            >
              Customer Intelligence
            </h1>
            <p style={{ 
              fontSize: "0.9rem", 
              color: B.bodyText,
              fontFamily: "var(--font-inter)"
            }}>
              Interactive Hair DNA Segmentation & Retention Analytics
            </p>
          </div>

          {/* Clear Filter Button */}
          <AnimatePresence>
            {activeFilter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilter}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "12px",
                  background: B.seafoam,
                  color: "white",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                  boxShadow: `0 0 20px ${B.seafoam}40`,
                }}
              >
                <X size={16} />
                Clear Filter: {activeFilter.displayName}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <StatsOverview stats={data.churnStats} totalUsers={data.totalUsers} />

      {/* Hair DNA Segmentation with User List */}
      <HairDNASegmentation 
        data={data.hairDnaSegmentation}
        users={data.churnAnalysis}
        activeFilter={activeFilter}
        onFilterClick={handleFilterClick}
        onCampaignClick={(type, value, count) => setCampaignModal({ type, value, count })}
      />

      {/* Customer Onboarding & Membership Distribution - Side by Side */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "1.5rem",
        marginBottom: "1.5rem",
        alignItems: "stretch"
      }}>
        <CustomerOnboardingChart data={data.onboardingTrend} />
        <MembershipDistribution data={data.membershipDistribution} totalUsers={data.totalUsers} />
      </div>

      {/* Churn vs Retention Bar Chart */}
      <ChurnRetentionChart data={data.churnRetentionTrend} />

      {/* Customer Activity Table */}
      <CustomerActivityTable data={data.customerTable} />

      {/* CLV Panel */}
      <CLVPanel data={data.clvData} />

      {/* Automated CRM Actions Log */}
      <ActionsLog data={data.actionsLog} />

      {/* Campaign Modal */}
      {campaignModal && (
        <CampaignModal
          segment={campaignModal}
          onClose={() => setCampaignModal(null)}
        />
      )}
    </div>
  );
}

// Stats Overview Component
function StatsOverview({ stats, totalUsers }: { 
  stats: CRMData["churnStats"]; 
  totalUsers: number;
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const statCards = [
    { 
      label: "Active Users", 
      value: stats.active, 
      icon: Users, 
      color: "#10B981",
      bg: "#D1FAE5" 
    },
    { 
      label: "At Risk", 
      value: stats.atRisk, 
      icon: AlertCircle, 
      color: "#F59E0B",
      bg: "#FEF3C7" 
    },
    { 
      label: "Churned", 
      value: stats.churned, 
      icon: TrendingUp, 
      color: "#EF4444",
      bg: "#FEE2E2" 
    },
    { 
      label: "New Users", 
      value: stats.new, 
      icon: Sparkles, 
      color: B.seafoam,
      bg: "#CCFBF1" 
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: "1rem",
        marginBottom: "2rem"
      }}
    >
      {statCards.map((stat) => (
        <motion.div
          key={stat.label}
          variants={item}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: "white",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "1.25rem",
            border: `1px solid ${B.lightGray}`,
            cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: stat.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: B.bodyText,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontFamily: "monospace",
              }}>
                {stat.label}
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: "2rem",
            fontWeight: 700,
            color: B.darkText,
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: "0.75rem",
            color: B.midGray,
            fontFamily: "var(--font-inter)",
          }}>
            {((stat.value / totalUsers) * 100).toFixed(1)}% of total
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Hair DNA Segmentation Component with Horizontal Layout and User List
function HairDNASegmentation({ 
  data,
  users,
  activeFilter,
  onFilterClick,
  onCampaignClick
}: { 
  data: CRMData["hairDnaSegmentation"];
  users: UserAnalysis[];
  activeFilter: ActiveFilter | null;
  onFilterClick: (type: ActiveFilter["type"], value: string, displayName: string) => void;
  onCampaignClick: (type: string, value: string, count: number) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const scalpData = Object.entries(data.scalpTypes).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    rawName: name,
  }));

  const porosityData = Object.entries(data.porosityLevels).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    rawName: name,
  }));

  const hairTypeData = Object.entries(data.hairTypes).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    rawName: name,
  }));

  // Filter users based on active filter
  const filteredUsers = users.filter((user) => {
    if (!activeFilter) return true;
    const userValue = user[activeFilter.type];
    return userValue?.toLowerCase() === activeFilter.value.toLowerCase();
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "1.5rem",
        border: `1px solid rgba(42, 157, 143, 0.1)`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "1.5rem",
          fontWeight: 400,
          color: B.darkText,
          marginBottom: "0.25rem",
        }}>
          Hair DNA Segmentation Engine
        </h2>
        <p style={{
          fontSize: "0.85rem",
          color: B.bodyText,
          fontFamily: "var(--font-inter)",
        }}>
          Click segments to filter • Click target icon to launch campaigns
        </p>
      </div>

      {/* Three Column Horizontal Layout */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr 1fr", 
        gap: "1.5rem",
        marginBottom: "1.5rem"
      }}>
        <SegmentGroup 
          title="Scalp Types" 
          data={scalpData} 
          filterType="scalpCondition"
          activeFilter={activeFilter}
          onFilterClick={onFilterClick}
          onCampaignClick={onCampaignClick}
        />
        <SegmentGroup 
          title="Porosity Levels" 
          data={porosityData} 
          filterType="porosity"
          activeFilter={activeFilter}
          onFilterClick={onFilterClick}
          onCampaignClick={onCampaignClick}
        />
        <SegmentGroup 
          title="Hair Types" 
          data={hairTypeData} 
          filterType="hairType"
          activeFilter={activeFilter}
          onFilterClick={onFilterClick}
          onCampaignClick={onCampaignClick}
        />
      </div>

      {/* User Count Info */}
      <div style={{
        fontSize: "0.85rem",
        color: B.bodyText,
        fontFamily: "var(--font-inter)",
        marginBottom: "1rem",
        fontWeight: 600,
      }}>
        {activeFilter 
          ? `Showing ${filteredUsers.length} of ${users.length} users`
          : `Showing all ${users.length} users`
        }
      </div>

      {/* User List Table */}
      <div style={{ 
        maxHeight: "400px", 
        overflowY: "auto",
        borderRadius: "12px",
        border: `1px solid ${B.lightGray}`,
      }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1fr 1fr",
          padding: "0.75rem 1rem",
          background: B.cream,
          borderRadius: "12px 12px 0 0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ 
            fontSize: "0.7rem", 
            fontWeight: 700, 
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "monospace",
          }}>
            Name
          </div>
          <div style={{ 
            fontSize: "0.7rem", 
            fontWeight: 700, 
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "monospace",
          }}>
            Email
          </div>
          <div style={{ 
            fontSize: "0.7rem", 
            fontWeight: 700, 
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "monospace",
          }}>
            Status
          </div>
          <div style={{ 
            fontSize: "0.7rem", 
            fontWeight: 700, 
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "monospace",
          }}>
            Days Idle
          </div>
        </div>

        {/* Rows */}
        <AnimatePresence mode="popLayout">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserListRow key={user.id} user={user} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "3rem 1rem",
                textAlign: "center",
                color: B.midGray,
              }}
            >
              <Filter size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                No customers found for this segment
              </p>
              <p style={{ fontSize: "0.75rem" }}>
                Try selecting a different segment
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Segment Group Component (Vertical list of chips)
function SegmentGroup({ 
  title, 
  data, 
  filterType,
  activeFilter,
  onFilterClick,
  onCampaignClick
}: { 
  title: string; 
  data: Array<{ name: string; value: number; rawName: string }>; 
  filterType: ActiveFilter["type"];
  activeFilter: ActiveFilter | null;
  onFilterClick: (type: ActiveFilter["type"], value: string, displayName: string) => void;
  onCampaignClick: (type: string, value: string, count: number) => void;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [B.seafoam, "#F59E0B", "#8B5CF6", "#EC4899", "#10B981"];

  return (
    <div>
      <h3 style={{
        fontSize: "0.75rem",
        fontWeight: 700,
        color: B.darkText,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontFamily: "monospace",
        marginBottom: "0.75rem",
      }}>
        {title}
      </h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const isActive = activeFilter?.type === filterType && 
                          activeFilter?.value.toLowerCase() === item.rawName.toLowerCase();

          return (
            <motion.div
              key={item.name}
              onClick={() => onFilterClick(filterType, item.rawName, item.name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 12px",
                borderRadius: "8px",
                background: isActive ? `${B.seafoam}15` : B.cream,
                border: isActive ? `2px solid ${B.seafoam}` : "2px solid transparent",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "var(--font-inter)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  fontWeight: 600,
                  color: B.darkText,
                }}>
                  {item.name}
                </span>
                {isActive && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "2px 6px",
                    borderRadius: "6px",
                    background: B.seafoam,
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}>
                    ACTIVE
                  </span>
                )}
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: colors[index % colors.length],
                  fontFamily: "monospace",
                }}>
                  {percentage.toFixed(0)}%
                </span>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCampaignClick(title, item.name, item.value);
                  }}
                  style={{
                    background: colors[index % colors.length],
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <Target size={10} color="white" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// User List Row Component
function UserListRow({ user }: { user: UserAnalysis }) {
  const statusConfig = {
    active: { 
      color: "#10B981", 
      bg: "#D1FAE5",
      label: "Active",
    },
    "at-risk": { 
      color: "#F59E0B", 
      bg: "#FEF3C7", 
      label: "At Risk",
    },
    churned: { 
      color: "#EF4444", 
      bg: "#FEE2E2", 
      label: "Churned",
    },
    new: { 
      color: B.seafoam, 
      bg: "#CCFBF1", 
      label: "New",
    },
  };

  const config = statusConfig[user.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 2fr 1fr 1fr",
        padding: "0.75rem 1rem",
        borderBottom: `1px solid ${B.lightGray}`,
        alignItems: "center",
      }}
    >
      <div style={{
        fontSize: "0.85rem",
        fontWeight: 600,
        color: B.darkText,
        fontFamily: "var(--font-inter)",
      }}>
        {user.name}
      </div>

      <div style={{
        fontSize: "0.75rem",
        color: B.midGray,
        fontFamily: "monospace",
      }}>
        {user.email}
      </div>

      <div>
        <span style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          borderRadius: "20px",
          background: config.bg,
          color: config.color,
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontFamily: "monospace",
        }}>
          {config.label}
        </span>
      </div>

      <div style={{
        fontSize: "0.85rem",
        fontWeight: 600,
        color: B.darkText,
        fontFamily: "monospace",
      }}>
        {user.daysSinceLastPurchase !== null ? user.daysSinceLastPurchase : "—"}
      </div>
    </motion.div>
  );
}

// Campaign Modal Component (Reduced Size)
function CampaignModal({ 
  segment, 
  onClose 
}: { 
  segment: { type: string; value: string; count: number }; 
  onClose: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const handleSendCampaign = async () => {
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Campaign sent to ${segment.count} users with ${segment.value}!`);
    setSending(false);
    onClose();
  };

  const productRecommendation = getProductRecommendation(segment.value);
  const emailPreview = `Hi [Name], we noticed your ${segment.value.toLowerCase()} hair needs special care. Try our ${productRecommendation.name} with 20% OFF!`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(13, 59, 68, 0.7)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "1.25rem",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 25px 70px rgba(13, 59, 68, 0.4)",
        }}
      >
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start",
          marginBottom: "1rem"
        }}>
          <div>
            <h3 style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "1.35rem",
              fontWeight: 400,
              color: B.darkText,
              marginBottom: "0.25rem",
            }}>
              Launch Campaign
            </h3>
            <p style={{
              fontSize: "0.8rem",
              color: B.bodyText,
              fontFamily: "var(--font-inter)",
            }}>
              Personalized marketing
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: B.lightGray,
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color={B.darkText} />
          </motion.button>
        </div>

        {/* Segment Summary */}
        <div style={{
          background: `${B.seafoam}10`,
          border: `2px solid ${B.seafoam}30`,
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: B.seafoam,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Target size={18} color="white" />
            </div>
            <div>
              <div style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: B.seafoam,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontFamily: "monospace",
              }}>
                Target Segment
              </div>
              <div style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: B.darkText,
                fontFamily: "var(--font-inter)",
              }}>
                {segment.value}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: "0.8rem",
            color: B.bodyText,
            fontFamily: "var(--font-inter)",
          }}>
            Targeting <span style={{ fontWeight: 700, color: B.seafoam }}>{segment.count} users</span>
          </div>
        </div>

        {/* Product Recommendation */}
        <div style={{
          background: B.cream,
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1rem",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}>
            <Sparkles size={16} color={B.seafoam} />
            <h4 style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: B.darkText,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "monospace",
            }}>
              Recommended Product
            </h4>
          </div>
          <div style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: B.darkText,
            marginBottom: "0.25rem",
            fontFamily: "var(--font-inter)",
          }}>
            {productRecommendation.name}
          </div>
          <p style={{
            fontSize: "0.75rem",
            color: B.bodyText,
            lineHeight: "1.4",
            fontFamily: "var(--font-inter)",
          }}>
            {productRecommendation.description.substring(0, 80)}...
          </p>
        </div>

        {/* Email Preview */}
        <div style={{
          background: B.offWhite,
          borderRadius: "10px",
          padding: "0.75rem",
          marginBottom: "1rem",
          border: `1px solid ${B.lightGray}`,
        }}>
          <div style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}>
            Email Preview
          </div>
          <div style={{
            fontSize: "0.75rem",
            color: B.darkText,
            fontFamily: "var(--font-inter)",
            fontStyle: "italic",
            overflow: showFullPreview ? "visible" : "hidden",
            maxHeight: showFullPreview ? "none" : "3.6em",
            lineHeight: "1.2em",
          }}>
            {emailPreview}
          </div>
          {emailPreview.length > 100 && (
            <button
              onClick={() => setShowFullPreview(!showFullPreview)}
              style={{
                marginTop: "0.5rem",
                fontSize: "0.7rem",
                color: B.seafoam,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: "var(--font-inter)",
              }}
            >
              {showFullPreview ? "Show less" : "View full preview"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            disabled={sending}
            style={{
              flex: 1,
              padding: "0",
              height: "36px",
              borderRadius: "10px",
              background: B.lightGray,
              color: B.darkText,
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: sending ? "not-allowed" : "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendCampaign}
            disabled={sending}
            style={{
              flex: 2,
              padding: "0",
              height: "36px",
              borderRadius: "10px",
              background: sending ? B.midGray : `linear-gradient(135deg, ${B.seafoam}, ${B.forestTeal})`,
              color: "white",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: sending ? "not-allowed" : "pointer",
              fontFamily: "var(--font-inter)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {sending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                  }}
                />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} />
                Send Campaign
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Customer Onboarding Line Chart (Last 2 Months)
function CustomerOnboardingChart({ data }: { data: Array<{ month: string; count: number }> }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        border: `1px solid ${B.lightGray}`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-playfair), serif",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: B.darkText,
        marginBottom: "0.5rem",
      }}>
        Customer Onboarding
      </h2>
      <p style={{
        fontSize: "0.85rem",
        color: B.bodyText,
        fontFamily: "var(--font-inter)",
        marginBottom: "1.5rem",
      }}>
        Last 2 Months
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={B.seafoam} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={B.seafoam} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
          <XAxis dataKey="month" stroke={B.bodyText} style={{ fontSize: "0.75rem" }} />
          <YAxis stroke={B.bodyText} style={{ fontSize: "0.75rem" }} />
          <Tooltip 
            contentStyle={{ 
              background: "white", 
              border: `1px solid ${B.lightGray}`,
              borderRadius: "8px",
              fontSize: "0.85rem"
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke={B.seafoam} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorCount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Membership Distribution Donut Chart (With Percentage Labels)
function MembershipDistribution({ data, totalUsers }: { 
  data: { bronze: number; silver: number; gold: number; none: number };
  totalUsers: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const chartData = [
    { name: "Bronze", value: data.bronze, color: "#CD7F32" },
    { name: "Silver", value: data.silver, color: "#C0C0C0" },
    { name: "Gold", value: data.gold, color: "#FFD700" },
    { name: "None", value: data.none, color: B.midGray },
  ];

  // Custom label renderer to show percentage
  const renderCustomLabel = (entry: any) => {
    const percentage = totalUsers > 0 ? ((entry.value / totalUsers) * 100).toFixed(1) : "0";
    return `${percentage}%`;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        border: `1px solid ${B.lightGray}`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-playfair), serif",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: B.darkText,
        marginBottom: "1.5rem",
      }}>
        Membership Tier Breakdown
      </h2>

      {/* Donut Chart Only - Centered */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={5}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any, name: any) => {
                const percentage = totalUsers > 0 ? ((value / totalUsers) * 100).toFixed(1) : "0";
                return [`${value} (${percentage}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Churn vs Retention Bar Chart
function ChurnRetentionChart({ data }: { 
  data: Array<{ month: string; retained: number; churned: number }> 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const latestMonth = data[data.length - 1];
  const total = latestMonth.retained + latestMonth.churned;
  const retentionRate = total > 0 ? ((latestMonth.retained / total) * 100).toFixed(1) : "0";
  const churnRate = total > 0 ? ((latestMonth.churned / total) * 100).toFixed(1) : "0";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        border: `1px solid ${B.lightGray}`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-playfair), serif",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: B.darkText,
        marginBottom: "1.5rem",
      }}>
        Churn vs Retention — Last 6 Months
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
          <XAxis dataKey="month" stroke={B.bodyText} style={{ fontSize: "0.75rem" }} />
          <YAxis stroke={B.bodyText} style={{ fontSize: "0.75rem" }} />
          <Tooltip 
            contentStyle={{ 
              background: "white", 
              border: `1px solid ${B.lightGray}`,
              borderRadius: "8px",
              fontSize: "0.85rem"
            }} 
          />
          <Legend />
          <Bar dataKey="retained" fill={B.seafoam} name="Retained" />
          <Bar dataKey="churned" fill="#EF4444" name="Churned" />
        </BarChart>
      </ResponsiveContainer>

      {/* Retention & Churn Rates */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
        <div style={{
          background: "#D1FAE5",
          borderRadius: "12px",
          padding: "1rem",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#10B981",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}>
            Retention Rate
          </div>
          <div style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#10B981",
            fontFamily: "monospace",
          }}>
            {retentionRate}%
          </div>
        </div>
        <div style={{
          background: "#FEE2E2",
          borderRadius: "12px",
          padding: "1rem",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#EF4444",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}>
            Churn Rate
          </div>
          <div style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#EF4444",
            fontFamily: "monospace",
          }}>
            {churnRate}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Customer Activity Table with Coupon Gifting
function CustomerActivityTable({ data }: { data: CRMData["customerTable"] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "new" | "at-risk" | "churned" | "never">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [giftingUser, setGiftingUser] = useState<string | null>(null);
  const [couponType, setCouponType] = useState("100");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [sentCoupons, setSentCoupons] = useState<Set<string>>(new Set());
  const itemsPerPage = 20;

  const filteredCustomers = data.customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === "new" && customer.daysSinceLastOrder !== null && customer.daysSinceLastOrder < 30) return true;
    if (filter === "at-risk" && customer.daysSinceLastOrder !== null && customer.daysSinceLastOrder >= 30 && customer.daysSinceLastOrder <= 90) return true;
    if (filter === "churned" && customer.daysSinceLastOrder !== null && customer.daysSinceLastOrder > 90) return true;
    if (filter === "never" && customer.daysSinceLastOrder === null) return true;
    
    return false;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleGiftCoupon = async (userId: string, userName: string) => {
    try {
      const res = await fetch("/api/admin/crm/gift-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, couponType }),
      });

      if (res.ok) {
        setToast({ message: `✓ Coupon sent to ${userName}`, type: "success" });
        setSentCoupons(prev => new Set(prev).add(userId));
        setTimeout(() => {
          setSentCoupons(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }, 3000);
      } else {
        setToast({ message: "Failed to send coupon", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Error sending coupon", type: "error" });
    } finally {
      setGiftingUser(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const getDaysColor = (days: number | null) => {
    if (days === null) return { bg: B.lightGray, text: B.midGray };
    if (days < 30) return { bg: "#D1FAE5", text: "#10B981" };
    if (days <= 60) return { bg: "#FEF3C7", text: "#F59E0B" };
    if (days <= 90) return { bg: "#FED7AA", text: "#EA580C" };
    return { bg: "#FEE2E2", text: "#EF4444" };
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      "Gold": "#FFD700",
      "Silver": "#C0C0C0",
      "Bronze": "#CD7F32",
      "None": B.midGray,
    };
    return colors[tier] || B.midGray;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        border: `1px solid ${B.lightGray}`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-playfair), serif",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: B.darkText,
        marginBottom: "1.5rem",
      }}>
        Customer Activity & Re-engagement
      </h2>

      {/* Search and Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: B.midGray }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 0.75rem 0.75rem 2.5rem",
              borderRadius: "12px",
              border: `1px solid ${B.lightGray}`,
              fontSize: "0.85rem",
              fontFamily: "var(--font-inter)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { key: "all", label: "All" },
            { key: "new", label: "New (<30d)" },
            { key: "at-risk", label: "At Risk (30-90d)" },
            { key: "churned", label: "Churned (90+d)" },
            { key: "never", label: "Never Ordered" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                border: `2px solid ${filter === key ? B.seafoam : B.lightGray}`,
                background: filter === key ? `${B.seafoam}15` : "white",
                color: filter === key ? B.seafoam : B.bodyText,
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: B.cream }}>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Customer</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Email</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Membership</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Last Order</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Days Since</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Orders</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Total Spent</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => {
              const daysColor = getDaysColor(customer.daysSinceLastOrder);
              const isSent = sentCoupons.has(customer.id);
              
              return (
                <tr key={customer.id} style={{ borderBottom: `1px solid ${B.lightGray}` }}>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: B.darkText, fontFamily: "var(--font-inter)" }}>{customer.name}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: B.bodyText, fontFamily: "monospace" }}>{customer.email}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      background: `${getTierColor(customer.membershipTier)}20`,
                      color: getTierColor(customer.membershipTier),
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}>
                      {customer.membershipTier}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: B.bodyText, fontFamily: "monospace" }}>
                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      background: daysColor.bg,
                      color: daysColor.text,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}>
                      {customer.daysSinceLastOrder !== null ? `${customer.daysSinceLastOrder}d` : "Never"}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: B.darkText, fontFamily: "monospace" }}>{customer.totalOrders}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: B.darkText, fontFamily: "monospace" }}>₹{customer.totalSpent.toFixed(0)}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      onClick={() => setGiftingUser(customer.id)}
                      disabled={isSent}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        background: isSent ? "#10B981" : B.seafoam,
                        color: "white",
                        border: "none",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: isSent ? "default" : "pointer",
                        fontFamily: "var(--font-inter)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      {isSent ? <><Check size={14} /> Sent</> : <>Gift Coupon</>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.85rem", color: B.bodyText, fontFamily: "var(--font-inter)" }}>
          Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${B.lightGray}`,
              background: "white",
              color: B.bodyText,
              fontSize: "0.85rem",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: `1px solid ${B.lightGray}`,
              background: "white",
              color: B.bodyText,
              fontSize: "0.85rem",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.5 : 1,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Gift Coupon Modal */}
      <AnimatePresence>
        {giftingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGiftingUser(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(13, 59, 68, 0.6)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "2rem",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(13, 59, 68, 0.3)",
              }}
            >
              <h3 style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: B.darkText,
                marginBottom: "1rem",
              }}>
                Gift Coupon
              </h3>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: B.bodyText,
                  marginBottom: "0.5rem",
                  fontFamily: "var(--font-inter)",
                }}>
                  Select Coupon Type
                </label>
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    border: `1px solid ${B.lightGray}`,
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  <option value="50">₹50 Off</option>
                  <option value="100">₹100 Off</option>
                  <option value="250">₹250 Off</option>
                  <option value="20_percent">20% Off</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => setGiftingUser(null)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: B.lightGray,
                    color: B.darkText,
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const customer = data.customers.find(c => c.id === giftingUser);
                    if (customer) handleGiftCoupon(customer.id, customer.name);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "12px",
                    background: B.seafoam,
                    color: "white",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  Send Coupon
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            style={{
              position: "fixed",
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: toast.type === "success" ? "#10B981" : "#EF4444",
              color: "white",
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              fontSize: "0.9rem",
              fontWeight: 600,
              fontFamily: "var(--font-inter)",
              zIndex: 2000,
            }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// CLV Panel
function CLVPanel({ data }: { data: CRMData["clvData"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        border: `1px solid ${B.lightGray}`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-playfair), serif",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: B.darkText,
        marginBottom: "1.5rem",
      }}>
        Customer Lifetime Value
      </h2>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{
          background: B.cream,
          borderRadius: "12px",
          padding: "1.25rem",
          border: `1px solid ${B.lightGray}`,
        }}>
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}>
            Average CLV
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: B.seafoam,
            fontFamily: "monospace",
            marginBottom: "0.25rem",
          }}>
            ₹{data.averageCLV.toFixed(0)}
          </div>
          <div style={{
            fontSize: "0.75rem",
            color: B.bodyText,
            fontFamily: "var(--font-inter)",
          }}>
            across all customers
          </div>
        </div>

        <div style={{
          background: B.cream,
          borderRadius: "12px",
          padding: "1.25rem",
          border: `1px solid ${B.lightGray}`,
        }}>
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}>
            Top Customer CLV
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#FFD700",
            fontFamily: "monospace",
            marginBottom: "0.25rem",
          }}>
            ₹{data.topCustomer.clv.toFixed(0)}
          </div>
          <div style={{
            fontSize: "0.75rem",
            color: B.bodyText,
            fontFamily: "var(--font-inter)",
          }}>
            {data.topCustomer.name}
          </div>
        </div>

        <div style={{
          background: B.cream,
          borderRadius: "12px",
          padding: "1.25rem",
          border: `1px solid ${B.lightGray}`,
        }}>
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.5rem",
            fontFamily: "monospace",
          }}>
            CLV:CAC Ratio
          </div>
          <div style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#10B981",
            fontFamily: "monospace",
            marginBottom: "0.25rem",
          }}>
            3.2 : 1
          </div>
          <div style={{
            fontSize: "0.75rem",
            color: B.bodyText,
            fontFamily: "var(--font-inter)",
          }}>
            (estimated)
          </div>
        </div>
      </div>

      {/* CLV by Tier Bar Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data.clvByTier} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray} />
          <XAxis type="number" stroke={B.bodyText} style={{ fontSize: "0.75rem" }} />
          <YAxis dataKey="tier" type="category" stroke={B.bodyText} style={{ fontSize: "0.75rem" }} />
          <Tooltip 
            contentStyle={{ 
              background: "white", 
              border: `1px solid ${B.lightGray}`,
              borderRadius: "8px",
              fontSize: "0.85rem"
            }} 
            formatter={(value) => `₹${Number(value || 0).toFixed(0)}`}
          />
          <Bar dataKey="clv" name="Average CLV">
            {data.clvByTier.map((entry, index) => {
              const colors: Record<string, string> = {
                "Gold": "#FFD700",
                "Silver": "#C0C0C0",
                "Bronze": "#CD7F32",
                "None": B.midGray,
              };
              return <Cell key={`cell-${index}`} fill={colors[entry.tier] || B.seafoam} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// Automated CRM Actions Log
function ActionsLog({ data }: { data: CRMData["actionsLog"] }) {
  const [filter, setFilter] = useState<"all" | "converted" | "pending" | "no_response">("all");

  const filteredActions = data.filter(action => 
    filter === "all" || action.result === filter
  );

  const getResultBadge = (result: string) => {
    const configs: Record<string, { bg: string; color: string; label: string }> = {
      "converted": { bg: "#D1FAE5", color: "#10B981", label: "Converted ✓" },
      "pending": { bg: "#FEF3C7", color: "#F59E0B", label: "Pending..." },
      "no_response": { bg: "#FEE2E2", color: "#EF4444", label: "No Response" },
    };
    return configs[result] || configs["pending"];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        border: `1px solid ${B.lightGray}`,
        boxShadow: "0 8px 32px rgba(13, 59, 68, 0.08)",
      }}
    >
      <h2 style={{
        fontFamily: "var(--font-playfair), serif",
        fontSize: "1.5rem",
        fontWeight: 400,
        color: B.darkText,
        marginBottom: "1.5rem",
      }}>
        Automated CRM Actions — Activity Feed
      </h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {[
          { key: "all", label: "All" },
          { key: "converted", label: "Converted" },
          { key: "pending", label: "Pending" },
          { key: "no_response", label: "No Response" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "12px",
              border: `2px solid ${filter === key ? B.seafoam : B.lightGray}`,
              background: filter === key ? `${B.seafoam}15` : "white",
              color: filter === key ? B.seafoam : B.bodyText,
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-inter)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: B.cream }}>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Trigger</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Customer</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Action Taken</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Date</th>
              <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: B.bodyText, textTransform: "uppercase", fontFamily: "monospace" }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.map((action, index) => {
              const badge = getResultBadge(action.result);
              return (
                <tr key={index} style={{ borderBottom: `1px solid ${B.lightGray}` }}>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: B.darkText, fontFamily: "var(--font-inter)" }}>{action.trigger}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", fontWeight: 600, color: B.darkText, fontFamily: "var(--font-inter)" }}>{action.customer}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.85rem", color: B.bodyText, fontFamily: "var(--font-inter)" }}>{action.actionTaken}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: B.midGray, fontFamily: "monospace" }}>{action.date}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "12px",
                      background: badge.bg,
                      color: badge.color,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                    }}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// Helper Functions

function getProductRecommendation(segmentValue: string): { name: string; description: string } {
  const recommendations: Record<string, { name: string; description: string }> = {
    "Oily": {
      name: "Clarifying Shampoo Pro",
      description: "Deep-cleansing formula that removes excess oil and buildup while maintaining scalp health. Perfect for oily scalp types who need frequent washing without stripping natural moisture."
    },
    "Dry": {
      name: "Hydrating Scalp Serum",
      description: "Intensive moisture treatment with hyaluronic acid and botanical oils. Soothes dry, itchy scalp and restores natural hydration balance for long-lasting comfort."
    },
    "Normal": {
      name: "Complete Maintenance Bundle",
      description: "All-in-one hair care system for balanced scalp types. Includes shampoo, conditioner, and weekly treatment mask to maintain optimal hair health."
    },
    "Sensitive": {
      name: "Gentle Care Collection",
      description: "Fragrance-free, hypoallergenic formula designed for sensitive scalps. Dermatologist-tested and free from harsh chemicals, sulfates, and parabens."
    },
    "Dandruff": {
      name: "Anti-Dandruff Detox Oil",
      description: "Therapeutic scalp treatment with tea tree oil and zinc pyrithione. Eliminates flakes, reduces itching, and prevents dandruff recurrence."
    },
    "Low": {
      name: "Lightweight Penetrating Oil",
      description: "Fast-absorbing formula specifically designed for low porosity hair. Helps nutrients penetrate the hair shaft without weighing down strands."
    },
    "Medium": {
      name: "Balanced Protein-Moisture Treatment",
      description: "Perfect equilibrium of protein and moisture for medium porosity hair. Strengthens while hydrating for optimal hair health and manageability."
    },
    "High": {
      name: "Deep Conditioning Repair Mask",
      description: "Intensive treatment for high porosity hair that seals cuticles and locks in moisture. Repairs damage and prevents future moisture loss."
    },
    "Straight": {
      name: "Volume Booster",
      description: "Lightweight formula that adds body and shine to straight hair without weighing it down."
    },
    "Wavy": {
      name: "Wave Enhancer",
      description: "Defines and enhances natural waves while controlling frizz for beautiful, bouncy texture."
    },
    "Curly": {
      name: "Curl Definer",
      description: "Moisture-rich formula that defines curls and reduces frizz for gorgeous, springy curls."
    },
    "Coily": {
      name: "Coil Hydrator",
      description: "Deep hydration and detangling treatment specifically formulated for coily hair textures."
    },
  };

  return recommendations[segmentValue] || {
    name: "Personalized Hair Care Kit",
    description: "Custom-selected products based on your unique hair profile and needs."
  };
}
