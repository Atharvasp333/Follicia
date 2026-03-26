"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import axios from "axios";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  gold: "#D4AF37",
};

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: E },
  }),
};

interface PricingTier {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  description: string;
  features: string[];
  cta: string;
  badge?: string;
  icon: React.ReactNode;
  gradient: string;
}

const tiers: PricingTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    price: "₹499",
    priceValue: 499,
    description: "Essential diagnostics for your hair journey",
    features: [
      "AI Scalp Analysis",
      "Basic Product Recommendations",
      "Monthly Progress Tracking",
      "Email Support",
    ],
    cta: "Switch to Bronze",
    icon: <Sparkles size={20} />,
    gradient: "linear-gradient(135deg, #CD7F32 0%, #8B5A2B 100%)",
  },
  {
    id: "silver",
    name: "Silver",
    price: "₹999",
    priceValue: 999,
    description: "Advanced analysis tailored for Indian climate",
    features: [
      "Everything in Bronze",
      "Climate-Adaptive Formulations",
      "Bi-weekly Check-ins",
      "Priority Support",
      "Exclusive Product Discounts",
    ],
    cta: "Switch to Silver",
    badge: "Most Popular",
    icon: <Zap size={20} />,
    gradient: "linear-gradient(135deg, #C0C0C0 0%, #808080 100%)",
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹1,999",
    priceValue: 1999,
    description: "Complete lab-grade hair transformation",
    features: [
      "Everything in Silver",
      "Lab-Grade DNA Analysis",
      "Personalized Trichologist Consultation",
      "Custom Formulation Access",
      "24/7 Concierge Support",
      "Free Shipping on All Orders",
    ],
    cta: "Switch to Gold",
    badge: "Premium",
    icon: <Crown size={20} />,
    gradient: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
  },
];

export default function MembershipPage() {
  const { dbUser, refreshUser } = useAuthModal();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const currentPlan = dbUser?.plan || null;

  const handleSelectPlan = async (tier: PricingTier) => {
    if (currentPlan === tier.id) {
      return; // Already on this plan
    }

    if (!dbUser?.id) {
      console.error('❌ No user ID available');
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message: "User session error. Please refresh the page." },
          })
        );
      }
      return;
    }

    console.log('🎯 Switching plan:', tier.id);
    console.log('👤 User ID:', dbUser.id);
    console.log('📦 Request payload:', {
      userId: dbUser.id,
      plan: tier.id,
      planName: tier.name,
    });

    setLoadingTier(tier.id);

    try {
      // Simulate 2-second loader
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user plan via API
      const response = await axios.patch("/api/user/update-plan", {
        userId: dbUser.id,
        plan: tier.id,
        planName: tier.name,
      });

      console.log('✅ Plan update response:', response.data);

      // Refresh user data in context
      await refreshUser();

      // Show success toast
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message: `Successfully switched to ${tier.name} plan!` },
          })
        );
      }
    } catch (error: any) {
      console.error("❌ Failed to update plan:", error);
      console.error("Error response:", error.response?.data);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message: "Failed to update plan. Please try again." },
          })
        );
      }
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div style={{ padding: "2.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        style={{ marginBottom: "2.5rem" }}
      >
        <motion.div
          variants={fadeUp}
          custom={0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          <Crown size={24} color={B.gold} />
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "2rem",
              color: B.teal,
            }}
          >
            Membership Plans
          </h1>
        </motion.div>
        <motion.p
          variants={fadeUp}
          custom={1}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem",
            color: "#4A6B63",
            lineHeight: 1.6,
          }}
        >
          {currentPlan
            ? `You're currently on the ${
                tiers.find((t) => t.id === currentPlan)?.name
              } plan. Upgrade or switch anytime.`
            : "Choose a plan to unlock personalized hair diagnostics and exclusive benefits."}
        </motion.p>
      </motion.div>

      {/* Current Plan Badge */}
      {currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #2A9D8F 0%, #0D3B44 100%)",
            color: "#FFFFFF",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.8,
                marginBottom: "4px",
              }}
            >
              Current Plan
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              {tiers.find((t) => t.id === currentPlan)?.name}
            </div>
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.75rem",
              fontWeight: 800,
            }}
          >
            {tiers.find((t) => t.id === currentPlan)?.price}
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 400,
                opacity: 0.7,
              }}
            >
              /mo
            </span>
          </div>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {tiers.map((tier, i) => {
          const isCurrentPlan = currentPlan === tier.id;

          return (
            <motion.div
              key={tier.id}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={!isCurrentPlan ? { y: -6 } : {}}
              style={{
                position: "relative",
                borderRadius: "1.25rem",
                padding: "1.75rem",
                background: "#FFFFFF",
                border: isCurrentPlan
                  ? `2px solid ${B.gold}`
                  : tier.badge
                  ? `2px solid ${B.seafoam}`
                  : "1px solid #E8EDEB",
                boxShadow: isCurrentPlan
                  ? "0 16px 48px rgba(212,175,55,0.2)"
                  : tier.badge
                  ? "0 16px 48px rgba(42,157,143,0.15)"
                  : "0 12px 40px rgba(13,59,68,0.07)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                opacity: isCurrentPlan ? 1 : loadingTier ? 0.6 : 1,
              }}
            >
              {/* Badge */}
              {(tier.badge || isCurrentPlan) && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "4px 14px",
                    borderRadius: "9999px",
                    background: isCurrentPlan ? B.gold : tier.gradient,
                    color: "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {isCurrentPlan ? "Active" : tier.badge}
                </div>
              )}

              {/* Icon */}
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: tier.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  marginBottom: "1rem",
                }}
              >
                {tier.icon}
              </div>

              {/* Tier Name */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.35rem",
                  color: B.teal,
                  marginBottom: "0.5rem",
                }}
              >
                {tier.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: B.teal,
                  }}
                >
                  {tier.price}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    color: "#9AABA5",
                    marginLeft: "4px",
                  }}
                >
                  /month
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  color: "#4A6B63",
                  lineHeight: 1.5,
                  marginBottom: "1.25rem",
                }}
              >
                {tier.description}
              </p>

              {/* Features */}
              <ul
                style={{
                  marginBottom: "1.5rem",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <Check
                      size={14}
                      color={B.seafoam}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.8rem",
                        color: "#4A6B63",
                        lineHeight: 1.4,
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(tier)}
                disabled={isCurrentPlan || loadingTier !== null}
                style={{
                  width: "100%",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: isCurrentPlan
                    ? "#E8EDEB"
                    : tier.badge
                    ? tier.gradient
                    : B.teal,
                  color: isCurrentPlan ? "#9AABA5" : "#FFFFFF",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor:
                    isCurrentPlan || loadingTier !== null
                      ? "not-allowed"
                      : "pointer",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  opacity: loadingTier === tier.id ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentPlan && loadingTier === null) {
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                }}
              >
                {loadingTier === tier.id ? (
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
                    Processing...
                  </>
                ) : isCurrentPlan ? (
                  "Current Plan"
                ) : (
                  <>
                    {tier.cta}
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
