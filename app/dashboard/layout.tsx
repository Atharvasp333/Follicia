"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Dna,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  Leaf,
  Menu,
  ChevronRight,
} from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "My Hair DNA",
    href: "/dashboard/dna",
    icon: Dna,
    exact: false,
  },
  {
    label: "Order Archives",
    href: "/dashboard/orders",
    icon: Package,
    exact: false,
  },
  {
    label: "Diagnostic History",
    href: "/dashboard/results",
    icon: ClipboardList,
    exact: false,
  },
];

function DashboardSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const { dbUser, currentUser } = useAuthModal();
  const router = useRouter();

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  const userName = dbUser?.name || currentUser?.email?.split("@")[0] || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <div
      style={{
        width: "256px",
        height: "100%",
        background: "#0D3B44",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(42,157,143,0.15)",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Brand header */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#0D3B44,#2A9D8F)",
            border: "1.5px solid rgba(212,175,55,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Leaf size={14} color="#D4AF37" />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#F4F7F5",
              letterSpacing: "0.05em",
            }}
          >
            Follicia
          </div>
          <div
            style={{
              fontSize: "0.62rem",
              color: "rgba(42,157,143,0.8)",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Scientific Atelier
          </div>
        </div>
      </div>

      {/* User card */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2A9D8F, #0D3B44)",
              border: "1.5px solid rgba(42,157,143,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#F4F7F5",
              fontFamily: "'Inter', sans-serif",
              flexShrink: 0,
            }}
          >
            {userInitial}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#F4F7F5",
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: "rgba(244,247,245,0.45)",
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {dbUser?.email || currentUser?.email || ""}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0" }}>
        <div
          style={{
            padding: "0.35rem 1.25rem 0.25rem",
            fontSize: "0.6rem",
            fontWeight: 700,
            color: "rgba(42,157,143,0.6)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Laboratory
        </div>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              style={{ textDecoration: "none", display: "block" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0.7rem 1.25rem",
                  margin: "1px 0.5rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: active
                    ? "rgba(42,157,143,0.15)"
                    : "transparent",
                  borderLeft: active
                    ? "3px solid #2A9D8F"
                    : "3px solid transparent",
                  color: active ? "#2A9D8F" : "rgba(244,247,245,0.65)",
                  transition:
                    "background 0.18s ease, color 0.18s ease, border-color 0.18s ease",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: active ? 600 : 400,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(42,157,143,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#F4F7F5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(244,247,245,0.65)";
                  }
                }}
              >
                <Icon size={15} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && (
                  <ChevronRight size={13} style={{ opacity: 0.5 }} />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div
        style={{
          padding: "0.75rem 1rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Link
          href="/dashboard/settings"
          onClick={onMobileClose}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0.6rem 0.75rem",
              borderRadius: "8px",
              color: "rgba(244,247,245,0.55)",
              fontSize: "0.8rem",
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              transition: "background 0.18s, color 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "#F4F7F5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(244,247,245,0.55)";
            }}
          >
            <Settings size={14} />
            <span>Account Settings</span>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "0.6rem 0.75rem",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            color: "rgba(239,68,68,0.7)",
            fontSize: "0.8rem",
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            transition: "background 0.18s, color 0.18s",
            textAlign: "left",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(239,68,68,0.08)";
            (e.currentTarget as HTMLElement).style.color = "#EF4444";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(239,68,68,0.7)";
          }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="dashboard-sidebar-desktop"
        style={{
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: "64px",
          flexShrink: 0,
        }}
      >
        <SidebarContent />
      </div>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="sidebar-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={onMobileClose}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(13,59,68,0.5)",
                backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              key="sidebar-mobile"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 201,
                height: "100vh",
              }}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function DashboardTopBar() {
  const { dbUser, currentUser, openModal } = useAuthModal();
  const { cartCount } = useCart();
  const userInitial = (dbUser?.name || currentUser?.email || "U").charAt(0).toUpperCase();

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        height: "64px",
      }}
    >
      {/* Logo */}
      <a
        href="/"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "#0D3B44",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textDecoration: "none",
        }}
      >
        FOLLICIA
      </a>

      {/* Right icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <a href="/cart" style={{ position: "relative", display: "flex", alignItems: "center", color: "#0D3B44" }}>
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: "#D4AF37", color: "#1A1A1A", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </a>
        <div
          onClick={!currentUser && !dbUser ? openModal : undefined}
          style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D3B44", color: "#F4F7F5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
        >
          {currentUser || dbUser ? userInitial : <User size={16} />}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, dbUser, isLoading } = useAuthModal();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser && !dbUser) {
        router.replace("/");
      }
      setAuthChecked(true);
    }
  }, [isLoading, currentUser, dbUser, router]);

  if (isLoading || !authChecked) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F8FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "3px solid #2A9D8F",
              borderTopColor: "transparent",
              animation: "spin 0.9s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.82rem",
              color: "#0D3B44",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Authenticating…
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser && !dbUser) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Global Navbar — sticky at top */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "64px",
          background: "rgba(244,247,245,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(213,224,220,0.5)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Mobile hamburger */}
        <button
          className="dashboard-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open dashboard sidebar"
          style={{
            background: "transparent",
            border: "none",
            padding: "0 1rem",
            cursor: "pointer",
            color: "#0D3B44",
            display: "none",
            alignItems: "center",
          }}
        >
          <Menu size={22} />
        </button>

        <DashboardTopBar />
      </div>

      {/* Body: Sidebar + Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <DashboardSidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Scrollable content */}
        <main
          style={{
            flex: 1,
            background: "#F8FAFB",
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            position: "sticky",
            top: "64px",
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar-desktop { display: none !important; }
          .dashboard-mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .dashboard-mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
