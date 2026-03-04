"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Microscope,
  Leaf,
  Package,
  ShoppingCart,
  Star,
  ChevronDown,
  Zap,
  BarChart2,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";

/* ── Animation helpers ──────────────────────────────────── */
const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: E },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: E },
  }),
};

/* ── Mock data ──────────────────────────────────────────── */
const products = [
  {
    id: "p1",
    name: "BioBalance Scalp Serum",
    subtitle: "Oily Scalp Formula",
    price: "₹2,490",
    match: 94,
    badge: "AI Pick",
    rating: 4.9,
    reviews: 312,
    accent: "#2A9D8F",
    description: "Microbiome-restoring serum with Niacinamide & Zinc PCA.",
  },
  {
    id: "p2",
    name: "RootRevive Treatment",
    subtitle: "Thinning Hair Formula",
    price: "₹3,290",
    match: 88,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 541,
    accent: "#0D3B44",
    description: "Clinically-dosed Redensyl & Procapil for follicle reactivation.",
  },
  {
    id: "p3",
    name: "HydraLux Mask",
    subtitle: "Dry & Brittle Hair",
    price: "₹1,890",
    match: 91,
    badge: "AI Pick",
    rating: 4.7,
    reviews: 208,
    accent: "#2A9D8F",
    description: "Deep-penetrating ceramide mask with Argan & Baobab oil.",
  },
  {
    id: "p4",
    name: "DermaClear Tonic",
    subtitle: "Dandruff Control",
    price: "₹1,690",
    match: 85,
    badge: null,
    rating: 4.6,
    reviews: 178,
    accent: "#1A5568",
    description: "Salicylic acid + Tea Tree for a flake-free scalp.",
  },
  {
    id: "p5",
    name: "ProGrowth Peptide Ampoule",
    subtitle: "Growth Stimulation",
    price: "₹4,190",
    match: 96,
    badge: "Clinical Select",
    rating: 5.0,
    reviews: 89,
    accent: "#D4AF37",
    description: "10 bioactive peptides that signal follicle reactivation.",
  },
];

const comparisonData = [
  { label: "Follicia AI", value: 92, isBrand: true },
  { label: "Generic Brands", value: 41, isBrand: false },
  { label: "Salon Consult", value: 63, isBrand: false },
  { label: "Trial & Error", value: 24, isBrand: false },
];

const steps = [
  {
    num: "01",
    icon: <Microscope size={26} />,
    title: "AI Analysis",
    desc: "Complete our 90-second assessment. Our AI analyses your scalp type, lifestyle, environment, and goals.",
    color: "#D4AF37",
  },
  {
    num: "02",
    icon: <BarChart2 size={26} />,
    title: "Precision Matching",
    desc: "Cross-references 2,400+ formulations against your profile to build a bespoke regimen.",
    color: "#2A9D8F",
  },
  {
    num: "03",
    icon: <Package size={26} />,
    title: "Clinical Delivery",
    desc: "Eco-conscious packaging, personalised protocol guide, and smart refill reminders.",
    color: "#4DBCB0",
  },
];

