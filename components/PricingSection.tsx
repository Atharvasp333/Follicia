"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useRouter } from "next/navigation";
import axios from "axios";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  gold: "#D4AF37",
};

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: E },
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
    cta: "Get Started",
    icon: <Sparkles size={22} />,
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
    cta: "Claim Your Kit",
    badge: "Most Popular",
    icon: <Zap size={22} />,
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
    cta: "Unlock Lab Access",
    badge: "Premium",
    icon: <Crown size={22} />,
    gradient: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
  },
];

export default function PricingSection() {
  const { currentUser, dbUser, openModal, refreshUser } = useAuthModal();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSelectPlan = async (tier: PricingTier) => {
    // Check if user is authenticated
    if (!currentUser && !dbUser) {
      console.log('⚠️ User not authenticated, opening modal');
      openModal();
      return;
    }

    if (!dbUser?.id) {
      console.error('❌ No user ID available');
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message: "Please sign in to select a plan." },
          })
        );
      }
      return;
    }

    console.log('🎯 Selecting plan:', tier.id);
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
            detail: { message: `Successfully upgraded to ${tier.name} plan!` },
          })
        );
      }

      // Redirect to dashboard
      router.push("/dashboard");
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
    <section style={{ padding: "6rem 1.5rem", background: B.cream }} id="pricing">
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: B.seafoam,
              marginBottom: "10px",
            }}
          >
            Membership Tiers
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: B.teal,
              marginBottom: "1rem",
            }}
          >
            Select Your Diagnostic Tier
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: "#4A6B63",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Precision hair care designed for Indian climate and biology. Choose
            the plan that matches your transformation goals.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.75rem",
          }}
          className="pricing-grid"
        >
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              whileHover={{ y: -8 }}
              style={{
                position: "relative",
                borderRadius: "1.5rem",
                padding: "2rem",
                background: "#FFFFFF",
                border: tier.badge
                  ? `2px solid ${B.seafoam}`
                  : "1px solid #E8EDEB",
                boxShadow: tier.badge
                  ? "0 16px 48px rgba(42,157,143,0.15)"
                  : "0 12px 40px rgba(13,59,68,0.07)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "4px 16px",
                    borderRadius: "9999px",
                    background: tier.gradient,
                    color: "#FFFFFF",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Icon */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: tier.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  marginBottom: "1.25rem",
                }}
              >
                {tier.icon}
              </div>

              {/* Tier Name */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.5rem",
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
                    fontSize: "2.5rem",
                    color: B.teal,
                  }}
                >
                  {tier.price}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    color: "#9AABA5",
                    marginLeft: "6px",
                  }}
                >
                  /month
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#4A6B63",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                {tier.description}
              </p>

              {/* Features */}
              <ul style={{ marginBottom: "1.75rem", listStyle: "none", padding: 0 }}>
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <Check
                      size={16}
                      color={B.seafoam}
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.85rem",
                        color: "#4A6B63",
                        lineHeight: 1.5,
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
                disabled={loadingTier === tier.id}
                style={{
                  width: "100%",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: tier.badge ? tier.gradient : B.teal,
                  color: "#FFFFFF",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: loadingTier === tier.id ? "not-allowed" : "pointer",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  opacity: loadingTier === tier.id ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (loadingTier !== tier.id) {
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
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2px solid #FFFFFF",
                        borderTopColor: "transparent",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                    Processing...
                  </>
                ) : (
                  tier.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
