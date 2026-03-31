"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  Check,
  Sparkles,
  Tag,
} from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import PointsBalance from "@/components/PointsBalance";

interface RewardCoupon {
  id: string;
  code: string;
  discountAmount: number;
  pointsRequired: number;
  canAfford: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: "EARNED" | "REDEEMED";
  description: string;
  createdAt: string;
}

interface RewardsData {
  userPoints: number;
  availableCoupons: RewardCoupon[];
  recentTransactions: Transaction[];
}

export default function RewardsPage() {
  const { dbUser } = useAuthModal();
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (dbUser?.id) {
      fetchRewardsData();
    }
  }, [dbUser]);

  const fetchRewardsData = async () => {
    if (!dbUser?.id) {
      console.log("⚠️ No user ID available");
      return;
    }

    try {
      console.log("🔍 Fetching rewards for user:", dbUser.id);
      const response = await fetch(`/api/user/redeem-points?userId=${dbUser.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Rewards data:", data);
        setRewardsData(data);
      } else {
        console.error("❌ Failed to fetch rewards:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (couponId: string, couponCode: string) => {
    if (!dbUser?.id) {
      setErrorMessage("Please sign in to redeem coupons");
      return;
    }

    setRedeeming(couponId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/user/redeem-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId, userId: dbUser.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          `🎉 Success! Your coupon code is: ${data.couponCode}`
        );
        // Refresh data
        await fetchRewardsData();
      } else {
        setErrorMessage(data.error || "Failed to redeem points");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "3rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "3px solid #2A9D8F",
              borderTopColor: "transparent",
              animation: "spin 0.9s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.82rem",
              color: "#0D3B44",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Loading Rewards…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.75rem" }}>
          <motion.div
            animate={{
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Gift size={32} color="#2A9D8F" />
          </motion.div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#0D3B44",
              margin: 0,
            }}
          >
            Rewards Vault
          </h1>
        </div>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem",
            color: "#4A6B63",
            margin: 0,
          }}
        >
          Redeem your loyalty points for exclusive discounts and rewards
        </p>
      </motion.div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              background: "rgba(42,157,143,0.1)",
              border: "1.5px solid #2A9D8F",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Check size={20} color="#2A9D8F" />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "#0D3B44",
                fontWeight: 600,
              }}
            >
              {successMessage}
            </span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "12px",
              background: "rgba(239,68,68,0.1)",
              border: "1.5px solid #EF4444",
              marginBottom: "1.5rem",
              color: "#DC2626",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Points Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginBottom: "2.5rem" }}
      >
        <PointsBalance points={rewardsData?.userPoints || 0} />
      </motion.div>

      {/* Available Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ marginBottom: "3rem" }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0D3B44",
            marginBottom: "1.25rem",
          }}
        >
          Available Rewards
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {rewardsData?.availableCoupons.map((coupon, index) => {
            const isUnlocked = coupon.canAfford && !coupon.isRedeemed;
            const isRedeemed = coupon.isRedeemed;
            const pointsNeeded = coupon.pointsRequired - (rewardsData?.userPoints || 0);

            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={isUnlocked ? { y: -6, transition: { duration: 0.2 } } : {}}
                style={{
                  background: isUnlocked ? "#FFFFFF" : "#F8F9FA",
                  borderRadius: "16px",
                  border: isUnlocked
                    ? "2px solid #2A9D8F"
                    : isRedeemed
                    ? "2px solid #D4AF37"
                    : "1px solid #E8EDEB",
                  padding: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isUnlocked
                    ? "0 8px 24px rgba(42,157,143,0.15)"
                    : "0 2px 12px rgba(13,59,68,0.05)",
                  filter: !isUnlocked && !isRedeemed ? "grayscale(100%)" : "none",
                  opacity: !isUnlocked && !isRedeemed ? 0.6 : 1,
                }}
              >
                {/* Glow effect for unlocked coupons */}
                {isUnlocked && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #2A9D8F, #4DBCB0, #2A9D8F)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 3s ease-in-out infinite",
                    }}
                  />
                )}

                {/* Redeemed Badge */}
                {isRedeemed && (
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      background: "linear-gradient(135deg, #D4AF37, #E8CC6A)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Check size={12} color="#0D3B44" />
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#0D3B44",
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Redeemed
                    </span>
                  </div>
                )}

                {/* Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    background: isUnlocked
                      ? "rgba(42,157,143,0.12)"
                      : "rgba(154,171,165,0.12)",
                    border: `1px solid ${isUnlocked ? "rgba(42,157,143,0.3)" : "rgba(154,171,165,0.3)"}`,
                    marginBottom: "1rem",
                  }}
                >
                  <Tag size={12} color={isUnlocked ? "#2A9D8F" : "#9AABA5"} />
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: isUnlocked ? "#2A9D8F" : "#9AABA5",
                      fontFamily: "'Montserrat', sans-serif",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {coupon.code}
                  </span>
                </div>

                {/* Discount Amount */}
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      color: isUnlocked ? "#0D3B44" : "#9AABA5",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    ₹{coupon.discountAmount}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#9AABA5",
                      fontFamily: "'Inter', sans-serif",
                      marginTop: "4px",
                    }}
                  >
                    OFF your next purchase
                  </div>
                </div>

                {/* Points Required */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "1.25rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: isUnlocked ? "#F4F7F5" : "#FAFCFB",
                  }}
                >
                  <Coins size={16} color={isUnlocked ? "#2A9D8F" : "#9AABA5"} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: isUnlocked ? "#0D3B44" : "#9AABA5",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {coupon.pointsRequired.toLocaleString()} points
                  </span>
                </div>

                {/* Action Button */}
                {isRedeemed ? (
                  <div
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      borderRadius: "9999px",
                      background: "rgba(212,175,55,0.1)",
                      border: "1.5px solid rgba(212,175,55,0.3)",
                      color: "#D4AF37",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Check size={16} />
                    Already Redeemed
                  </div>
                ) : isUnlocked ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRedeem(coupon.id, coupon.code)}
                    disabled={redeeming === coupon.id}
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      borderRadius: "9999px",
                      background: "#2A9D8F",
                      border: "none",
                      color: "#FFFFFF",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {redeeming === coupon.id ? (
                      <>
                        <div
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "2px solid #FFFFFF",
                            borderTopColor: "transparent",
                            animation: "spin 0.6s linear infinite",
                          }}
                        />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Redeem Now
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      borderRadius: "9999px",
                      background: "rgba(154,171,165,0.1)",
                      border: "1.5px solid rgba(154,171,165,0.2)",
                      color: "#9AABA5",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    🔒 Unlock for {pointsNeeded.toLocaleString()} more points
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0D3B44",
            marginBottom: "1.25rem",
          }}
        >
          Recent Activity
        </h2>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid #E8EDEB",
            overflow: "hidden",
          }}
        >
          {rewardsData?.recentTransactions && rewardsData.recentTransactions.length > 0 ? (
            rewardsData.recentTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom:
                    index < rewardsData.recentTransactions.length - 1
                      ? "1px solid #E8EDEB"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background:
                      tx.type === "EARNED"
                        ? "rgba(42,157,143,0.12)"
                        : "rgba(212,175,55,0.12)",
                    border: `1.5px solid ${tx.type === "EARNED" ? "rgba(42,157,143,0.3)" : "rgba(212,175,55,0.3)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {tx.type === "EARNED" ? (
                    <TrendingUp size={18} color="#2A9D8F" />
                  ) : (
                    <TrendingDown size={18} color="#D4AF37" />
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#0D3B44",
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: "2px",
                    }}
                  >
                    {tx.description}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#9AABA5",
                      fontFamily: "'Inter', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Clock size={12} />
                    {new Date(tx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: tx.type === "EARNED" ? "#2A9D8F" : "#D4AF37",
                    fontFamily: "'Inter', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {tx.type === "EARNED" ? "+" : ""}
                  {tx.amount.toLocaleString()}
                </div>
              </motion.div>
            ))
          ) : (
            <div
              style={{
                padding: "3rem 2rem",
                textAlign: "center",
                color: "#9AABA5",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
              }}
            >
              No transactions yet. Start earning points by making purchases!
            </div>
          )}
        </div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
