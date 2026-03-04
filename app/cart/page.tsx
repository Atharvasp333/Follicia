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
    Clock,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";

/* ── Types & data ───────────────────────────────────────── */
interface CartItem {
    id: string;
    name: string;
    subtitle: string;
    price: number;
    qty: number;
    match: number;
    color: string;
}

const INITIAL_CART: CartItem[] = [
    {
        id: "c1",
        name: "BioBalance Scalp Serum",
        subtitle: "Oily Scalp Formula · 30ml",
        price: 2490,
        qty: 1,
        match: 94,
        color: "#2A9D8F",
    },
    {
        id: "c2",
        name: "RootRevive Treatment",
        subtitle: "Thinning Hair Formula · 50ml",
        price: 3290,
        qty: 1,
        match: 88,
        color: "#0D3B44",
    },
    {
        id: "c3",
        name: "HydraLux Conditioning Mask",
        subtitle: "Dry & Brittle Hair · 200ml",
        price: 1890,
        qty: 2,
        match: 91,
        color: "#2A9D8F",
    },
];

const REFILL_SUGGESTIONS = [
    {
        id: "r1",
        name: "DermaClear Scalp Tonic",
        subtitle: "Complements your serum",
        price: 1690,
        refillIn: "~14 days",
        color: "#1A5568",
    },
    {
        id: "r2",
        name: "ProGrowth Peptide Ampoule",
        subtitle: "96% match for your profile",
        price: 4190,
        refillIn: "New addition",
        color: "#D4AF37",
    },
];

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ── Cart item row ──────────────────────────────────────── */
function CartItemRow({
    item,
    onQtyChange,
    onRemove,
}: {
    item: CartItem;
    onQtyChange: (id: string, qty: number) => void;
    onRemove: (id: string) => void;
}) {
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
                className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}
            >
                <Leaf size={28} color={item.color} />
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
                            {item.subtitle}
                        </p>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
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

                {/* Match badge */}
                <div className="flex items-center gap-3 mt-2">
                    <span className="badge-seafoam">{item.match}% Match</span>
                    <span
                        className="text-xs"
                        style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
                    >
                        AI Verified for your scalp profile
                    </span>
                </div>

                {/* Qty + price */}
                <div className="flex items-center justify-between mt-3">
                    <div
                        className="flex items-center gap-2 rounded-full px-1"
                        style={{ background: "#F4F7F5", border: "1px solid #E8EDEB" }}
                    >
                        <button
                            onClick={() => onQtyChange(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200"
                            style={{
                                color: item.qty <= 1 ? "#D5E0DC" : "#0D3B44",
                                cursor: item.qty <= 1 ? "not-allowed" : "pointer",
                            }}
                        >
                            <Minus size={13} />
                        </button>
                        <span
                            className="w-5 text-center text-sm font-bold"
                            style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
                        >
                            {item.qty}
                        </span>
                        <button
                            onClick={() => onQtyChange(item.id, item.qty + 1)}
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
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Refill suggestion card ─────────────────────────────── */
function RefillCard({
    item,
    onAdd,
}: {
    item: (typeof REFILL_SUGGESTIONS)[0];
    onAdd: () => void;
}) {
    return (
        <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "#F4F7F5", border: "1px solid #E8EDEB" }}
        >
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}12` }}
            >
                <Leaf size={20} color={item.color} />
            </div>
            <div className="flex-1 min-w-0">
                <p
                    className="text-sm font-bold leading-tight truncate"
                    style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
                >
                    {item.name}
                </p>
                <p className="text-xs" style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}>
                    {item.subtitle}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    <Clock size={10} color="#2A9D8F" />
                    <span className="text-xs font-medium" style={{ color: "#2A9D8F", fontFamily: "var(--font-montserrat), sans-serif" }}>
                        {item.refillIn}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <span
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-playfair), serif", color: "#0D3B44" }}
                >
                    ₹{item.price.toLocaleString("en-IN")}
                </span>
                <button
                    onClick={onAdd}
                    className="btn-teal text-xs py-1.5 px-3"
                    style={{ fontSize: "0.7rem" }}
                >
                    <Plus size={11} /> Add
                </button>
            </div>
        </div>
    );
}

/* ── Cart Page ──────────────────────────────────────────── */
export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
    const [modalOpen, setModalOpen] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);
    const [checkoutClicked, setCheckoutClicked] = useState(false);

    const handleQtyChange = (id: string, qty: number) => {
        if (qty < 1) return;
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    };

    const handleRemove = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleAddRefill = (item: (typeof REFILL_SUGGESTIONS)[0]) => {
        setItems((prev) => {
            if (prev.find((i) => i.id === item.id)) return prev;
            return [
                ...prev,
                {
                    id: item.id,
                    name: item.name,
                    subtitle: item.subtitle,
                    price: item.price,
                    qty: 1,
                    match: 85,
                    color: item.color,
                },
            ];
        });
    };

    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const shipping = subtotal >= 2999 ? 0 : 199;
    const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + shipping - discount;
    const freeShippingThreshold = 2999;
    const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    return (
        <main style={{ background: "#F4F7F5", minHeight: "100vh" }}>
            <Navbar onLoginClick={() => setModalOpen(true)} cartCount={items.length} />
            <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

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
                            href="/"
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
                            Your Routine Cart
                        </h1>
                        <p
                            className="text-sm mt-1"
                            style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
                        >
                            {items.length} {items.length === 1 ? "item" : "items"} · All AI-matched to your scalp profile
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

                {/* Main grid */}
                <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                    {/* Left — cart items */}
                    <div>
                        <AnimatePresence>
                            {items.length === 0 ? (
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
                                        Your cart is empty
                                    </h3>
                                    <p className="text-sm mb-6" style={{ color: "#9AABA5" }}>
                                        Take your scalp quiz to discover your personalised regimen.
                                    </p>
                                    <Link href="/">
                                        <button className="btn-teal">
                                            <Sparkles size={16} />
                                            Discover Products
                                        </button>
                                    </Link>
                                </motion.div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <CartItemRow
                                            key={item.id}
                                            item={item}
                                            onQtyChange={handleQtyChange}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Refill suggestion sidebar (below on mobile) */}
                        {REFILL_SUGGESTIONS.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, ease: E }}
                                className="lg:hidden mt-6 rounded-2xl p-6"
                                style={{ background: "#FFFFFF", border: "1px solid #E8EDEB" }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <RefreshCw size={15} color="#2A9D8F" />
                                    <h3
                                        className="text-sm font-bold"
                                        style={{ color: "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
                                    >
                                        Refill Reminders
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {REFILL_SUGGESTIONS.map((r) => (
                                        <RefillCard key={r.id} item={r} onAdd={() => handleAddRefill(r)} />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-5">
                        {/* Refill Reminders (desktop) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: E }}
                            className="hidden lg:block rounded-2xl p-6"
                            style={{ background: "#FFFFFF", border: "1px solid #E8EDEB" }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <RefreshCw size={14} color="#2A9D8F" />
                                <h3
                                    className="text-xs font-bold tracking-widest uppercase"
                                    style={{ color: "#2A9D8F", fontFamily: "var(--font-montserrat), sans-serif" }}
                                >
                                    Refill Reminders
                                </h3>
                            </div>
                            <p
                                className="text-xs mb-4"
                                style={{ color: "#9AABA5", fontFamily: "var(--font-inter), sans-serif" }}
                            >
                                Based on your regimen cadence — stay consistent.
                            </p>
                            <div className="space-y-3">
                                {REFILL_SUGGESTIONS.map((r) => (
                                    <RefillCard key={r.id} item={r} onAdd={() => handleAddRefill(r)} />
                                ))}
                            </div>
                        </motion.div>

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
                                        Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)
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
                                        style={{ color: shipping === 0 ? "#2A9D8F" : "#0D3B44", fontFamily: "var(--font-montserrat), sans-serif" }}
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
                                        }}
                                    >
                                        {couponApplied ? "✓ Applied" : "Apply"}
                                    </button>
                                </form>
                                {!couponApplied && (
                                    <p className="text-xs mt-1.5" style={{ color: "#9AABA5" }}>
                                        Try: <button onClick={() => setCoupon("FOLLICIA10")} className="underline" style={{ color: "#2A9D8F" }}>FOLLICIA10</button>
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

                            {/* Checkout CTA */}
                            <motion.button
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={items.length === 0 || checkoutClicked}
                                onClick={() => setCheckoutClicked(true)}
                                className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300"
                                style={{
                                    background:
                                        items.length === 0
                                            ? "#D5E0DC"
                                            : checkoutClicked
                                                ? "rgba(42,157,143,0.15)"
                                                : "linear-gradient(135deg, #D4AF37, #E8CC6A)",
                                    color:
                                        items.length === 0
                                            ? "#9AABA5"
                                            : checkoutClicked
                                                ? "#2A9D8F"
                                                : "#0D3B44",
                                    fontFamily: "var(--font-montserrat), sans-serif",
                                    letterSpacing: "0.03em",
                                    boxShadow:
                                        items.length > 0 && !checkoutClicked
                                            ? "0 8px 24px rgba(212,175,55,0.4)"
                                            : "none",
                                    cursor: items.length === 0 ? "not-allowed" : "pointer",
                                }}
                                id="proceed-to-checkout-btn"
                            >
                                {checkoutClicked ? (
                                    <>
                                        <Shield size={16} />
                                        Redirecting to Checkout…
                                    </>
                                ) : (
                                    <>
                                        <Shield size={16} />
                                        Proceed to Checkout
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </motion.button>

                            {/* Trust badges */}
                            <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
                                {[
                                    { icon: <Shield size={12} />, label: "SSL Secured" },
                                    { icon: <Package size={12} />, label: "FPO Packaging" },
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
                                Every product in your cart is clinically matched to your scalp
                                profile. If you don&apos;t see improvement in 30 days, we&apos;ll
                                reformulate your regimen — free of charge.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
