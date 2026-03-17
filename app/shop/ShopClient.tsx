"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShoppingBag,
  Check,
  Leaf,
  ChevronDown,
  ChevronUp,
  Sparkles,
  SlidersHorizontal,
  ShoppingCart,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

/* ══════════════════════════════════════════════════════════════
   BRAND CONSTANTS — extracted 1:1 from globals.css / page.tsx
══════════════════════════════════════════════════════════════ */
const B = {
  teal: "#0D3B44",
  tealMid: "#1A5568",
  seafoam: "#2A9D8F",
  seafoamLight: "#4DBCB0",
  gold: "#D4AF37",
  goldLight: "#E8CC6A",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  borderGray: "#D5E0DC",
  midGray: "#9AABA5",
  darkText: "#1C2B28",
  bodyText: "#4A6B63",
  shopNow: "#E2F33E", // Hero CTA accent
};

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════════
   PRODUCT DATA
══════════════════════════════════════════════════════════════ */
export type Product = {
  id: string;
  name: string;
  tagline: string | null;
  price: number;
  priceDisplay: string | null;
  category: string | null;
  hairType: string[];
  porosity: string[];
  condition: string[];
  badge: string | null;
  accent: string;
  bg: string;
  rating: number;
  reviews: number;
  description: string | null;
  howToUse: string;
};

/* ══════════════════════════════════════════════════════════════
   FILTER CONFIG
══════════════════════════════════════════════════════════════ */
const CATEGORIES = ["All", "Scalp Care", "Treatments", "Conditioning", "Cleansing"];
const HAIR_TYPES = ["All", "Fine", "Normal", "Dry", "Oily", "Curly", "Coily", "Damaged"];
const POROSITIES = ["All", "Low", "Medium", "High"];
const CONDITIONS = [
  "All", "Dryness", "Frizz", "Thinning", "Breakage", "Dandruff",
  "Buildup", "Dullness", "Damage", "Flatness", "Irritation",
];

type Filters = {
  category: string;
  hairType: string;
  porosity: string;
  condition: string;
};

/* ══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
══════════════════════════════════════════════════════════════ */
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.45, ease: E },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ══════════════════════════════════════════════════════════════
   FILTER SECTION (collapsible)
