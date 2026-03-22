"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Dna,
  Package,
  ClipboardList,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Microscope,
} from "lucide-react";
import Link from "next/link";
import { useAuthModal } from "@/contexts/AuthModalContext";
import axios from "axios";

interface DashboardData {
  user: {
    name: string | null;
    hairType: string | null;
    porosity: string | null;
    scalpCondition: string | null;
    porosityScore: number | null;
    scalpHealth: number | null;
    primaryConcern: string | null;
    hairAnalysis: string | null;
  } | null;
  recentOrders: Array<{
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    items: Array<{ product: { name: string } }>;
  }>;
  orderCount: number;
}

function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        border: "1px solid #E8F0ED",
        height: `${height}px`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, #F0F4F3 25%, #E4EDEA 50%, #F0F4F3 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  DELIVERED: { bg: "rgba(42,157,143,0.1)", color: "#2A9D8F", label: "Delivered" },
  PROCESSING: { bg: "rgba(212,175,55,0.12)", color: "#D4AF37", label: "Processing" },
  SHIPPED: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Shipped" },
  PENDING: { bg: "rgba(156,163,175,0.15)", color: "#6B7280", label: "Pending" },
  CANCELLED: { bg: "rgba(239,68,68,0.1)", color: "#EF4444", label: "Cancelled" },
};

