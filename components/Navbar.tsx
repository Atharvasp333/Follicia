"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, ShoppingBag, User, Menu, X, Leaf } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
    onLoginClick: () => void;
    cartCount?: number;
}

const NAV_LINKS = [
    { label: "Shop", href: "#products" },
    { label: "Consultation", href: "#how-it-works" },
    { label: "Science", href: "#science" },
    { label: "About", href: "#about" },
];

export default function Navbar({ onLoginClick, cartCount = 0 }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const navBg = scrolled
        ? "rgba(13, 59, 68, 0.96)"
        : "rgba(244, 247, 245, 0.88)";
    const navBorder = scrolled
        ? "1px solid rgba(42,157,143,0.28)"
        : "1px solid rgba(42,157,143,0.16)";
    const navShadow = scrolled
        ? "0 8px 32px rgba(13,59,68,0.22)"
        : "0 4px 16px rgba(13,59,68,0.05)";
    const textColor = scrolled ? "rgba(244,247,245,0.85)" : "#1A5568";
    const logoColor = scrolled ? "#F4F7F5" : "#0D3B44";

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    padding: scrolled ? "0.5rem 1.5rem" : "0.85rem 1.5rem",
                    transition: "padding 0.3s ease",
                }}
            >
                <div
                    style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.6rem 1.5rem",
                        background: navBg,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: navBorder,
                        borderRadius: "9999px",
                        boxShadow: navShadow,
                        transition: "background 0.4s ease, box-shadow 0.4s ease, border 0.4s ease",
                    }}
                >
                    {/* Logo */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #0D3B44, #2A9D8F)",
                                flexShrink: 0,
                            }}
                        >
                            <Leaf size={15} color="#D4AF37" />
                        </div>
                        <span
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                color: logoColor,
                                transition: "color 0.4s ease",
                            }}
                        >
                            Follicia
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <nav style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                style={{
                                    fontFamily: "'Montserrat', sans-serif",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    color: textColor,
                                    textDecoration: "none",
                                    transition: "color 0.2s ease",
                                }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#2A9D8F")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = textColor)}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Search (desktop) */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.94 }}
                            style={{
                                width: "36px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "50%",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: textColor,
                            }}
                            className="search-btn"
                            aria-label="Search"
                        >
                            <Search size={17} />
                        </motion.button>

                        {/* Cart */}
                        <Link href="/cart" style={{ position: "relative" }}>
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.94 }}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    color: textColor,
                                }}
                                aria-label="Cart"
                            >
                                <ShoppingBag size={17} />
                            </motion.button>
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={{
                                        position: "absolute",
                                        top: "-2px",
                                        right: "-2px",
                                        width: "17px",
                                        height: "17px",
                                        borderRadius: "50%",
                                        background: "#D4AF37",
                                        color: "#0D3B44",
                                        fontSize: "0.6rem",
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontFamily: "'Montserrat', sans-serif",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {cartCount > 9 ? "9+" : cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* Login (desktop) */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onLoginClick}
                            id="nav-login-btn"
                            className="login-btn-desktop"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "0.45rem 1.1rem",
                                borderRadius: "9999px",
                                border: `1.5px solid ${scrolled ? "rgba(212,175,55,0.45)" : "#0D3B44"}`,
                                background: scrolled ? "rgba(212,175,55,0.12)" : "transparent",
                                color: scrolled ? "#D4AF37" : "#0D3B44",
                                fontFamily: "'Montserrat', sans-serif",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <User size={13} />
                            Login
                        </motion.button>

                        {/* Take Quiz CTA */}
                        <motion.button
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-teal"
                            style={{
                                background: scrolled ? "#2A9D8F" : "#0D3B44",
                                fontSize: "0.85rem",
                                padding: "0.5rem 1.25rem",
                            }}
                        >
                            <Sparkles size={13} />
                            Take Quiz
                        </motion.button>

                        {/* Mobile menu btn */}
                        <motion.button
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="mobile-menu-btn"
                            style={{
                                width: "36px",
                                height: "36px",
                                display: "none",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                color: scrolled ? "#F4F7F5" : "#0D3B44",
                            }}
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.97 }}
                            transition={{ duration: 0.22 }}
                            style={{
                                maxWidth: "1280px",
                                margin: "0.5rem auto 0",
                                borderRadius: "1.25rem",
                                padding: "1.25rem",
                                background: "rgba(13,59,68,0.97)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(42,157,143,0.25)",
                            }}
                        >
                            {NAV_LINKS.map((link, i) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setMobileOpen(false)}
                                    style={{
                                        display: "block",
                                        padding: "0.75rem 1rem",
                                        borderRadius: "0.75rem",
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontSize: "0.9rem",
                                        fontWeight: 500,
                                        color: "rgba(244,247,245,0.85)",
                                        textDecoration: "none",
                                        transition: "background 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(42,157,143,0.1)")}
                                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                            <div
                                style={{
                                    marginTop: "1rem",
                                    paddingTop: "1rem",
                                    borderTop: "1px solid rgba(255,255,255,0.1)",
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                <button
                                    onClick={() => { setMobileOpen(false); onLoginClick(); }}
                                    style={{
                                        flex: 1,
                                        padding: "0.65rem",
                                        borderRadius: "9999px",
                                        border: "1.5px solid rgba(212,175,55,0.5)",
                                        background: "transparent",
                                        color: "#D4AF37",
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    className="btn-teal"
                                    style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem" }}
                                >
                                    <Sparkles size={13} />
                                    Take Quiz
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Responsive nav styles */}
            <style>{`
        @media (max-width: 1023px) {
          .desktop-nav { display: none !important; }
          .search-btn { display: none !important; }
          .login-btn-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </>
    );
}
