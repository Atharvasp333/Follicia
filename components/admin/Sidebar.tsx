"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  MessageSquare,
  Megaphone,
} from "lucide-react";

// Brand Colors
const B = {
  forestTeal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
};

// Navigation Structure with Groups
const navGroups = [
  {
    label: "Core systems",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
      { href: "/admin/revenue", icon: TrendingUp, label: "Revenue model" },
    ],
  },
  {
    label: "Inventory & orders",
    items: [
      { href: "/admin/inventory", icon: Package, label: "Stock management" },
      { href: "/admin/products/add", icon: Plus, label: "Add product" },
      { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
      { href: "/admin/customers", icon: Users, label: "Customer directory" },
    ],
  },
  {
    label: "Customer intelligence",
    items: [
      { href: "/admin/crm-intelligence", icon: TrendingUp, label: "CRM intelligence" },
      { href: "/admin/feedback", icon: MessageSquare, label: "Product feedback" },
      { href: "/admin/marketing", icon: Megaphone, label: "Campaigns" },
    ],
  },
];

// Nav Item Component
function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: any;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          borderRadius: "6px",
          backgroundColor: isActive ? "rgba(42, 157, 143, 0.16)" : "transparent",
          borderLeft: isActive ? `3px solid ${B.seafoam}` : "3px solid transparent",
          color: isActive ? "#FFFFFF" : "rgba(244, 247, 245, 0.7)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: isActive ? 600 : 400,
          cursor: "pointer",
          transition: "background-color 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.06)";
            (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(244, 247, 245, 0.7)";
          }
        }}
      >
        <Icon size={16} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.8 }} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
    </Link>
  );
}

// Logo Component
function AdminLogo() {
  return (
    <Link href="/admin" style={{ textDecoration: "none", display: "block", padding: "0 16px", marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#F4F7F5",
            flexShrink: 0,
          }}
        >
          F
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "#F4F7F5",
              lineHeight: 1.2,
            }}
          >
            Follicia
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: "rgba(244, 247, 245, 0.5)",
            }}
          >
            Store Operations
          </div>
        </div>
      </div>
    </Link>
  );
}

// Admin Profile Card
function AdminProfileCard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          padding: "12px",
          borderRadius: "8px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "#F4F7F5",
                margin: 0,
              }}
            >
              Operations Admin
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "11px",
                color: "rgba(244, 247, 245, 0.5)",
                margin: "2px 0 0 0",
              }}
            >
              online · store staff
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "transparent",
            color: isLoggingOut ? "rgba(255, 255, 255, 0.4)" : "rgba(244, 247, 245, 0.8)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            transition: "background-color 0.15s ease, border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoggingOut) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.12)";
          }}
        >
          {isLoggingOut ? (
            <>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTopColor: "rgba(255, 255, 255, 0.8)",
                  animation: "spin 0.6s linear infinite",
                }}
              />
              Signing out...
            </>
          ) : (
            <>
              <LogOut size={13} />
              Sign out
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: "240px",
        backgroundColor: B.forestTeal,
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", paddingTop: "24px" }}>
        {/* Brand */}
        <AdminLogo />

        {/* Navigation Groups */}
        <nav
          style={{
            flex: 1,
            padding: "0 12px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {navGroups.map((group) => (
            <div key={group.label}>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(244, 247, 245, 0.45)",
                  padding: "0 10px",
                  marginBottom: "6px",
                  margin: 0,
                }}
              >
                {group.label}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "6px" }}>
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin Profile */}
        <AdminProfileCard />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </aside>
  );
}