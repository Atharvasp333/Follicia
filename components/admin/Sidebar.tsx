"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
} from "lucide-react";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
};

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "64px",
        height: "100vh",
        background: B.teal,
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1.5rem 0",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <Link
        href="/admin"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "3rem",
          fontFamily: "var(--font-playfair), serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: B.offWhite,
          textDecoration: "none",
        }}
      >
        F
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isActive ? B.offWhite : "rgba(255,255,255,0.6)",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = B.offWhite;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <Link
        href="/admin/settings"
        title="Settings"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,0.6)",
          transition: "all 0.2s ease",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.color = B.offWhite;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        }}
      >
        <Settings size={20} />
      </Link>
    </aside>
  );
}
