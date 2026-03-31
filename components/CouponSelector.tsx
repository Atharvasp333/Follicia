"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Check, Sparkles, ChevronRight } from "lucide-react";
import { AppliedCoupon } from "@/contexts/CartContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import Link from "next/link";

interface MyCoupon {
  id: string;
  code: string;
  discountAmount: number;
  pointsRequired: number;
  redeemedAt: string;
}

interface CouponSelectorProps {
  onApplyCoupon: (coupon: AppliedCoupon) => void;
  onRemoveCoupon: () => void;
  appliedCoupon: AppliedCoupon | null;
}

export default function CouponSelector({ 
  onApplyCoupon, 
  onRemoveCoupon,
  appliedCoupon 
}: CouponSelectorProps) {
  const { dbUser } = useAuthModal();
  const [coupons, setCoupons] = useState<MyCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dbUser?.id) {
      fetchMyCoupons();
    }
  }, [dbUser]);

  const fetchMyCoupons = async () => {
    if (!dbUser?.id) return;

    try {
      const response = await fetch(`/api/user/my-coupons?userId=${dbUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCouponClick = (coupon: MyCoupon) => {
    if (appliedCoupon?.id === coupon.id) {
      // Remove if already applied
      onRemoveCoupon();
    } else {
      // Apply the coupon
      onApplyCoupon({
        id: coupon.id,
        code: coupon.code,
        discountAmount: coupon.discountAmount,
      });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "2px solid #2A9D8F",
            borderTopColor: "transparent",
            animation: "spin 0.6s linear infinite",
            margin: "0 auto",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Empty state - no coupons unlocked
  if (coupons.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: "1.5rem",
          borderRadius: "12px",
          background: "rgba(42,157,143,0.05)",
          border: "1px dashed rgba(42,157,143,0.3)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(42,157,143,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <Gift size={22} color="#2A9D8F" />
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#4A6B63",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "12px",
            lineHeight: 1.5,
          }}
        >
          No rewards unlocked yet. Visit the Vault to redeem points.
        </p>
        <Link href="/dashboard/rewards">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "9999px",
              background: "#2A9D8F",
              border: "none",
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles size={14} />
            Visit Rewards Vault
            <ChevronRight size={14} />
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Gift size={16} color="#2A9D8F" />
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#0D3B44",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            My Available Coupons
          </span>
        </div>
        <Link href="/dashboard/rewards">
          <span
            style={{
              fontSize: "0.75rem",
              color: "#2A9D8F",
              fontFamily: "'Inter', sans-serif",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            View All
          </span>
        </Link>
      </div>

      {/* Horizontal scroll container - Zomato style */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "8px",
          scrollbarWidth: "thin",
          scrollbarColor: "#E8EDEB transparent",
        }}
      >
        {coupons.map((coupon) => {
          const isApplied = appliedCoupon?.id === coupon.id;

          return (
            <motion.button
              key={coupon.id}
              whileHover={!isApplied ? { y: -4, scale: 1.02 } : {}}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCouponClick(coupon)}
              style={{
                minWidth: "200px",
                padding: "1rem",
                borderRadius: "12px",
                background: isApplied
                  ? "linear-gradient(135deg, rgba(42,157,143,0.15), rgba(42,157,143,0.08))"
                  : "#FAFCFB",
                border: isApplied
                  ? "2px solid #2A9D8F"
                  : "1.5px solid #E8EDEB",
                cursor: "pointer",
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              {/* Checkmark badge */}
              <AnimatePresence>
                {isApplied && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#2A9D8F",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(42,157,143,0.4)",
                    }}
                  >
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Coupon code */}
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: isApplied
                    ? "rgba(42,157,143,0.2)"
                    : "rgba(13,59,68,0.08)",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: isApplied ? "#2A9D8F" : "#0D3B44",
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  {coupon.code}
                </span>
              </div>

              {/* Discount amount */}
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#0D3B44",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "4px",
                }}
              >
                Save ₹{coupon.discountAmount.toLocaleString()}
              </div>

              {/* Status text */}
              <div
                style={{
                  fontSize: "0.7rem",
                  color: isApplied ? "#2A9D8F" : "#9AABA5",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {isApplied ? "✓ Applied" : "Tap to apply"}
              </div>

              {/* Decorative sparkle */}
              {!isApplied && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    right: "8px",
                    opacity: 0.3,
                  }}
                >
                  <Sparkles size={16} color="#2A9D8F" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Scrollbar styling */}
      <style>{`
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #E8EDEB;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #D5E0DC;
        }
      `}</style>
    </motion.div>
  );
}
