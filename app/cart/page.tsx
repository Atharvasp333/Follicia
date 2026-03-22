"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Package,
  RefreshCw,
  Truck,
  Shield,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/contexts/CartContext";
import { useAuthModal } from "@/contexts/AuthModalContext";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ── Cart item row ──────────────────────────────────────── */
function CartItemRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: any;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const categoryColors: Record<string, string> = {
    "Scalp Care": "#2A9D8F",
    "Treatments": "#D4AF37",
    "Conditioning": "#4DBCB0",
    "Cleansing": "#0D3B44",
  };

  const color = categoryColors[item.category || "Treatments"] || "#2A9D8F";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -32, scale: 0.95 }}
      transition={{ duration: 0.35, ease: E }}
      className="flex gap-4 p-5 rounded-2xl"
      style={{ background: "#FFFFFF", border: "1px solid #E8EDEB" }}
    >
      {/* Thumbnail */}
      <div
        className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ 
          background: item.imageUrl ? "#FFFFFF" : `${color}12`, 
          border: `1px solid ${color}20` 
        }}
      >
        {item.imageUrl ? (
          <ProductImage
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Leaf size={28} color={color} />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3
              className="text-base font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
            >
              {item.name}
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {item.category || "Premium Formula"}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ color: "#9AABA5" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#ef4444";
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#9AABA5";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Qty + price */}
        <div className="flex items-center justify-between mt-3">
          <div
            className="flex items-center gap-2 rounded-full px-1"
            style={{ background: "#F4F7F5", border: "1px solid #E8EDEB" }}
          >
            <button
              onClick={() => onQtyChange(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                color: item.quantity <= 1 ? "#D5E0DC" : "#0D3B44",
                cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
              }}
            >
              <Minus size={13} />
            </button>
            <span
              className="w-5 text-center text-sm font-bold"
              style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => onQtyChange(item.productId, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ color: "#0D3B44" }}
            >
              <Plus size={13} />
            </button>
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
          >
            {item.priceDisplay || `₹${(item.price * item.quantity).toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Cart Page ──────────────────────────────────────────── */
export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount } = useCart();
  const { currentUser, dbUser, openModal } = useAuthModal();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const handleQtyChange = (productId: string, qty: number) => {
    updateQuantity(productId, qty);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const shipping = subtotal >= 2999 ? 0 : 199;
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - discount;
  const freeShippingThreshold = 2999;
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  const handleCheckout = () => {
    if (!currentUser || !dbUser) {
      // User not authenticated - open auth modal
      openModal();
    } else {
      // User authenticated - proceed to checkout
      router.push("/checkout");
    }
  };

  return (
    <main style={{ background: "#F4F7F5", minHeight: "100vh" }}>
      <Navbar isFixed />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: E }}
          className="flex items-center justify-between mb-8 flex-wrap gap-3"
        >
          <div>
            <Link
              href="/shop"
              className="flex items-center gap-1.5 text-sm mb-3 transition-colors duration-200"
              style={{ color: "#9AABA5", fontFamily: "var(--font-montserrat), sans-serif" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#0D3B44")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9AABA5")}
            >
              <ChevronLeft size={15} /> Continue Shopping
            </Link>
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
            >
              Your Ritual Cart
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} · Clinically matched to your profile
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} color="#0D3B44" />
            <span
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
            >
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.div>

        {/* Free shipping progress bar */}
        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: E }}
            className="mb-8 rounded-2xl p-4"
            style={{ background: "#FFFFFF", border: "1px solid #E8EDEB" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck size={15} color={shipping === 0 ? "#2A9D8F" : "#D4AF37"} />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  {shipping === 0
                    ? "🎉 Free shipping unlocked!"
                    : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString("en-IN")} more for free shipping`}
                </span>
              </div>
              <span className="badge-gold">Free shipping ≥ ₹2,999</span>
            </div>
            <div className="progress-track" style={{ height: "6px" }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                transition={{ duration: 1.0, ease: E }}
                style={{
                  background:
                    shipping === 0
                      ? "linear-gradient(90deg, #2A9D8F, #4DBCB0)"
                      : "linear-gradient(90deg, #D4AF37, #E8CC6A)",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left — cart items */}
          <div>
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
                  style={{ background: "#FFFFFF", border: "1px solid #E8EDEB" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "rgba(42,157,143,0.1)" }}
                  >
                    <ShoppingBag size={28} color="#2A9D8F" />
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
                  >
                    Your ritual is empty
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}>
                    Start your hair journey with clinically-matched products.
                  </p>
                  <Link href="/shop">
                    <button
                      className="btn-teal"
                      style={{
                        background: "#0D3B44",
                        color: "#FAFCFB",
                        borderRadius: "9999px",
                        padding: "0.75rem 2rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-montserrat), sans-serif",
                      }}
                    >
                      <Sparkles size={16} />
                      Shop the Collection
                    </button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItemRow
                      key={item.productId}
                      item={item}
                      onQtyChange={handleQtyChange}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          {cartItems.length > 0 && (
            <div className="space-y-5">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: E }}
                className="rounded-2xl p-6"
                style={{ background: "#FFFFFF", border: "1px solid #E8EDEB" }}
              >
                <h3
                  className="text-xs font-bold tracking-widest uppercase mb-5"
                  style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
                >
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      Shipping
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: shipping === 0 ? "#2A9D8F" : "#0D3B44",
                        fontFamily: "var(--font-montserrat), sans-serif",
                      }}
                    >
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between">
                      <span
                        className="text-sm"
                        style={{ color: "#2A9D8F", fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        Discount (FOLLICIA10)
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#2A9D8F", fontFamily: "var(--font-montserrat), sans-serif" }}
                      >
                        -₹{discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon */}
                <div className="mb-5">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (coupon.toUpperCase() === "FOLLICIA10") {
                        setCouponApplied(true);
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      disabled={couponApplied}
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        border: "1.5px solid #D5E0DC",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: "#0D3B44",
                        background: couponApplied ? "#F4F7F5" : "#FAFCFB",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#2A9D8F";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#D5E0DC";
                      }}
                    />
                    <button
                      type="submit"
                      disabled={couponApplied}
                      className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200"
                      style={{
                        background: couponApplied ? "rgba(42,157,143,0.1)" : "#0D3B44",
                        color: couponApplied ? "#2A9D8F" : "#F4F7F5",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        border: "none",
                        cursor: couponApplied ? "not-allowed" : "pointer",
                      }}
                    >
                      {couponApplied ? "✓ Applied" : "Apply"}
                    </button>
                  </form>
                  {!couponApplied && (
                    <p className="text-xs mt-1.5" style={{ color: "#9AABA5" }}>
                      Try:{" "}
                      <button
                        onClick={() => setCoupon("FOLLICIA10")}
                        className="underline"
                        style={{ color: "#2A9D8F", background: "none", border: "none", cursor: "pointer" }}
                      >
                        FOLLICIA10
                      </button>
                    </p>
                  )}
                </div>

                {/* Total */}
                <div
                  className="flex justify-between items-center py-4 border-t border-b mb-5"
                  style={{ borderColor: "#E8EDEB" }}
                >
                  <span
                    className="text-base font-bold"
                    style={{ color: "#0D3B44", fontFamily: "var(--font-playfair), serif" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
                  >
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Auth hint */}
                {!currentUser && (
                  <p
                    className="text-xs text-center mb-4 px-2"
                    style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif", lineHeight: 1.5 }}
                  >
                    Please sign in to complete your ritual
                  </p>
                )}

                {/* Checkout CTA */}
                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #E8CC6A)",
                    color: "#0D3B44",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    letterSpacing: "0.03em",
                    boxShadow: "0 8px 24px rgba(212,175,55,0.4)",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <Shield size={16} />
                  {currentUser ? "Proceed to Checkout" : "Sign In to Checkout"}
                  <ArrowRight size={16} />
                </motion.button>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
                  {[
                    { icon: <Shield size={12} />, label: "SSL Secured" },
                    { icon: <Package size={12} />, label: "Eco Packaging" },
                    { icon: <RefreshCw size={12} />, label: "Easy Returns" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                      {b.icon}
                      {b.label}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Clinical assurance */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: E }}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(13,59,68,0.04)",
                  border: "1px solid rgba(13,59,68,0.1)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} color="#0D3B44" />
                  <p
                    className="text-xs font-bold"
                    style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
                  >
                    Your AI Match Guarantee
                  </p>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#4A6B63", fontFamily: "var(--font-inter), sans-serif" }}
                >
                  Every product in your cart is clinically matched to your scalp profile. If you don&apos;t see
                  improvement in 30 days, we&apos;ll reformulate your regimen — free of charge.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
