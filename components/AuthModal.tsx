"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [showPass, setShowPass] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSuccess(true); }, 1400);
    };

    const handleClose = () => {
        setSuccess(false);
        setLoading(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="modal-overlay"
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                    id="auth-modal-overlay"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 24 }}
                        transition={{ duration: 0.38, ease: E }}
                        style={{
                            width: "100%",
                            maxWidth: "440px",
                            borderRadius: "1.75rem",
                            overflow: "hidden",
                            background: "#FFFFFF",
                            boxShadow: "0 32px 96px rgba(13,59,68,0.28)",
                            border: "1px solid rgba(42,157,143,0.2)",
                        }}
                        id="auth-modal"
                    >
                        {/* Header */}
                        <div
                            style={{
                                padding: "2rem 2rem 1.5rem",
                                background: "linear-gradient(145deg, #0D3B44 0%, #1A5568 100%)",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Decorative orbs */}
                            <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(212,175,55,0.15)" }} />
                            <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(42,157,143,0.12)" }} />

                            <div style={{ position: "relative", zIndex: 1 }}>
                                {/* Logo mark */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}>
                                        <Leaf size={16} color="#D4AF37" />
                                    </div>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: "#F4F7F5" }}>
                                        Follicia
                                    </span>
                                </div>

                                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#2A9D8F", marginBottom: "6px" }}>
                                    {tab === "login" ? "Welcome Back" : "Start Your Journey"}
                                </p>
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.45rem", color: "#F4F7F5", marginBottom: 0 }}>
                                    {tab === "login" ? "Sign in to your regimen" : "Create your profile"}
                                </h2>
                            </div>

                            {/* Close */}
                            <button
                                onClick={handleClose}
                                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 10, width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.1)", cursor: "pointer", color: "rgba(244,247,245,0.8)" }}
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "1.75rem 2rem" }}>
                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ textAlign: "center", padding: "1rem 0" }}
                                >
                                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(42,157,143,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                                        <CheckCircle size={28} color="#2A9D8F" />
                                    </div>
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.2rem", color: "#0D3B44", marginBottom: "8px" }}>
                                        {tab === "login" ? "Welcome back!" : "Profile created!"}
                                    </h3>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#9AABA5" }}>
                                        {tab === "login" ? "Loading your personalised regimen…" : "Taking you to your free AI assessment…"}
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Tabs */}
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            background: "#F4F7F5",
                                            borderRadius: "9999px",
                                            padding: "4px",
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        {(["login", "signup"] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTab(t)}
                                                style={{
                                                    padding: "0.5rem",
                                                    borderRadius: "9999px",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    fontSize: "0.825rem",
                                                    fontWeight: 600,
                                                    transition: "all 0.25s ease",
                                                    background: tab === t ? "#0D3B44" : "transparent",
                                                    color: tab === t ? "#F4F7F5" : "#9AABA5",
                                                }}
                                            >
                                                {t === "login" ? "Login" : "Sign Up"}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                        {tab === "signup" && (
                                            <div>
                                                <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0D3B44", marginBottom: "6px" }}>
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Your name"
                                                    required
                                                    style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.85rem", border: "1.5px solid #D5E0DC", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#0D3B44", outline: "none", background: "#FAFCFB", boxSizing: "border-box" }}
                                                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2A9D8F")}
                                                    onBlur={(e) => (e.currentTarget.style.borderColor = "#D5E0DC")}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0D3B44", marginBottom: "6px" }}>
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                required
                                                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "0.85rem", border: "1.5px solid #D5E0DC", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#0D3B44", outline: "none", background: "#FAFCFB", boxSizing: "border-box" }}
                                                onFocus={(e) => (e.currentTarget.style.borderColor = "#2A9D8F")}
                                                onBlur={(e) => (e.currentTarget.style.borderColor = "#D5E0DC")}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontFamily: "'Montserrat', sans-serif", fontSize: "0.78rem", fontWeight: 600, color: "#0D3B44", marginBottom: "6px" }}>
                                                Password
                                            </label>
                                            <div style={{ position: "relative" }}>
                                                <input
                                                    type={showPass ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    required
                                                    style={{ width: "100%", padding: "0.75rem 2.75rem 0.75rem 1rem", borderRadius: "0.85rem", border: "1.5px solid #D5E0DC", fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#0D3B44", outline: "none", background: "#FAFCFB", boxSizing: "border-box" }}
                                                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2A9D8F")}
                                                    onBlur={(e) => (e.currentTarget.style.borderColor = "#D5E0DC")}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPass(!showPass)}
                                                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", color: "#9AABA5" }}
                                                >
                                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {tab === "login" && (
                                            <div style={{ textAlign: "right" }}>
                                                <button type="button" style={{ background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#2A9D8F", cursor: "pointer", textDecoration: "underline" }}>
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}

                                        <motion.button
                                            whileHover={{ y: -1 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={loading}
                                            id="auth-submit-btn"
                                            style={{
                                                width: "100%",
                                                padding: "0.85rem",
                                                borderRadius: "9999px",
                                                border: "none",
                                                background: loading ? "#9AABA5" : "#0D3B44",
                                                color: "#F4F7F5",
                                                fontFamily: "'Montserrat', sans-serif",
                                                fontWeight: 700,
                                                fontSize: "0.9rem",
                                                cursor: loading ? "wait" : "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "8px",
                                                transition: "background 0.25s ease",
                                                boxShadow: "0 4px 16px rgba(13,59,68,0.28)",
                                            }}
                                        >
                                            {loading ? (
                                                <span className="animate-pulse-soft">Processing…</span>
                                            ) : (
                                                <>
                                                    {tab === "login" ? "Sign In" : "Create Account"}
                                                    <ArrowRight size={15} />
                                                </>
                                            )}
                                        </motion.button>
                                    </form>

                                    {/* Divider */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "1.25rem 0" }}>
                                        <div style={{ flex: 1, height: "1px", background: "#E8EDEB" }} />
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#9AABA5" }}>or</span>
                                        <div style={{ flex: 1, height: "1px", background: "#E8EDEB" }} />
                                    </div>

                                    {/* Switch tab nudge */}
                                    <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#9AABA5" }}>
                                        {tab === "login" ? (
                                            <>New to Follicia?{" "}
                                                <button onClick={() => setTab("signup")} style={{ background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                    Start your assessment <Sparkles size={12} />
                                                </button>
                                            </>
                                        ) : (
                                            <>Already have an account?{" "}
                                                <button onClick={() => setTab("login")} style={{ background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", cursor: "pointer" }}>
                                                    Sign in →
                                                </button>
                                            </>
                                        )}
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
