"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  Package,
} from "lucide-react";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
};

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/admin/inventory", icon: Package, label: "Stock Management" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        background: B.teal,
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        padding: "2rem 0",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link
        href="/admin"
        style={{
          padding: "0 1.5rem",
          marginBottom: "3rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: B.offWhite,
          }}
        >
          F
        </div>
        <span
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: B.offWhite,
          }}
        >
          Follicia
        </span>
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0 1rem" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                background: isActive ? B.seafoam : "transparent",
                color: isActive ? "white" : "rgba(255,255,255,0.7)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                }
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div style={{ padding: "0 1rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1rem" }}>
        <Link
          href="/admin/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            background: pathname === "/admin/settings" ? B.seafoam : "transparent",
            color: pathname === "/admin/settings" ? "white" : "rgba(255,255,255,0.7)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.2s ease",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            if (pathname !== "/admin/settings") {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "white";
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== "/admin/settings") {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            }
          }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
