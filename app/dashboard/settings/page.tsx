"use client";

import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function AccountSettingsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: 800 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Settings size={13} color="#2A9D8F" />
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#2A9D8F", letterSpacing: "0.2em", textTransform: "uppercase" as const, fontFamily: "'Montserrat',sans-serif" }}>Preferences</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, color: "#0D3B44", margin: 0 }}>Account Settings</h1>
        <p style={{ marginTop: 6, color: "#6B7280", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif" }}>Manage your profile, notifications, and security preferences.</p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
        {[
          { icon: User, title: "Profile Information", desc: "Update your name, photo and personal details", color: "#2A9D8F" },
          { icon: Bell, title: "Notifications", desc: "Control email and push notification preferences", color: "#D4AF37" },
          { icon: Shield, title: "Security & Privacy", desc: "Password, two-factor auth and data privacy", color: "#8B5CF6" },
          { icon: Palette, title: "Appearance", desc: "Theme, language and display preferences", color: "#EF4444" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.06 }}
              style={{ background: "white", borderRadius: 16, border: "1px solid #E8F0ED", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
              whileHover={{ x: 4 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={19} color={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0D3B44", fontFamily: "'Inter',sans-serif" }}>{item.title}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF", fontFamily: "'Inter',sans-serif", marginTop: 2 }}>{item.desc}</div>
              </div>
              <Settings size={14} color="#9CA3AF" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
