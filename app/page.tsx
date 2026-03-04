"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  FlaskConical,
  ShieldCheck,
  ArrowRight,
  Leaf,
  Star,
  ChevronDown,
} from "lucide-react";

/* ── Animation variants ─────────────────────────────────── */
const EASE_SMOOTH = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: EASE_SMOOTH },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.55, ease: EASE_SMOOTH },
  }),
};

/* ── Data ───────────────────────────────────────────────── */
const features = [
  {
    icon: <FlaskConical size={28} />,
    title: "Clinically Formulated",
    description:
      "Every product backed by dermatological research and precision-tested ingredients.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "AI-Personalised",
    description:
      "Our AI engine analyses your scalp type and lifestyle to build your unique regimen.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Clean & Safe",
    description:
      "Sulphate-free, paraben-free. Transparent ingredient lists. Always cruelty-free.",
  },
  {
    icon: <Leaf size={28} />,
    title: "Sustainably Sourced",
    description:
      "Ethically harvested botanicals with carbon-neutral packaging by 2026.",
  },
];

const stats = [
  { value: "94%", label: "Customers report visible improvement in 30 days" },
  { value: "12k+", label: "Personalised regimens delivered worldwide" },
  { value: "100%", label: "Clean-beauty certified formulations" },
];

/* ── Floating orb bg decoration ────────────────────────── */
function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, #E8C5B0 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 -left-60 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, #8FAF96 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, #C9806A 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div
        className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3 glass-card"
        style={{ borderRadius: "9999px" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #B5604B, #C9806A)",
            }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#2C2C2C" }}
          >
            Follicia
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: "#8A8A8A" }}>
          {["Products", "Regimen", "Science", "About"].map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-[#B5604B] transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-brand text-sm py-2 px-5">
          Get Started
        </button>
      </div>
    </motion.nav>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
      {/* Badge */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 glass-card"
        style={{ color: "#B5604B", border: "1px solid #E8C5B0" }}
      >
        <Star size={13} fill="#B5604B" />
        Clinical-Chic Hair Science — Now Personalised
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 max-w-4xl"
        style={{ fontFamily: "Playfair Display, Georgia, serif", color: "#2C2C2C" }}
      >
        Hello,{" "}
        <span className="gradient-text">Follicia.</span>
        <br />
        Your hair, reimagined.
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        style={{ color: "#8A8A8A" }}
      >
        AI-driven diagnostics meet clinical-grade formulations. Discover a
        personalised hair care regimen crafted exclusively for your scalp, your
        lifestyle, and your goals.
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <button className="btn-brand text-base px-8 py-3.5">
          Take Your Scalp Quiz
          <ArrowRight size={18} />
        </button>
        <button
          className="px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-300 hover:bg-[#F5EFE7]"
          style={{ color: "#2C2C2C", border: "1.5px solid #E8C5B0" }}
        >
          Explore Products
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={4}
        className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full"
      >
        {stats.map((stat) => (
          <div key={stat.value} className="text-center">
            <p
              className="text-3xl font-bold mb-1"
              style={{
                fontFamily: "Playfair Display, serif",
                background: "linear-gradient(135deg, #B5604B, #C9806A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.value}
            </p>
            <p className="text-xs leading-snug" style={{ color: "#8A8A8A" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mt-16"
        style={{ color: "#C9C9C9" }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

/* ── Features ───────────────────────────────────────────── */
function Features() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-center mb-16"
      >
        <motion.p
          variants={fadeUp}
          custom={0}
          className="text-sm font-semibold tracking-widest uppercase mb-3"
          style={{ color: "#B5604B" }}
        >
          Why Follicia
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-4xl md:text-5xl font-bold"
          style={{ fontFamily: "Playfair Display, serif", color: "#2C2C2C" }}
        >
          Science you can feel.
          <br />
          Luxury you deserve.
        </motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            custom={i}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="glass-card p-7 flex flex-col gap-4 cursor-default"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #F5EFE7, #E8C5B0)", color: "#B5604B" }}
            >
              {f.icon}
            </div>
            <h3 className="font-semibold text-lg" style={{ color: "#2C2C2C" }}>
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#8A8A8A" }}>
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA Banner ─────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_SMOOTH }}
        className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #2C2C2C 0%, #3D2B26 50%, #2C2C2C 100%)",
          padding: "4rem 3rem",
        }}
      >
        {/* Decorative orb */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #C9806A, transparent)",
            filter: "blur(60px)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div className="relative z-10 text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#E8C5B0" }}>
            Your personalized plan awaits
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, serif", color: "#FAF7F2" }}
          >
            Ready to meet your
            <br />
            <span style={{ color: "#E8C5B0" }}>best hair?</span>
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "#8A8A8A" }}>
            Take our 90-second AI scalp quiz and unlock a clinical-grade
            regimen crafted just for you. Free. No commitment.
          </p>
          <button className="btn-brand text-base px-10 py-4">
            Start My Regimen
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t py-10 px-6" style={{ borderColor: "#E8C5B0" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #B5604B, #C9806A)" }}
          >
            <Sparkles size={13} color="#fff" />
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "Playfair Display, serif", color: "#2C2C2C" }}
          >
            Follicia
          </span>
        </div>
        <p className="text-sm" style={{ color: "#8A8A8A" }}>
          © {new Date().getFullYear()} Follicia. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm" style={{ color: "#8A8A8A" }}>
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-[#B5604B] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="relative min-h-screen" style={{ background: "var(--ivory)" }}>
      <BackgroundOrbs />
      <Navbar />
      <Hero />
      <Features />
      <CTABanner />
      <Footer />
    </main>
  );
}
