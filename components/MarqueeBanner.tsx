"use client";

import { motion } from "framer-motion";
import { Leaf, Sparkles, ShieldCheck, Droplets, FlaskConical, Recycle } from "lucide-react";

/* ── Trust markers ──────────────────────────────────────────────────── */
const trustItems = [
  { icon: <ShieldCheck size={14} />, label: "No Sulphates" },
  { icon: <Droplets size={14} />, label: "No Parabens" },
  { icon: <Leaf size={14} />, label: "100% Vegan" },
  { icon: <FlaskConical size={14} />, label: "Clinically Tested" },
  { icon: <Sparkles size={14} />, label: "AI-Personalised" },
  { icon: <Recycle size={14} />, label: "Eco Packaging" },
  { icon: <ShieldCheck size={14} />, label: "Dermatologist Approved" },
  { icon: <Droplets size={14} />, label: "No Silicones" },
  { icon: <Leaf size={14} />, label: "Cruelty Free" },
  { icon: <FlaskConical size={14} />, label: "Science-Backed Actives" },
];

/* ── Separator ──────────────────────────────────────────────────────── */
const Sep = () => (
  <span
    aria-hidden
    style={{
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      background: "rgba(42,157,143,0.4)",
      flexShrink: 0,
    }}
  />
);

/* ── Single marquee row ─────────────────────────────────────────────── */
function MarqueeRow({
  items,
  speed = 40,
  reverse = false,
}: {
  items: typeof trustItems;
  speed?: number;
  reverse?: boolean;
}) {
  // Duplicate enough times to ensure seamless loop at any viewport width
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        mask: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMask:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <motion.div
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          width: "max-content",
          paddingRight: "1.5rem",
        }}
      >
        {repeated.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                color: "#2A9D8F",
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#4A6B63",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
            <Sep />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Banner component ───────────────────────────────────────────────── */
export default function MarqueeBanner() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F4F7F5 0%, #EFF5F2 100%)",
        borderTop: "1px solid #E8EDEB",
        borderBottom: "1px solid #E8EDEB",
        padding: "0.85rem 0",
        overflow: "hidden",
      }}
    >
      <MarqueeRow items={trustItems} speed={38} />
    </div>
  );
}
