"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
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
import Toast from "@/components/Toast";
import PricingSection from "@/components/PricingSection";
import { QuizPopup } from "@/components/QuizPopup";

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

const protocolSteps = [
  {
    step: "01",
    title: "Scalp & environmental intake",
    summary: "A 90-second diagnostic covering scalp sebum levels, local tap water hardness, heat styling frequency, and shedding concerns.",
    tag: "90 seconds online",
  },
  {
    step: "02",
    title: "Targeted formulation compounding",
    summary: "We match clinically studied botanical actives and amino complexes to your scalp barrier state and hair porosity.",
    tag: "Batch-compounded",
  },
  {
    step: "03",
    title: "Delivered fresh with protocol card",
    summary: "Your bottles arrive with exact dosage guidelines and application timing, followed by scheduled check-ins at 30 and 60 days.",
    tag: "Free shipping & refills",
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
  const [showToast, setShowToast] = useState(false);
  const [isQuizPopupOpen, setIsQuizPopupOpen] = useState(false);

  useEffect(() => {
    // Check if the popup has already been shown in this session (optional, but good practice)
    const hasShownPopup = sessionStorage.getItem("quizPopupShown");
    
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsQuizPopupOpen(true);
        sessionStorage.setItem("quizPopupShown", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAddToCart = () => {
    setShowToast(true);
  };

  return (
    <main
      style={{ background: "#F4F7F5", minHeight: "100vh", overflowX: "hidden" }}
    >
      <QuizPopup isOpen={isQuizPopupOpen} onClose={() => setIsQuizPopupOpen(false)} />
      
      {/* ── Shared navbar ──────────────────── */}
      <Navbar />

      <Toast 
        message="Added to cart!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      {/* ══ HERO CAROUSEL ════════════════════════════════ */}
      <HeroCarousel />

      {/* ══ MARQUEE TRUST BANNER ═════════════════════════ */}
      <MarqueeBanner />

      {/* ══ PRODUCT GRID ═════════════════════════════════ */}
      <ProductGrid onAdd={handleAddToCart} />

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
        style={{ padding: "6rem 1.5rem", background: "#0D3B44", color: "#F4F7F5" }}
        id="how-it-works"
      >
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div
            className="how-it-works-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.25fr",
              gap: "4.5rem",
              alignItems: "start",
            }}
          >
            {/* Left Column: Context, value prop & direct action */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
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
                The Process
              </motion.p>
              <motion.h2
                variants={fadeUp}
                custom={1}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                  color: "#F4F7F5",
                  lineHeight: 1.2,
                  marginBottom: "1.25rem",
                }}
              >
                Formulated for your scalp, adjusted every season.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={2}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(244, 247, 245, 0.7)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  maxWidth: "460px",
                }}
              >
                Commercial shampoos and treatments sit on retail shelves for up to three years. We batch-formulate active serums and cleansers suited to your water hardness, scalp microbiome, and styling habits.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  marginBottom: "2.25rem",
                  maxWidth: "460px",
                }}
              >
                {[
                  "Freshly compounded in 50ml dark glass bottles",
                  "Balanced to scalp-friendly pH 5.0 – 5.5",
                  "Free formula refinement after your 30-day check-in",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle size={15} color="#2A9D8F" style={{ flexShrink: 0 }} />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.85rem",
                        color: "rgba(244, 247, 245, 0.85)",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} custom={4}>
                <Link href="/quiz" style={{ textDecoration: "none" }}>
                  <motion.button
                    whileHover={{ opacity: 0.92, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: "#2A9D8F",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "9999px",
                      padding: "0.85rem 1.75rem",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      transition: "background 0.2s ease, transform 0.2s ease",
                    }}
                  >
                    Take the 90-second hair quiz
                    <ArrowRight size={15} />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Progressive sequential stages */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {protocolSteps.map((s, idx) => (
                <motion.div
                  key={s.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  custom={idx}
                  style={{
                    padding: "1.75rem 2rem",
                    borderRadius: "1rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#2A9D8F",
                      lineHeight: 1,
                      paddingTop: "3px",
                      minWidth: "32px",
                    }}
                  >
                    {s.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "#F4F7F5",
                          margin: 0,
                        }}
                      >
                        {s.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.72rem",
                          color: "#9AABA5",
                          background: "rgba(255, 255, 255, 0.05)",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "rgba(244, 247, 245, 0.65)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {s.summary}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 960px) {
            .how-it-works-grid {
              grid-template-columns: 1fr !important;
              gap: 3rem !important;
            }
          }
        `}</style>
      </section>

      {/* ══ PRICING SECTION ═════════════════════════════ */}
      <PricingSection />

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
              <Link href="/quiz">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-gold"
                  style={{ fontSize: "1rem", padding: "1rem 2.25rem" }}
                >
                  Start My Regimen
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/shop">
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
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