function ScoreRing({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: "70px", height: "70px", margin: "0 auto" }}>
        <svg width="70" height="70" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="rgba(42,157,143,0.1)"
            strokeWidth="6"
          />
          <motion.circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#0D3B44",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          marginTop: "6px",
          fontSize: "0.7rem",
          color: "#6B7280",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { dbUser } = useAuthModal();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser?.id) return;
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          axios.get(`/api/dashboard/user?userId=${dbUser.id}`),
          axios.get(`/api/dashboard/orders?userId=${dbUser.id}&limit=3`),
        ]);
        setData({
          user: userRes.data.user,
          recentOrders: ordersRes.data.orders || [],
          orderCount: ordersRes.data.total || 0,
        });
      } catch (e) {
        console.error(e);
        setData({ user: null, recentOrders: [], orderCount: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dbUser?.id]);

  const userName =
    data?.user?.name || dbUser?.name || dbUser?.email?.split("@")[0] || "there";
  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  const quickLinks = [
    {
      label: "My Hair DNA",
      desc: "View your follicle analysis",
      href: "/dashboard/dna",
      icon: Dna,
      color: "#2A9D8F",
    },
    {
      label: "Order Archives",
      desc: "Track & reorder treatments",
      href: "/dashboard/orders",
      icon: Package,
      color: "#D4AF37",
    },
    {
      label: "Diagnostic History",
      desc: "Review clinical assessments",
      href: "/dashboard/results",
      icon: ClipboardList,
      color: "#8B5CF6",
    },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1100px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <Microscope size={14} color="#2A9D8F" />
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#2A9D8F",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Dashboard
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            fontWeight: 700,
            color: "#0D3B44",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {greeting},{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0D3B44, #2A9D8F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {userName}
          </span>
          .
        </h1>
        <p
          style={{
            marginTop: "6px",
            color: "#6B7280",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
          }}
        >
          Your genomic diagnostic data is up-to-date.
        </p>
      </motion.div>

      {/* DNA Health Score strip */}
      {loading ? (
        <SkeletonCard height={140} />
      ) : (
        data?.user && (data.user.porosityScore || data.user.scalpHealth) ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              background: "linear-gradient(135deg, #0D3B44 0%, #164752 60%, #1a5563 100%)",
              borderRadius: "20px",
              padding: "1.5rem 2rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.25rem",
              boxShadow: "0 8px 32px rgba(13,59,68,0.18)",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "4px",
                }}
              >
                <Sparkles size={13} color="#D4AF37" />
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "rgba(212,175,55,0.9)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  DNA Health Score
                </span>
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.3rem",
                  color: "#F4F7F5",
                  fontWeight: 600,
                }}
              >
                Your profile is active
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(244,247,245,0.55)",
                  marginTop: "4px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {data.user.hairType && `${data.user.hairType} hair`}
                {data.user.porosity && ` · ${data.user.porosity} porosity`}
                {data.user.scalpCondition && ` · ${data.user.scalpCondition} scalp`}
              </div>
            </div>

            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              {data.user.porosityScore != null && (
                <ScoreRing
                  value={data.user.porosityScore}
                  label="Porosity Index"
                  color="#2A9D8F"
                />
              )}
              {data.user.scalpHealth != null && (
                <ScoreRing
                  value={data.user.scalpHealth}
                  label="Scalp Health"
                  color="#D4AF37"
                />
              )}
            </div>

            <Link href="/dashboard/dna" style={{ textDecoration: "none" }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "0.55rem 1.2rem",
                  borderRadius: "9999px",
                  background: "rgba(42,157,143,0.18)",
                  border: "1px solid rgba(42,157,143,0.4)",
                  color: "#2A9D8F",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  fontFamily: "'Montserrat', sans-serif",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                View DNA <ArrowRight size={13} />
              </motion.button>
            </Link>
          </motion.div>
        ) : null
      )}

      {/* Quick navigation cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        {quickLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
            >
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "1.25rem",
                    border: "1px solid #E8F0ED",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-3px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 8px 24px rgba(13,59,68,0.09)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "none";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: `${item.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <Icon size={18} color={item.color} />
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: "#0D3B44",
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: "2px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.74rem",
                      color: "#9CA3AF",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {item.desc}
                  </div>
                  <div
                    style={{
                      marginTop: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color: item.color,
                      fontSize: "0.73rem",
                      fontWeight: 600,
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    Open <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #E8F0ED",
          overflow: "hidden",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #F0F4F3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={16} color="#2A9D8F" />
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#0D3B44",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Recent Diagnostic Activity
            </span>
          </div>
          <Link
            href="/dashboard/orders"
            style={{
              textDecoration: "none",
              fontSize: "0.75rem",
              color: "#2A9D8F",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View all <ArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} height={56} />
            ))}
          </div>
        ) : data?.recentOrders && data.recentOrders.length > 0 ? (
          <div>
            {data.recentOrders.map((order, i) => {
              const statusInfo =
                STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;
              const productsLabel = order.items
                ?.map((item) => item.product.name)
                .join(", ")
                .slice(0, 50);
              return (
                <div
                  key={order.id}
                  style={{
                    padding: "1rem 1.5rem",
                    borderBottom:
                      i < data.recentOrders.length - 1
                        ? "1px solid #F0F4F3"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "9px",
                        background: "rgba(42,157,143,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Package size={15} color="#2A9D8F" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "#0D3B44",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Order #{order.id.slice(-6).toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "#9CA3AF",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {productsLabel || "Follicia Treatment"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "0.7rem",
                        color: "#9CA3AF",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <Calendar size={11} />
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "9999px",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        fontFamily: "'Montserrat', sans-serif",
                        background: statusInfo.bg,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#0D3B44",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: "2.5rem",
              textAlign: "center",
              color: "#9CA3AF",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
            }}
          >
            <Package size={32} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
            <p>No orders yet. Your procurement history will appear here.</p>
            <Link href="/shop" style={{ color: "#2A9D8F", fontWeight: 600, textDecoration: "none" }}>
              Browse the Atelier →
            </Link>
          </div>
        )}
      </motion.div>

      {/* AI summary card */}
      {data?.user?.hairAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          style={{
            background: "white",
            borderRadius: "20px",
            border: "1px solid #E8F0ED",
            padding: "1.5rem",
            borderLeft: "4px solid #2A9D8F",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "0.75rem",
            }}
          >
            <CheckCircle2 size={15} color="#2A9D8F" />
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#2A9D8F",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Scientific Context · Observation
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.95rem",
              color: "#374151",
              lineHeight: 1.65,
            }}
          >
            &ldquo;{data.user.hairAnalysis}&rdquo;
          </p>
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.7rem",
              color: "#9CA3AF",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Clock size={11} /> Latest AI diagnostic summary
          </div>
        </motion.div>
      )}
    </div>
  );
}