/* ── Animated Comparison Chart ─────────────────────────── */
function ComparisonChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="space-y-4">
      {comparisonData.map((item, i) => (
        <div key={item.label}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "6px",
            }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                fontWeight: item.isBrand ? 700 : 500,
                color: item.isBrand ? "#0D3B44" : "#9AABA5",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: item.isBrand ? "#0D3B44" : "#9AABA5",
              }}
            >
              {item.value}%
            </span>
          </div>
          <div className="progress-track">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${item.value}%` } : { width: 0 }}
              transition={{ duration: 1.3, delay: i * 0.15, ease: E }}
              style={{
                height: "100%",
                borderRadius: "9999px",
                background: item.isBrand
                  ? "linear-gradient(90deg, #0D3B44, #2A9D8F)"
                  : "#D5E0DC",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Product Card ───────────────────────────────────────── */
function ProductCard({
  p,
  i,
  onAdd,
}: {
  p: (typeof products)[0];
  i: number;
  onAdd: () => void;
}) {
  const [added, setAdded] = useState(false);
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      custom={i}
      className="product-card"
    >
      {/* Image area */}
      <div
        style={{
          position: "relative",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${p.accent}0D, ${p.accent}1A)`,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: 3 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${p.accent}22`,
            border: `2px solid ${p.accent}30`,
          }}
        >
          <Leaf size={36} color={p.accent} />
        </motion.div>

        {/* Badges top row */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {p.badge && (
            <span
              className={
                p.badge === "AI Pick" || p.badge === "Clinical Select"
                  ? "badge-seafoam"
                  : "badge-teal"
              }
            >
              {(p.badge === "AI Pick" || p.badge === "Clinical Select") && (
                <Sparkles size={9} />
              )}
              {p.badge}
            </span>
          )}
        </div>
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <span className="badge-gold">{p.match}% Match</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.1rem" }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: "#9AABA5",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {p.subtitle}
        </p>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#0D3B44",
            marginBottom: "6px",
            lineHeight: 1.3,
          }}
        >
          {p.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            color: "#9AABA5",
            marginBottom: "10px",
            lineHeight: 1.5,
          }}
        >
          {p.description}
        </p>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "2px" }}>
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={11}
                fill={j < Math.floor(p.rating) ? "#D4AF37" : "none"}
                color={j < Math.floor(p.rating) ? "#D4AF37" : "#D5E0DC"}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              color: "#9AABA5",
            }}
          >
            {p.rating} ({p.reviews})
          </span>
        </div>

        {/* Price + CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#0D3B44",
            }}
          >
            {p.price}
          </span>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAdded(true);
              onAdd();
              setTimeout(() => setAdded(false), 1800);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.45rem 1rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "0.78rem",
              background: added ? "rgba(42,157,143,0.12)" : "#0D3B44",
              color: added ? "#2A9D8F" : "#F4F7F5",
              transition: "all 0.25s ease",
            }}
            id={`add-cart-${p.id}`}
          >
            {added ? (
              <>
                <CheckCircle size={13} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={13} /> Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <main
      style={{ background: "#F4F7F5", minHeight: "100vh", overflowX: "hidden" }}
    >
      <Navbar onLoginClick={() => setModalOpen(true)} cartCount={cartCount} />
      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ══ HERO ════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          paddingTop: "7rem",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ─ Background tints */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 75% 45%, rgba(42,157,143,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 15% 55%, rgba(13,59,68,0.05) 0%, transparent 60%)",
          }}
        />
        {/* ─ Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            opacity: 0.25,
            backgroundImage:
              "linear-gradient(rgba(42,157,143,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(42,157,143,0.07) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* ─ Content wrapper */}
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1.5rem",
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "4rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* LEFT — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.55, ease: E }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "9999px",
                background: "rgba(42,157,143,0.1)",
                border: "1px solid rgba(42,157,143,0.25)",
                color: "#2A9D8F",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              <Zap size={11} />
              Clinical-Chic Hair Science — Powered by AI
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.65, ease: E }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.08,
                color: "#0D3B44",
                marginBottom: "1.25rem",
              }}
            >
              Your Hair,{" "}
              <span className="gradient-text-teal">Decoded</span>
              <br />
              by AI.
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: E }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "#4A6B63",
                marginBottom: "2.25rem",
                maxWidth: "480px",
              }}
            >
              Stop the trial-and-error. Our AI analyses your unique scalp
              biology to deliver a clinical-grade regimen formulated
              exclusively for you.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6, ease: E }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-teal"
                style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
              >
                <Sparkles size={18} />
                Generate My Hair Profile
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-outline-teal"
                style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}
              >
                Explore Products
              </motion.button>
            </motion.div>

            {/* Trust stats — fixed grid so labels don't collide */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
                borderTop: "1px solid #E8EDEB",
                paddingTop: "1.5rem",
              }}
            >
              {[
                { val: "94%", label: "See improvement in 30 days" },
                { val: "12k+", label: "Personalised regimens delivered" },
                { val: "100%", label: "Clean-beauty certified" },
              ].map((s) => (
                <div key={s.val}>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "1.75rem",
                      background: "linear-gradient(135deg, #0D3B44, #2A9D8F)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: "4px",
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.72rem",
                      color: "#9AABA5",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — AI Report Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.75, ease: E }}
            style={{ position: "relative" }}
          >
            {/* Main panel */}
            <div
              style={{
                borderRadius: "1.75rem",
                overflow: "hidden",
                padding: "2.25rem",
                background:
                  "linear-gradient(145deg, #0D3B44 0%, #1A5568 55%, #2A7A8A 100%)",
                boxShadow: "0 40px 96px rgba(13,59,68,0.28)",
                position: "relative",
              }}
            >
              {/* Decorative orbs */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(212,175,55,0.18), transparent)",
                  transform: "translate(35%, -35%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(42,157,143,0.12), transparent)",
                  transform: "translate(-35%, 35%)",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Panel header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(212,175,55,0.18)",
                      border: "1px solid rgba(212,175,55,0.35)",
                      flexShrink: 0,
                    }}
                  >
                    <Leaf size={18} color="#D4AF37" className="animate-float" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#2A9D8F",
                        marginBottom: "2px",
                      }}
                    >
                      Your AI Report
                    </p>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: "#F4F7F5",
                      }}
                    >
                      Scalp Assessment Complete
                    </p>
                  </div>
                </div>

                {/* Scalp metric bars */}
                <div style={{ marginBottom: "1.5rem" }}>
                  {[
                    { label: "Sebum Balance", value: 78, color: "#2A9D8F" },
                    { label: "Hydration Index", value: 62, color: "#D4AF37" },
                    { label: "Follicle Density", value: 85, color: "#4DBCB0" },
                    { label: "Microbiome Health", value: 71, color: "#2A9D8F" },
                  ].map((m, idx) => (
                    <div key={m.label} style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.75rem",
                            color: "rgba(244,247,245,0.75)",
                          }}
                        >
                          {m.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: m.color,
                          }}
                        >
                          {m.value}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: "5px",
                          borderRadius: "9999px",
                          background: "rgba(255,255,255,0.1)",
                          overflow: "hidden",
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.value}%` }}
                          transition={{
                            duration: 1.4,
                            delay: 0.5 + idx * 0.12,
                            ease: E,
                          }}
                          style={{
                            height: "100%",
                            borderRadius: "9999px",
                            background: m.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI recommendation preview */}
                <div
                  style={{
                    borderRadius: "1rem",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(212,175,55,0.15)",
                      flexShrink: 0,
                    }}
                  >
                    <Leaf size={20} color="#D4AF37" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#F4F7F5",
                        marginBottom: "2px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      BioBalance Scalp Serum
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.72rem",
                        color: "rgba(244,247,245,0.6)",
                      }}
                    >
                      96% bio-match for your profile
                    </p>
                  </div>
                  <span
                    className="badge-gold"
                    style={{ flexShrink: 0, fontSize: "0.65rem" }}
                  >
                    AI Pick
                  </span>
                </div>
              </div>
            </div>

            {/* Floating pill — accuracy */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.6, ease: E }}
              style={{
                position: "absolute",
                left: "-1.5rem",
                top: "30%",
                background: "#FFFFFF",
                borderRadius: "1rem",
                padding: "0.75rem 1.1rem",
                boxShadow: "0 12px 32px rgba(13,59,68,0.12)",
                border: "1px solid rgba(42,157,143,0.18)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "2px",
                }}
              >
                <TrendingUp size={14} color="#2A9D8F" />
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "#0D3B44",
                  }}
                >
                  94% accuracy
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.68rem",
                  color: "#9AABA5",
                }}
              >
                vs generic products
              </p>
            </motion.div>

            {/* Floating pill — regimens */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: E }}
              style={{
                position: "absolute",
                right: "-1.5rem",
                bottom: "14%",
                background: "#FFFFFF",
                borderRadius: "1rem",
                padding: "0.75rem 1.1rem",
                boxShadow: "0 12px 32px rgba(13,59,68,0.12)",
                border: "1px solid rgba(212,175,55,0.22)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#0D3B44",
                  marginBottom: "2px",
                }}
              >
                12,000+ regimens
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.68rem",
                  color: "#9AABA5",
                }}
              >
                delivered worldwide
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#9AABA5",
          }}
        >
          <ChevronDown size={22} />
        </motion.div>
      </section>

      {/* ── Responsive hero grid fix ────────────────────── */}
      <style>{`
        @media (max-width: 1023px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>

      {/* ══ COMPARISON SECTION ══════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem" }} id="science">
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "4rem",
              alignItems: "center",
            }}
            className="two-col-grid"
          >
            {/* Left */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <motion.p variants={fadeUp} custom={0} className="section-label" style={{ marginBottom: "12px" }}>
                The Follicia Difference
              </motion.p>
              <motion.h2
                variants={fadeUp}
                custom={1}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  color: "#0D3B44",
                  lineHeight: 1.15,
                  marginBottom: "1.25rem",
                }}
              >
                Stop the
                <br />
                Trial-and-Error.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  color: "#4A6B63",
                  lineHeight: 1.7,
                  marginBottom: "1.75rem",
                  maxWidth: "420px",
                }}
              >
                Most people spend years and thousands on products never designed
                for them. Follicia matches you with clinical precision — first
                time, every time.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "Proprietary scalp biomarker analysis",
                  "Cross-referenced against 2,400+ formulations",
                  "Continuously refined with your results",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={16} color="#2A9D8F" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#4A6B63" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — bar chart card */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: E }}
              style={{
                background: "#FFFFFF",
                borderRadius: "1.5rem",
                padding: "2rem",
                border: "1px solid #E8EDEB",
                boxShadow: "0 12px 40px rgba(13,59,68,0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <BarChart2 size={17} color="#0D3B44" />
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#0D3B44",
                  }}
                >
                  Personalisation Accuracy
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#9AABA5", marginBottom: "1.5rem" }}>
                vs. generic alternatives · independent study, n=2,400
              </p>
              <ComparisonChart />
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#9AABA5", marginTop: "1rem" }}>
                * Based on self-reported improvement metrics at 30 days
              </p>
            </motion.div>
          </div>
        </div>
        <style>{`
          @media (max-width: 767px) {
            .two-col-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </section>

      {/* ══ PRODUCT GRID ════════════════════════════════════ */}
      <section
        style={{ padding: "5rem 1.5rem", background: "#FAFCFB" }}
        id="products"
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <motion.p variants={fadeUp} custom={0} className="section-label" style={{ marginBottom: "10px" }}>
              Clinically Matched
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                color: "#0D3B44",
                marginBottom: "1rem",
              }}
            >
              Your AI-Selected Regimen
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
              Every product is scored against your scalp profile. Match %
              indicates biological compatibility — not marketing.
            </motion.p>
          </motion.div>

          {/* 5-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "1.25rem",
            }}
            className="product-grid-5"
          >
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                i={i}
                onAdd={() => setCartCount((c) => c + 1)}
              />
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 1279px) { .product-grid-5 { grid-template-columns: repeat(3, 1fr) !important; } }
          @media (max-width: 767px)  { .product-grid-5 { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 479px)  { .product-grid-5 { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <section
        style={{ padding: "6rem 1.5rem", background: "#0D3B44" }}
        id="how-it-works"
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
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
                color: "#2A9D8F",
                marginBottom: "10px",
              }}
            >
              The Protocol
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#F4F7F5",
                marginBottom: "1rem",
              }}
            >
              How It Works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(244,247,245,0.6)",
                maxWidth: "440px",
                margin: "0 auto",
              }}
            >
              Three clinical steps from assessment to transformation.
            </motion.p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.75rem",
              marginBottom: "3rem",
            }}
            className="steps-grid"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                whileHover={{ y: -6 }}
                style={{
                  borderRadius: "1.5rem",
                  padding: "2rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.3s ease",
                }}
              >
                {/* Ghost step number */}
                <span
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1.25rem",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "4.5rem",
                    color: s.color,
                    opacity: 0.1,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {s.num}
                </span>

                {/* Icon */}
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `${s.color}22`,
                    color: s.color,
                    marginBottom: "1.25rem",
                  }}
                >
                  {s.icon}
                </div>

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "#F4F7F5",
                    marginBottom: "0.75rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    color: "rgba(244,247,245,0.6)",
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold"
              style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}
            >
              <Sparkles size={18} />
              Start My 90-Second Assessment
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>
        <style>{`
          @media (max-width: 767px) { .steps-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ══ CTA BANNER ══════════════════════════════════════ */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: E }}
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            borderRadius: "2rem",
            padding: "5rem 3rem",
            textAlign: "center",
            background: "linear-gradient(135deg, #2A9D8F 0%, #0D3B44 100%)",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(13,59,68,0.2)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 70% 25%, rgba(212,175,55,0.15) 0%, transparent 55%)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#D4AF37",
                marginBottom: "1rem",
              }}
            >
              Your personalised plan awaits
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                color: "#F4F7F5",
                marginBottom: "1.25rem",
                lineHeight: 1.2,
              }}
            >
              Ready to meet your
              <br />
              best hair?
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(244,247,245,0.72)",
                marginBottom: "2.5rem",
                maxWidth: "480px",
                margin: "0 auto 2.5rem",
                lineHeight: 1.65,
              }}
            >
              Take our 90-second AI scalp quiz and unlock a clinical-grade
              regimen crafted just for you. Free. No commitment.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn-gold"
                style={{ fontSize: "1rem", padding: "1rem 2.25rem" }}
              >
                Start My Regimen
                <ArrowRight size={18} />
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "1rem 2.25rem",
                  borderRadius: "9999px",
                  border: "1.5px solid rgba(244,247,245,0.35)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#F4F7F5",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                onHoverStart={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.15)";
                }}
                onHoverEnd={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                }}
              >
                Explore Products
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
