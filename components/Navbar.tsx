"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Leaf,
  Home,
  FlaskConical,
  ShoppingCart,
  BookOpen,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import { useAuthModal } from "@/contexts/AuthModalContext";
import { useCart } from "@/contexts/CartContext";

const NAV_LINKS = [
  { label: "Shop", href: "/shop", icon: <ShoppingCart size={16} /> },
  { label: "Consultation", href: "#how-it-works", icon: <FlaskConical size={16} /> },
  { label: "Science", href: "#science", icon: <BookOpen size={16} /> },
  { label: "About", href: "#about", icon: <Info size={16} /> },
];

const SIDEBAR_LINKS = [
  { label: "Home", href: "/", icon: <Home size={18} /> },
  { label: "Shop All", href: "/shop", icon: <ShoppingCart size={18} /> },
  { label: "Consultation", href: "#how-it-works", icon: <FlaskConical size={18} /> },
  { label: "Science", href: "#science", icon: <FlaskConical size={18} /> },
  { label: "My Routine", href: "/dashboard", icon: <BookOpen size={18} /> },
  { label: "About Us", href: "#about", icon: <Info size={18} /> },
];

/* ── Sidebar drawer ──────────────────────────────────────────────────── */
function Sidebar({
  open,
  onClose,
  onLoginClick,
  dbUser,
  currentUser,
}: {
  open: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  dbUser: any;
  currentUser: any;
}) {
  const { cartCount } = useCart();
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 998,
              background: "rgba(13,59,68,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.aside
            key="sidebar-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "300px",
              maxWidth: "85vw",
              zIndex: 999,
              background: "#0D3B44",
              borderRight: "1px solid rgba(42,157,143,0.2)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxShadow: "8px 0 40px rgba(13,59,68,0.35)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Link
                href="/"
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#0D3B44,#2A9D8F)",
                    border: "1.5px solid rgba(212,175,55,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Leaf size={15} color="#D4AF37" />
                </div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "#F4F7F5",
                  }}
                >
                  Follicia
                </span>
              </Link>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                aria-label="Close sidebar"
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(244,247,245,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Nav links */}
            <nav style={{ padding: "1rem 0", flex: 1 }}>
              {SIDEBAR_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.85rem 1.5rem",
                    color: "rgba(244,247,245,0.75)",
                    textDecoration: "none",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.92rem",
                    borderRadius: 0,
                    transition: "background 0.18s ease, color 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "rgba(42,157,143,0.1)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#F4F7F5";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "rgba(244,247,245,0.75)";
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ opacity: 0.7 }}>{link.icon}</span>
                    {link.label}
                  </span>
                  <ChevronRight size={14} style={{ opacity: 0.35 }} />
                </motion.a>
              ))}
            </nav>

            {/* Bottom actions */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* Cart */}
              <Link href="/cart" onClick={onClose}>
                <button
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    borderRadius: "9999px",
                    border: "1.5px solid rgba(42,157,143,0.4)",
                    background: "transparent",
                    color: "#2A9D8F",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <ShoppingBag size={15} />
                  Cart{" "}
                  {cartCount > 0 && (
                    <span
                      style={{
                        background: "#D4AF37",
                        color: "#0D3B44",
                        borderRadius: "9999px",
                        padding: "0 6px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Login / Dashboard */}
              {dbUser || currentUser ? (
                <Link href="/dashboard" onClick={onClose} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "0.7rem",
                      borderRadius: "9999px",
                      border: "1.5px solid rgba(212,175,55,0.5)",
                      background: "rgba(212,175,55,0.08)",
                      color: "#D4AF37",
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <User size={15} />
                    {dbUser?.name || "Dashboard"}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onLoginClick();
                  }}
                  style={{
                    width: "100%",
                    padding: "0.7rem",
                    borderRadius: "9999px",
                    border: "1.5px solid rgba(212,175,55,0.5)",
                    background: "rgba(212,175,55,0.08)",
                    color: "#D4AF37",
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <User size={15} />
                  Login / Sign Up
                </button>
              )}

              {/* Take quiz */}
              <Link href="/quiz" onClick={onClose} style={{ textDecoration: 'none' }}>
                <button
                  className="btn-teal"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: "0.88rem",
                    background: "#2A9D8F",
                  }}
                >
                  <Sparkles size={14} />
                  Take the Hair Quiz
                </button>
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Main Navbar ─────────────────────────────────────────────────────── */

interface NavbarProps {
  isFixed?: boolean;
}

export default function Navbar({
  isFixed = false,
}: NavbarProps) {
  const { openModal, dbUser, currentUser, isLoading } = useAuthModal();
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // In the minimalist design, we keep the background largely transparent
  const navBg = "transparent";
  const navBorder = "none";
  const navShadow = "none";

  // Deep Black / charcoal color for high contrast
  const iconColor = "#1A1A1A";

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLoginClick={openModal}
        dbUser={dbUser}
        currentUser={currentUser}
      />

      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: isFixed ? "fixed" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "1rem 1.5rem",
          pointerEvents: "none",
          ...(isFixed && {
            background: scrolled ? "rgba(244,247,245,0.92)" : "transparent",
            backdropFilter: scrolled ? "blur(12px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(213,224,220,0.5)" : "none",
            transition: "background 0.3s ease, backdrop-filter 0.3s ease",
          }),
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: navBg,
            border: navBorder,
            boxShadow: navShadow,
          }}
        >
          {/* ─── Left: Sidebar toggle ONLY ──────────────────── */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", pointerEvents: "auto" }}>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation sidebar"
              id="sidebar-toggle-btn"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                color: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
                transition: "opacity 0.25s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              <Menu size={24} />
            </motion.button>
          </div>

          {/* ─── Center: Text Logo ───────────────────────────── */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center", pointerEvents: "auto" }}>
            <Link
              href="/"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "1.45rem",
                color: iconColor,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "opacity 0.25s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              FOLLICIA
            </Link>
          </div>

          {/* ─── Right: Trio Icons ONLY ────────────────────────── */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", pointerEvents: "auto" }}>
            {/* Search */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              aria-label="Search"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                color: iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "opacity 0.25s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
            >
              <Search size={22} />
            </motion.button>

            {/* Profile */}
            {dbUser || currentUser ? (
              <div style={{ position: 'relative' }}>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  aria-label="Profile Menu"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#0D3B44", // Dark Teal
                    border: "none",
                    color: "#F4F7F5", // Off-white
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    transition: "opacity 0.25s ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                >
                  {dbUser?.name ? dbUser.name.charAt(0).toUpperCase() : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "U")}
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: '50px',
                        right: 0,
                        width: '180px',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB',
                        padding: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        zIndex: 100
                      }}
                    >
                      <Link href="/dashboard" onClick={() => setProfileDropdownOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: '#1A1A1A',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => ((e.currentTarget).style.background = '#F3F4F6')}
                        onMouseLeave={(e) => ((e.currentTarget).style.background = 'transparent')}
                        >
                          <User size={16} color="#6B7280" />
                          <span>Dashboard</span>
                        </div>
                      </Link>

                      <div style={{ height: '1px', background: '#E5E7EB', margin: '0.25rem 0' }} />

                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          try {
                            await signOut(auth);
                            console.log('User signed out.');
                          } catch (error) {
                            console.error('Error signing out: ', error);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          color: '#EF4444',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => ((e.currentTarget).style.background = '#FEF2F2')}
                        onMouseLeave={(e) => ((e.currentTarget).style.background = 'transparent')}
                      >
                        <LogOut size={16} color="#EF4444" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={openModal}
                aria-label="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "opacity 0.25s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                <User size={22} />
              </motion.button>
            )}

            {/* Cart */}
            <Link href="/cart" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.button
                whileTap={{ scale: 0.94 }}
                aria-label="Cart"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  color: iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "opacity 0.25s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                <ShoppingBag size={22} />
              </motion.button>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "-2px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#D4AF37",
                    color: "#1A1A1A",
                    fontSize: "0.65rem",
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
          </div>
        </div>
      </motion.header>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 1023px) {
          .desktop-nav   { display: none !important; }
          .search-btn    { display: none !important; }
          .login-btn-desktop { display: none !important; }
          .take-quiz-btn { display: none !important; }
          .profile-btn   { display: none !important; }
        }
      `}</style>
    </>
  );
}
