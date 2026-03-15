"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShoppingCart,
  Star,
  Leaf,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

/* ── Data ────────────────────────────────────────────────────────────── */
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
    bg: "rgba(42,157,143,0.06)",
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
    accent: "#8B6914",
    bg: "rgba(184,134,11,0.06)",
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
    bg: "rgba(42,157,143,0.06)",
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
    accent: "#5C8A7A",
    bg: "rgba(92,138,122,0.06)",
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
    accent: "#B8860B",
    bg: "rgba(184,134,11,0.07)",
    description: "10 bioactive peptides that signal follicle reactivation.",
  },
];

const categories = ["All", "Scalp Care", "Growth", "Hydration", "Cleanse"];

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const scaleIn = {
  hidden: { opacity: 0, scale: 0.93, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: E },
  }),
};

/* ── Product card ────────────────────────────────────────────────────── */
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
    <motion.article
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      custom={i}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        background: "#FFFFFF",
        borderRadius: "1.25rem",
        border: "1px solid #E8EDEB",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(13,59,68,0.05)",
        transition: "box-shadow 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label={`Product: ${p.name}`}
    >
      {/* Image / colour swatch area */}
      <div
        style={{
          position: "relative",
          height: "188px",
          background: p.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Decorative orb */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 60% 40%, ${p.accent}18 0%, transparent 65%)`,
          }}
        />
        {/* Product icon placeholder */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 4 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            background: `${p.accent}1A`,
            border: `2px solid ${p.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Leaf size={34} color={p.accent} />
        </motion.div>

        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {p.badge && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 10px",
                borderRadius: "9999px",
                background:
                  p.badge === "Best Seller"
                    ? "linear-gradient(135deg,#D4AF37,#E8CC6A)"
                    : "rgba(42,157,143,0.12)",
                border:
                  p.badge === "Best Seller"
                    ? "none"
                    : "1px solid rgba(42,157,143,0.3)",
                color: p.badge === "Best Seller" ? "#0D3B44" : "#2A9D8F",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {p.badge !== "Best Seller" && <Sparkles size={8} />}
              {p.badge}
            </span>
          )}
        </div>

        {/* Match badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 9px",
              borderRadius: "9999px",
              background: "rgba(212,175,55,0.1)",
              border: "1px solid rgba(212,175,55,0.35)",
              color: "#B8860B",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.6rem",
              fontWeight: 700,
            }}
          >
            {p.match}% Match
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem 1.1rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.62rem",
            fontWeight: 600,
            color: "#9AABA5",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "3px",
          }}
        >
          {p.subtitle}
        </p>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "0.92rem",
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
            fontSize: "0.74rem",
            color: "#9AABA5",
            marginBottom: "10px",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {p.description}
        </p>

        {/* Stars */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "2px" }}>
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={10}
                fill={j < Math.floor(p.rating) ? "#D4AF37" : "none"}
                color={j < Math.floor(p.rating) ? "#D4AF37" : "#D5E0DC"}
              />
            ))}
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              color: "#9AABA5",
            }}
          >
            {p.rating} ({p.reviews})
          </span>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.05rem",
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
            id={`add-cart-${p.id}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.42rem 0.95rem",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "0.75rem",
              background: added ? "rgba(42,157,143,0.1)" : "#0D3B44",
              color: added ? "#2A9D8F" : "#F4F7F5",
              transition: "all 0.25s ease",
            }}
          >
            {added ? (
              <>
                <CheckCircle size={12} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={12} /> Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ── ProductGrid section ─────────────────────────────────────────────── */
export default function ProductGrid({
  onAdd,
}: {
  onAdd: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <section
      id="products"
      style={{ padding: "5.5rem 1.5rem", background: "#FAFCFB" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: E }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <p
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
            Clinically Matched
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
              color: "#0D3B44",
              marginBottom: "0.85rem",
            }}
          >
            Your AI-Selected Regimen
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: "#4A6B63",
              maxWidth: "500px",
              margin: "0 auto 2rem",
              lineHeight: 1.65,
            }}
          >
            Every product is scored against your scalp profile. Match %
            indicates biological compatibility — not marketing.
          </p>

          {/* Category filter pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.4rem 1.1rem",
                  borderRadius: "9999px",
                  border: `1.5px solid ${activeCategory === cat ? "#0D3B44" : "#D5E0DC"}`,
                  background:
                    activeCategory === cat ? "#0D3B44" : "transparent",
                  color: activeCategory === cat ? "#F4F7F5" : "#4A6B63",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="product-grid-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} onAdd={onAdd} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ textAlign: "center", marginTop: "2.5rem" }}
        >
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              border: "1.5px solid #0D3B44",
              background: "transparent",
              color: "#0D3B44",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.22s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#0D3B44";
              (e.currentTarget as HTMLButtonElement).style.color = "#F4F7F5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#0D3B44";
            }}
          >
            View All Products
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        .product-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1279px) { .product-grid-5 { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 767px)  { .product-grid-5 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 479px)  { .product-grid-5 { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
