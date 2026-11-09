"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Instagram, Twitter, Youtube, CheckCircle } from "lucide-react";

const footerSections = [
  {
    title: "Regimens",
    links: [
      { label: "Scalp Serums", href: "/shop" },
      { label: "Deep Conditioning Masks", href: "/shop" },
      { label: "Growth Protocols", href: "/shop" },
      { label: "Clarifying Cleansers", href: "/shop" },
      { label: "Refill Subscriptions", href: "/#pricing" },
    ],
  },
  {
    title: "Diagnostics",
    links: [
      { label: "90-Second Hair Quiz", href: "/quiz" },
      { label: "Porosity & Scalp Guide", href: "/quiz" },
      { label: "Tap Water Hardness Index", href: "/#science" },
      { label: "Active Ingredient Glossary", href: "/shop" },
      { label: "Clinical Formulation Notes", href: "/#science" },
    ],
  },
  {
    title: "Care & Support",
    links: [
      { label: "Track Package", href: "/dashboard/orders" },
      { label: "Manage Regimen", href: "/dashboard" },
      { label: "Shipping & Refill Timing", href: "/dashboard/orders" },
      { label: "Returns & Guarantee", href: "/shop" },
      { label: "Trichologist Inquiries", href: "/dashboard/feedback" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer style={{ background: "#0D3B44", color: "#F4F7F5", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
      {/* Main footer content */}
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "5rem 1.5rem 3.5rem",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: "3.5rem",
        }}
        className="footer-grid"
      >
        {/* Brand & Newsletter Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Leaf size={14} color="#2A9D8F" />
            </div>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#F4F7F5",
                letterSpacing: "0.02em",
              }}
            >
              Follicia
            </span>
          </div>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.85rem",
              lineHeight: 1.7,
              color: "rgba(244, 247, 245, 0.7)",
              marginBottom: "1.75rem",
              maxWidth: "320px",
            }}
          >
            Formulated for local tap water hardness, humidity, and individual hair porosity. Compounded fresh, delivered directly.
          </p>

          {/* Newsletter Box */}
          <div style={{ maxWidth: "320px", marginBottom: "1.75rem" }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#F4F7F5",
                marginBottom: "0.5rem",
              }}
            >
              Quarterly formulation notes
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                color: "rgba(244, 247, 245, 0.5)",
                lineHeight: 1.5,
                marginBottom: "0.85rem",
              }}
            >
              Short notes on seasonal scalp shifts and active ingredient updates. No spam.
            </p>

            {joined ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "6px",
                  background: "rgba(42, 157, 143, 0.15)",
                  border: "1px solid rgba(42, 157, 143, 0.3)",
                }}
              >
                <CheckCircle size={15} color="#2A9D8F" />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    color: "#F4F7F5",
                  }}
                >
                  Subscribed to seasonal notes.
                </span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setJoined(true);
                }}
                style={{ display: "flex", gap: "6px" }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1,
                    padding: "0.6rem 0.85rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.14)",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#F4F7F5",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    outline: "none",
                    minWidth: 0,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2A9D8F")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.14)")}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "6px",
                    border: "none",
                    background: "#2A9D8F",
                    color: "#FFFFFF",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Socials - clean line icons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {[
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }, i) => (
              <a
                key={i}
                href="#"
                aria-label={label}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "rgba(244, 247, 245, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.15s ease, background-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(244, 247, 245, 0.7)";
                  (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Link Columns */}
        {footerSections.map((sec) => (
          <div key={sec.title}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#2A9D8F",
                marginBottom: "1.25rem",
                letterSpacing: "0.04em",
              }}
            >
              {sec.title}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {sec.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(244, 247, 245, 0.65)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(244, 247, 245, 0.65)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "1.5rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.78rem",
            color: "rgba(244, 247, 245, 0.45)",
            margin: 0,
          }}
        >
          © 2026 Follicia Labs. Bio-matched scalp care. Cruelty-free & silicone-free.
        </p>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Shipping Policy", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                color: "rgba(244, 247, 245, 0.45)",
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#FFFFFF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(244, 247, 245, 0.45)")}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}