"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Microscope,
  Leaf,
  Package,
  Star,
  ChevronDown,
  Zap,
  BarChart2,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import MarqueeBanner from "@/components/MarqueeBanner";
import ProductGrid from "@/components/ProductGrid";

/* ── Animation helpers ──────────────────────────────────── */
const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: E },
  }),
};

/* ── Comparison data ────────────────────────────────────── */
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

/* ── Page ───────────────────────────────────────────────── */
export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <main
      style={{ background: "#F4F7F5", minHeight: "100vh", overflowX: "hidden" }}
    >
      {/* ── Shared navbar ──────────────────── */}
      <Navbar cartCount={cartCount} />

      {/* ══ HERO CAROUSEL ════════════════════════════════ */}
      <HeroCarousel />

      {/* ══ MARQUEE TRUST BANNER ═════════════════════════ */}
      <MarqueeBanner />

      {/* ══ PRODUCT GRID ═════════════════════════════════ */}
      <ProductGrid onAdd={() => setCartCount((c) => c + 1)} />

      {/* ══ COMPARISON SECTION ══════════════════════════ */}
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
              <motion.p
                variants={fadeUp}
                custom={0}
                className="section-label"
                style={{ marginBottom: "12px" }}
              >
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

              <motion.div
                variants={fadeUp}
                custom={3}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {[
                  "Proprietary scalp biomarker analysis",
                  "Cross-referenced against 2,400+ formulations",
                  "Continuously refined with your results",
                ].map((item) => (
                  <div
                    key={item}
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <CheckCircle
                      size={16}
                      color="#2A9D8F"
                      style={{ flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#4A6B63",
                      }}
                    >
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
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
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.78rem",
                  color: "#9AABA5",
                  marginBottom: "1.5rem",
                }}
              >
                vs. generic alternatives · independent study, n=2,400
              </p>
              <ComparisonChart />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#9AABA5",
                  marginTop: "1rem",
                }}
              >
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

      {/* ══ HOW IT WORKS ════════════════════════════════ */}
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

      {/* ══ CTA BANNER ══════════════════════════════════ */}
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
              background:
                "radial-gradient(circle at 70% 25%, rgba(212,175,55,0.15) 0%, transparent 55%)",
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
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
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
