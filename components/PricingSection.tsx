"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  isPopular?: boolean;
  audienceNote: string;
}

const tiers: PricingTier[] = [
  {
    id: "bronze",
    name: "Essential Diagnostic",
    price: "₹499",
    priceValue: 499,
    period: "/ month",
    tagline: "Baseline scalp intake and targeted single-formula compatibility.",
    audienceNote: "Best for mild scalp dryness or curiosity",
    features: [
      "Full scalp sebum & porosity diagnostic",
      "Tailored formulation compatibility report",
      "Hard water ingredient compatibility check",
      "Email support within 48 hours",
    ],
    cta: "Select Essential",
  },
  {
    id: "silver",
    name: "Active Protocol",
    price: "₹999",
    priceValue: 999,
    period: "/ month",
    tagline: "Continuous formula adjustment for chronic shedding and barrier repair.",
    audienceNote: "Recommended for hair fall, dandruff or buildup",
    isPopular: true,
    features: [
      "Everything in Essential Diagnostic",
      "Seasonal formula refinement (every 60 days)",
      "Hard water chelating guidance & pH balance",
      "Bi-weekly photo progress check-in",
      "15% off all recurring refill orders",
    ],
    cta: "Start Active Protocol",
  },
  {
    id: "gold",
    name: "Clinical Care",
    price: "₹1,999",
    priceValue: 1999,
    period: "/ month",
    tagline: "Direct trichologist oversight and custom-compounded active batches.",
    audienceNote: "For severe thinning, alopecia, or persistent irritation",
    features: [
      "Everything in Active Protocol",
      "Comprehensive follicle & shedding root-cause review",
      "1-on-1 virtual consultation with a certified trichologist",
      "Custom active compounding (copper peptides, minoxidil alternatives)",
      "Priority messaging with clinical team",
      "Free priority shipping on all orders",
    ],
    cta: "Select Clinical Care",
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
    <section style={{ padding: "6rem 1.5rem", background: "#F4F7F5" }} id="pricing">
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
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
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#2A9D8F",
              marginBottom: "0.75rem",
            }}
          >
            Care Subscriptions
          </motion.p>
          <motion.h2
            variants={fadeUp}
            custom={1}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              color: "#0D3B44",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Predictable, transparent scalp care.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: "#4A6B63",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            No hidden fees or locked contracts. Pause, adjust, or cancel anytime from your dashboard.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.75rem",
            alignItems: "stretch",
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
              style={{
                borderRadius: "1rem",
                padding: "2.25rem 2rem",
                background: "#FFFFFF",
                border: tier.isPopular ? "1.5px solid #2A9D8F" : "1px solid #E8EDEB",
                boxShadow: tier.isPopular
                  ? "0 4px 20px rgba(13, 59, 68, 0.08)"
                  : "0 2px 8px rgba(13, 59, 68, 0.03)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Recommended pill */}
              {tier.isPopular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-11px",
                    left: "2rem",
                    padding: "2px 10px",
                    borderRadius: "9999px",
                    background: "#2A9D8F",
                    color: "#FFFFFF",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Most popular
                </div>
              )}

              {/* Tier Name & audience note */}
              <div style={{ marginBottom: "1rem" }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    color: "#0D3B44",
                    marginBottom: "0.25rem",
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    color: "#9AABA5",
                    margin: 0,
                  }}
                >
                  {tier.audienceNote}
                </p>
              </div>

              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  paddingBottom: "1.25rem",
                  borderBottom: "1px solid #E8EDEB",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "2.25rem",
                    color: "#0D3B44",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tier.price}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    color: "#9AABA5",
                  }}
                >
                  {tier.period}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  color: "#4A6B63",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                {tier.tagline}
              </p>

              {/* Features */}
              <ul
                style={{
                  marginBottom: "2rem",
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 2rem 0",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <Check
                      size={15}
                      color="#2A9D8F"
                      style={{ flexShrink: 0, marginTop: "3px" }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.83rem",
                        color: "#1C2B28",
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
                  padding: "0.8rem 1.5rem",
                  borderRadius: "9999px",
                  border: tier.isPopular ? "none" : "1.5px solid #0D3B44",
                  background: tier.isPopular ? "#0D3B44" : "transparent",
                  color: tier.isPopular ? "#FFFFFF" : "#0D3B44",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: loadingTier === tier.id ? "not-allowed" : "pointer",
                  transition: "background 0.2s ease, color 0.2s ease, opacity 0.2s ease",
                  opacity: loadingTier === tier.id ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (loadingTier !== tier.id) {
                    if (tier.isPopular) {
                      (e.currentTarget as HTMLElement).style.background = "#1A5568";
                    } else {
                      (e.currentTarget as HTMLElement).style.background = "#0D3B44";
                      (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (tier.isPopular) {
                    (e.currentTarget as HTMLElement).style.background = "#0D3B44";
                  } else {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#0D3B44";
                  }
                }}
              >
                {loadingTier === tier.id ? (
                  <>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        border: "2px solid currentColor",
                        borderTopColor: "transparent",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                    Saving selection...
                  </>
                ) : (
                  tier.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Reassurance note */}
        <p
          style={{
            textAlign: "center",
            marginTop: "2.5rem",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.78rem",
            color: "#9AABA5",
          }}
        >
          All diagnostic plans include initial scalp compatibility mapping. Free shipping on all formula deliveries.
        </p>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .pricing-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