══════════════════════════════════════════════════════════════ */
function FilterSection({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ borderBottom: `1px solid ${B.borderGray}`, paddingBottom: "1rem", marginBottom: "1rem" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.25rem 0",
          marginBottom: open ? "0.75rem" : 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: "0.68rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: B.teal,
          }}
        >
          {title}
        </span>
        {open ? <ChevronUp size={14} color={B.midGray} /> : <ChevronDown size={14} color={B.midGray} />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: E }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {options.map((opt) => {
                const active = value === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: active ? `${B.teal}08` : "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.35rem 0.5rem",
                      borderRadius: "6px",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "4px",
                        border: `1.5px solid ${active ? B.seafoam : B.borderGray}`,
                        background: active ? B.seafoam : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.18s ease",
                      }}
                    >
                      {active && <Check size={9} color="#fff" strokeWidth={3} />}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.82rem",
                        color: active ? B.teal : B.bodyText,
                        fontWeight: active ? 600 : 400,
                        transition: "color 0.18s ease",
                      }}
                    >
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════════════════════ */
function ProductCard({
  product,
  index,
  onSelect,
}: {
  product: Product;
  index: number;
  onSelect: (p: Product) => void;
}) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("🔘 Add to Cart clicked for:", product.name);
    
    setAdded(true);
    
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay || `₹${product.price.toLocaleString("en-IN")}`,
      imageUrl: null,
      category: product.category,
    });
    
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(product)}
      style={{
        background: "#FFFFFF",
        borderRadius: "1.25rem",
        border: `1px solid ${B.lightGray}`,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(13,59,68,0.05)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(13,59,68,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(13,59,68,0.05)";
      }}
      aria-label={`View ${product.name}`}
    >
      {/* Image / visual area */}
      <div
        style={{
          position: "relative",
          height: "200px",
          background: product.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* Radial glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 60% 40%, ${product.accent}22 0%, transparent 70%)`,
          }}
        />

        {/* Icon orb */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 5 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: `${product.accent}18`,
            border: `2px solid ${product.accent}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Leaf size={34} color={product.accent} />
        </motion.div>

        {/* Badge */}
        {product.badge && (
          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 10px",
                borderRadius: "9999px",
                background:
                  product.badge === "Bestseller"
                    ? `linear-gradient(135deg, ${B.gold}, ${B.goldLight})`
                    : `rgba(42,157,143,0.12)`,
                border: product.badge === "Bestseller" ? "none" : `1px solid rgba(42,157,143,0.3)`,
                color: product.badge === "Bestseller" ? B.teal : B.seafoam,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
              }}
            >
              {product.badge !== "Bestseller" && <Sparkles size={8} />}
              {product.badge}
            </span>
          </div>
        )}

        {/* Category tag */}
        <div style={{ position: "absolute", top: "10px", right: "10px" }}>
          <span
            style={{
              padding: "3px 9px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(4px)",
              border: `1px solid ${B.borderGray}`,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.58rem",
              fontWeight: 600,
              color: B.bodyText,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem 1.15rem 1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.6rem",
            fontWeight: 600,
            color: product.accent,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "4px",
          }}
        >
          {product.tagline}
        </p>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: B.teal,
            lineHeight: 1.3,
            marginBottom: "8px",
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.76rem",
            color: B.midGray,
            lineHeight: 1.55,
            marginBottom: "10px",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {product.description}
        </p>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "12px" }}>
          <div style={{ display: "flex", gap: "2px" }}>
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={10}
                fill={j < Math.floor(product.rating) ? B.gold : "none"}
                color={j < Math.floor(product.rating) ? B.gold : B.borderGray}
              />
            ))}
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: B.midGray }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: B.teal,
            }}
          >
            {product.priceDisplay}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
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
              fontSize: "0.72rem",
              background: added ? "rgba(42,157,143,0.1)" : B.teal,
              color: added ? B.seafoam : B.cream,
              transition: "all 0.25s ease",
            }}
          >
            {added ? (
              <><Check size={11} /> Added</>
            ) : (
              <><ShoppingCart size={11} /> Add</>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRODUCT DETAIL MODAL
══════════════════════════════════════════════════════════════ */
function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = async () => {
    if (!product) return;
    
    console.log("🔘 Add to Cart clicked (modal) for:", product.name);
    
    setAdded(true);
    
    await addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay || `₹${product.price.toLocaleString("en-IN")}`,
      imageUrl: null,
      category: product.category,
    });
    
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "1.25rem",
          }}
        >
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: E }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "860px",
              background: "#FFFFFF",
              borderRadius: "1.5rem",
              boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
              border: `1px solid ${B.lightGray}`,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              overflow: "hidden",
              maxHeight: "90vh",
              position: "relative",
            }}
            className="modal-grid"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                zIndex: 10,
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(4px)",
                border: `1px solid ${B.borderGray}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: B.midGray,
              }}
            >
              <X size={16} />
            </button>

            {/* Left: Visual */}
            <div
              style={{
                background: product.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "360px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Ambient glow */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 55% 45%, ${product.accent}2A 0%, transparent 65%)`,
                }}
              />

              {/* Decorative rings */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  width: "240px",
                  height: "240px",
                  borderRadius: "50%",
                  border: `1px solid ${product.accent}20`,
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  border: `1px solid ${product.accent}30`,
                }}
              />

              {/* Central orb */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background: `${product.accent}20`,
                  border: `2px solid ${product.accent}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: `0 16px 40px ${product.accent}25`,
                }}
              >
                <Leaf size={48} color={product.accent} />
              </motion.div>

              {/* Badge on image */}
              {product.badge && (
                <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      background:
                        product.badge === "Bestseller"
                          ? `linear-gradient(135deg, ${B.gold}, ${B.goldLight})`
                          : "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(4px)",
                      color: product.badge === "Bestseller" ? B.teal : product.accent,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div
              style={{
                padding: "2rem 2rem 2rem 1.75rem",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              {/* Category label */}
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: product.accent,
                  marginBottom: "8px",
                }}
              >
                {product.category}
              </p>

              {/* Name */}
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)",
                  color: B.teal,
                  lineHeight: 1.2,
                  marginBottom: "4px",
                }}
              >
                {product.name}
              </h2>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.83rem",
                  color: B.midGray,
                  marginBottom: "16px",
                  fontStyle: "italic",
                }}
              >
                {product.tagline}
              </p>

              {/* Stars + reviews */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      fill={j < Math.floor(product.rating) ? B.gold : "none"}
                      color={j < Math.floor(product.rating) ? B.gold : B.borderGray}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    color: B.bodyText,
                  }}
                >
                  {product.rating} · {product.reviews} reviews
                </span>
              </div>

              {/* Price */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  fontSize: "1.6rem",
                  color: B.teal,
                  marginBottom: "20px",
                }}
              >
                {product.priceDisplay}
              </p>

              {/* Divider */}
              <div style={{ height: "1px", background: B.lightGray, marginBottom: "20px" }} />

              {/* Description */}
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: B.bodyText,
                  marginBottom: "8px",
                }}
              >
                About
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.85rem",
                  color: B.bodyText,
                  lineHeight: 1.7,
                  marginBottom: "20px",
                }}
              >
                {product.description}
              </p>

              {/* How to use */}
              <div
                style={{
                  background: `${product.bg}`,
                  borderRadius: "0.875rem",
                  padding: "1rem 1.1rem",
                  marginBottom: "24px",
                  border: `1px solid ${product.accent}20`,
                }}
              >
                <p
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: product.accent,
                    marginBottom: "6px",
                  }}
                >
                  How to Use
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    color: B.bodyText,
                    lineHeight: 1.65,
                  }}
                >
                  {product.howToUse}
                </p>
              </div>

              {/* Attributes */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "24px",
                }}
              >
                {product.hairType.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background: "rgba(42,157,143,0.08)",
                      border: "1px solid rgba(42,157,143,0.2)",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      color: B.seafoam,
                      textTransform: "capitalize",
                    }}
                  >
                    {t} hair
                  </span>
                ))}
                {product.condition.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.25)",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      color: "#9A7B0A",
                      textTransform: "capitalize",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Add to Cart — matches Hero "Shop Now" button: E2F33E, zero radius, bold uppercase */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                style={{
                  width: "100%",
                  padding: "1rem 2rem",
                  background: added ? `rgba(42,157,143,0.1)` : B.shopNow,
                  color: added ? B.seafoam : "#0D0D0D",
                  border: "none",
                  borderRadius: "0",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background 0.25s ease, color 0.25s ease",
                }}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={16} /> Add to Cart</>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Responsive modal style */}
          <style>{`
            @media (max-width: 640px) {
              .modal-grid { grid-template-columns: 1fr !important; overflow-y: auto; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function ShopClient({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>({
    category: "All",
    hairType: "All",
    porosity: "All",
    condition: "All",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const setFilter = useCallback(
    (key: keyof Filters) => (value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.category !== "All" && p.category !== filters.category) return false;
      if (
        filters.hairType !== "All" &&
        !p.hairType.includes(filters.hairType.toLowerCase()) &&
        !p.hairType.includes("all")
      )
        return false;
      if (
        filters.porosity !== "All" &&
        !p.porosity.includes(filters.porosity.toLowerCase())
      )
        return false;
      if (
        filters.condition !== "All" &&
        !p.condition.includes(filters.condition.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters, products]);

  const activeFilterCount = Object.values(filters).filter((v) => v !== "All").length;

  const resetFilters = () =>
    setFilters({ category: "All", hairType: "All", porosity: "All", condition: "All" });

  return (
    <>
      <Navbar isFixed />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <main style={{ background: B.cream, minHeight: "100vh", paddingTop: "80px" }}>
        {/* ── Page Header ─────────────────────────────────────── */}
        <section
          style={{
            background: B.teal,
            padding: "3.5rem 1.5rem 3rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient radial */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 75% 50%, rgba(42,157,143,0.25) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ maxWidth: "1360px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: E }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: B.seafoam,
                marginBottom: "10px",
              }}
            >
              Clinical Hair Science
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: E }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                color: B.cream,
                lineHeight: 1.15,
                marginBottom: "0.75rem",
              }}
            >
              Shop All
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: E }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.92rem",
                color: "rgba(244,247,245,0.65)",
                maxWidth: "440px",
                lineHeight: 1.65,
              }}
            >
              Every formulation is bio-matched to your scalp biology. Filter by your hair
              profile to surface your highest-compatibility products.
            </motion.p>

            {/* Result count */}
            <motion.p
              key={filtered.length}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: "1.25rem",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "rgba(244,247,245,0.45)",
                letterSpacing: "0.04em",
              }}
            >
              {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
            </motion.p>
          </div>
        </section>

        {/* ── Body: Sidebar + Grid ───────────────────────────── */}
        <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }} className="shop-layout">

            {/* ─ Sidebar (sticky) ─────────────────────── */}
            <aside
              style={{
                width: "240px",
                flexShrink: 0,
                position: "sticky",
                top: "96px",
                alignSelf: "flex-start",
              }}
              className="shop-sidebar"
            >
              {/* Sidebar header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <SlidersHorizontal size={14} color={B.teal} />
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: B.teal,
                    }}
                  >
                    Filters
                  </span>
                  {activeFilterCount > 0 && (
                    <span
                      style={{
                        background: B.seafoam,
                        color: "#fff",
                        borderRadius: "9999px",
                        padding: "1px 7px",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      color: B.seafoam,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <FilterSection title="Category" options={CATEGORIES} value={filters.category} onChange={setFilter("category")} />
              <FilterSection title="Hair Type" options={HAIR_TYPES} value={filters.hairType} onChange={setFilter("hairType")} />
              <FilterSection title="Porosity" options={POROSITIES} value={filters.porosity} onChange={setFilter("porosity")} />
              <FilterSection title="Condition" options={CONDITIONS} value={filters.condition} onChange={setFilter("condition")} />
            </aside>

            {/* ─ Product Grid ─────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Mobile filter toggle */}
              <div className="mobile-filter-btn" style={{ display: "none", marginBottom: "1rem" }}>
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "9999px",
                    border: `1.5px solid ${B.teal}`,
                    background: "transparent",
                    color: B.teal,
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span
                      style={{
                        background: B.seafoam,
                        color: "#fff",
                        borderRadius: "9999px",
                        padding: "1px 6px",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                      }}
                    >
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      textAlign: "center",
                      padding: "5rem 2rem",
                      background: "#fff",
                      borderRadius: "1.25rem",
                      border: `1px solid ${B.lightGray}`,
                    }}
                  >
                    <Leaf size={36} color={B.borderGray} style={{ marginBottom: "1rem" }} />
                    <p
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: B.teal,
                        marginBottom: "6px",
                      }}
                    >
                      No matches found
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.85rem",
                        color: B.midGray,
                        marginBottom: "1.25rem",
                      }}
                    >
                      Try adjusting your filters to see more products.
                    </p>
                    <button
                      onClick={resetFilters}
                      style={{
                        padding: "0.6rem 1.5rem",
                        borderRadius: "9999px",
                        border: `1.5px solid ${B.teal}`,
                        background: "transparent",
                        color: B.teal,
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grid"
                    layout
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1.25rem",
                    }}
                    className="product-shop-grid"
                  >
                    <AnimatePresence>
                      {filtered.map((p, i) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          index={i}
                          onSelect={setSelectedProduct}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* ── Mobile filter drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              key="mob-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(13,59,68,0.45)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              key="mob-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                bottom: 0,
                width: "300px",
                maxWidth: "85vw",
                zIndex: 201,
                background: "#FFFFFF",
                padding: "1.5rem",
                overflowY: "auto",
                boxShadow: "-8px 0 40px rgba(13,59,68,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: B.teal,
                  }}
                >
                  Filter Products
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: B.midGray,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <FilterSection title="Category" options={CATEGORIES} value={filters.category} onChange={setFilter("category")} />
              <FilterSection title="Hair Type" options={HAIR_TYPES} value={filters.hairType} onChange={setFilter("hairType")} />
              <FilterSection title="Porosity" options={POROSITIES} value={filters.porosity} onChange={setFilter("porosity")} />
              <FilterSection title="Condition" options={CONDITIONS} value={filters.condition} onChange={setFilter("condition")} />
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { resetFilters(); setMobileSidebarOpen(false); }}
                  style={{
                    marginTop: "0.5rem",
                    width: "100%",
                    padding: "0.7rem",
                    borderRadius: "9999px",
                    border: `1.5px solid ${B.borderGray}`,
                    background: "transparent",
                    color: B.bodyText,
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .shop-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
        @media (max-width: 1100px) {
          .product-shop-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .product-shop-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .shop-layout { flex-direction: column !important; }
        }
      `}</style>
    </>
  );
}
