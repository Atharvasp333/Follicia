"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
} from "lucide-react";
import { GrainTexture } from "./GrainTexture";

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
    label: "CORE SYSTEMS",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
    ],
  },
  {
    label: "INVENTORY AND USERS",
    items: [
      { href: "/admin/inventory", icon: Package, label: "Stock Management" },
      { href: "/admin/products/add", icon: Plus, label: "Add Product" },
      { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
      { href: "/admin/customers", icon: Users, label: "User Management" },
    ],
  },
];

// Magnetic Icon Component
function MagneticIcon({ icon: Icon, isActive }: { icon: any; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * 0.15);
    y.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <Icon
        size={18}
        className="transition-all duration-300"
        style={{
          filter: isActive ? `drop-shadow(0 0 8px ${B.seafoam})` : "none",
        }}
      />
    </motion.div>
  );
}

// Nav Item Component
function NavItem({
  href,
  icon,
  label,
  isActive,
  index,
}: {
  href: string;
  icon: any;
  label: string;
  isActive: boolean;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Link href={href} className="block">
        <motion.div
          className="relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer overflow-hidden"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{
            x: isHovered && !isActive ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Active Indicator Pill */}
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: B.seafoam }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}

          {/* Hover Background */}
          {!isActive && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex items-center gap-3 w-full">
            <MagneticIcon icon={icon} isActive={isActive} />
            <motion.span
              className="text-[13px] font-medium tracking-tight"
              style={{
                fontFamily: "var(--font-inter)",
                color: isActive ? "white" : "rgba(255,255,255,0.7)",
              }}
              animate={{
                color: isHovered ? "white" : isActive ? "white" : "rgba(255,255,255,0.7)",
              }}
            >
              {label}
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Breathing Logo Component
function BreathingLogo() {
  return (
    <Link href="/admin" className="block px-6 mb-12">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.1)",
            fontFamily: "var(--font-playfair)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: B.offWhite,
          }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 0 0px ${B.seafoam}`,
              `0 0 20px ${B.seafoam}40`,
              `0 0 0px ${B.seafoam}`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          F
        </motion.div>
        <span
          className="text-xl font-semibold"
          style={{
            fontFamily: "var(--font-playfair)",
            color: B.offWhite,
          }}
        >
          Follicia
        </span>
      </motion.div>
    </Link>
  );
}

// Admin Profile Card
function AdminProfileCard() {
  return (
    <motion.div
      className="px-4 pt-4 border-t"
      style={{ borderColor: "rgba(255,255,255,0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p
              className="text-[13px] font-medium"
              style={{ fontFamily: "var(--font-inter)", color: B.offWhite }}
            >
              Admin User
            </p>
            <p
              className="text-[10px] italic mt-0.5"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Status: Gold
            </p>
          </div>
        </div>
        <motion.button
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium"
          style={{
            fontFamily: "var(--font-inter)",
            border: `1px solid ${B.forestTeal}`,
            color: "rgba(255,255,255,0.7)",
          }}
          whileHover={{
            borderColor: B.seafoam,
            color: "white",
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={14} />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50"
      style={{
        width: "240px",
        backgroundColor: B.forestTeal,
        backdropFilter: "blur(10px)",
        borderRight: "0.5px solid rgba(255,255,255,0.1)",
      }}
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
    >
      {/* Grainy Texture Overlay */}
      <GrainTexture opacity={0.3} />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full py-8">
        {/* Logo */}
        <BreathingLogo />

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto admin-sidebar-scroll">
          {navGroups.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: groupIndex * 0.1 }}
            >
              {/* Group Label */}
              <h3
                className="text-[10px] font-medium tracking-wider mb-2 px-4 italic"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                {group.label}
              </h3>

              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    isActive={pathname === item.href}
                    index={groupIndex * 2 + itemIndex}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </nav>

        {/* Admin Profile */}
        <AdminProfileCard />
      </div>
    </motion.aside>
  );
}
