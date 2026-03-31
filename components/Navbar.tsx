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
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import { useAuthModal } from "@/contexts/AuthModalContext";
import { useCart } from "@/contexts/CartContext";

const SIDEBAR_LINKS = [
  { label: "HOME", href: "/", icon: Home },
  { label: "SHOP ALL", href: "/shop", icon: ShoppingCart },
  { label: "SCIENCE", href: "#science", icon: FlaskConical },
  { label: "MEMBERSHIP", href: "#pricing", icon: Sparkles },
];

/* ── Sidebar drawer with "Scientific Atelier" aesthetic ──────────────── */
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
  const [activeLink, setActiveLink] = useState("/");

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Set active link based on current path
      if (typeof window !== "undefined") {
        setActiveLink(window.location.pathname);
      }
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
          {/* Backdrop with blur */}
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 998,
              background: "rgba(13,59,68,0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          />

          {/* Drawer with clip-path animation */}
          <motion.aside
            key="sidebar-drawer"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0 0 0)" }}
            exit={{ clipPath: "inset(0 100% 0 0)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "320px",
              maxWidth: "85vw",
              zIndex: 999,
              background: "#0D3B44",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRight: "0.5px solid rgba(255,255,255,0.15)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              boxShadow: "12px 0 48px rgba(13,59,68,0.4)",
            }}
          >
            {/* Grain Texture Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.25,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
                mixBlendMode: "overlay",
              }}
            />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                position: "relative",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.5rem 1.75rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Link
                href="/"
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textDecoration: "none",
                }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#0D3B44,#2A9D8F)",
                    border: "1.5px solid rgba(212,175,55,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Leaf size={16} color="#D4AF37" />
                </motion.div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    color: "#F4F7F5",
                    letterSpacing: "0.02em",
                  }}
                >
                  Follicia
                </span>
              </Link>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close sidebar"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(244,247,245,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <X size={18} />
              </motion.button>
            </motion.div>

            {/* Nav links with staggered animation */}
            <nav
              style={{
                position: "relative",
                zIndex: 10,
                padding: "2rem 0",
                flex: 1,
              }}
            >
              {SIDEBAR_LINKS.map((link, i) => {
                const isActive = activeLink === link.href;
                const Icon = link.icon;

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.15 + i * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      style={{ textDecoration: "none" }}
                    >
                      <motion.div
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          padding: "1rem 1.75rem",
                          color: isActive ? "#F4F7F5" : "rgba(244,247,245,0.7)",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: "14px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                        }}
                      >
                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            style={{
                              position: "absolute",
                              left: "1.75rem",
                              width: "4px",
                              height: "4px",
                              borderRadius: "50%",
                              background: "#2A9D8F",
                              boxShadow: `0 0 12px #2A9D8F`,
                            }}
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}

                        {/* Icon with glow on hover */}
                        <motion.div
                          whileHover={{
                            filter: `drop-shadow(0 0 8px #2A9D8F)`,
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginLeft: isActive ? "12px" : "0",
                          }}
                        >
                          <Icon size={18} />
                        </motion.div>

                        <span>{link.label}</span>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom actions stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{
                position: "relative",
                zIndex: 10,
                padding: "1.5rem 1.75rem",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Loyalty Points Display */}
              {dbUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.3 }}
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "12px",
                    background: "rgba(212,175,55,0.15)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={14} color="#D4AF37" />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.8rem",
                        color: "rgba(244,247,245,0.8)",
                        fontWeight: 500,
                      }}
                    >
                      Loyalty Points
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "1rem",
                      color: "#D4AF37",
                      fontWeight: 700,
                    }}
                  >
                    {dbUser.loyaltyPoints || 0}
                  </span>
                </motion.div>
              )}

              {/* Take the Hair Quiz - with pulse animation */}
              <Link href="/quiz" onClick={onClose} style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "9999px",
                    background: "#2A9D8F",
                    border: "none",
                    color: "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    boxShadow: "0 4px 16px rgba(42,157,143,0.3)",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles size={16} />
                  </motion.div>
                  Take the Hair Quiz
                </motion.button>
              </Link>

              {/* User Profile Card - with gold border */}
              {dbUser || currentUser ? (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  style={{ textDecoration: "none" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02, borderColor: "#D4AF37" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      borderRadius: "9999px",
                      border: "1.5px solid rgba(212,175,55,0.6)",
                      background: "rgba(212,175,55,0.1)",
                      color: "#D4AF37",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <User size={16} />
                    {dbUser?.name || "Dashboard"}
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: "#D4AF37" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    onLoginClick();
                  }}
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    borderRadius: "9999px",
                    border: "1.5px solid rgba(212,175,55,0.6)",
                    background: "rgba(212,175,55,0.1)",
                    color: "#D4AF37",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <User size={16} />
                  Login / Sign Up
                </motion.button>
              )}

              {/* Cart - shrunk for symmetry */}
              <Link href="/cart" onClick={onClose} style={{ textDecoration: "none" }}>
                <motion.button
                  whileHover={{ scale: 1.02, borderColor: "#2A9D8F" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "9999px",
                    border: "1.5px solid rgba(42,157,143,0.4)",
                    background: "transparent",
                    color: "#2A9D8F",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <ShoppingBag size={15} />
                  Cart
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        background: "#D4AF37",
                        color: "#0D3B44",
                        borderRadius: "9999px",
                        padding: "2px 7px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                      }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
            </motion.div>
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
