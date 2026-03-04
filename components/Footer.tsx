"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Instagram, Twitter, Youtube, ArrowRight, CheckCircle } from "lucide-react";

const cols = [
    {
        title: "Science",
        links: ["Clinical Research", "Ingredient Library", "AI Technology", "Case Studies", "Biomarker Panel"],
    },
    {
        title: "Shop",
        links: ["Scalp Serums", "Hair Masks", "Growth Treatments", "Bundles", "Subscription"],
    },
    {
        title: "Support",
        links: ["Take the Quiz", "Hair Profile", "Track Order", "Returns Policy", "FAQs"],
    },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [joined, setJoined] = useState(false);

    return (
        <footer style={{ background: "#0D3B44", color: "#F4F7F5" }}>
            {/* Main footer grid */}
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "5rem 1.5rem 3rem",
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
                    gap: "3rem",
                }}
                className="footer-grid"
            >
                {/* Brand column */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(212,175,55,0.18)", border: "1px solid rgba(212,175,55,0.3)" }}>
                            <Leaf size={16} color="#D4AF37" />
                        </div>
                        <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: "1.25rem", color: "#F4F7F5" }}>
                            Follicia
                        </span>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(244,247,245,0.6)", marginBottom: "2rem", maxWidth: "280px" }}>
                        Clinical-grade hair science, decoded by AI. Personalised formulations for every scalp — no guesswork, just results.
                    </p>

                    {/* Newsletter */}
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#2A9D8F", marginBottom: "10px" }}>
                        Join the Community
                    </p>
                    {joined ? (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: "flex", alignItems: "center", gap: "8px" }}
                        >
                            <CheckCircle size={16} color="#2A9D8F" />
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#2A9D8F" }}>
                                You&apos;re in! Welcome aboard.
                            </span>
                        </motion.div>
                    ) : (
                        <form
                            onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
                            style={{ display: "flex", gap: "8px" }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                style={{
                                    flex: 1,
                                    padding: "0.65rem 1rem",
                                    borderRadius: "9999px",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    background: "rgba(255,255,255,0.07)",
                                    color: "#F4F7F5",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "0.85rem",
                                    outline: "none",
                                    minWidth: 0,
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(42,157,143,0.5)")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: "0.65rem 1rem",
                                    borderRadius: "9999px",
                                    border: "none",
                                    background: "#D4AF37",
                                    color: "#0D3B44",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <ArrowRight size={15} />
                            </button>
                        </form>
                    )}

                    {/* Socials */}
                    <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem" }}>
                        {[Instagram, Twitter, Youtube].map((Icon, i) => (
                            <motion.a
                                key={i}
                                href="#"
                                whileHover={{ y: -3 }}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(255,255,255,0.07)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    color: "rgba(244,247,245,0.7)",
                                    transition: "all 0.25s ease",
                                    textDecoration: "none",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.15)";
                                    (e.currentTarget as HTMLElement).style.color = "#D4AF37";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                                    (e.currentTarget as HTMLElement).style.color = "rgba(244,247,245,0.7)";
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                                }}
                            >
                                <Icon size={15} />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {cols.map((col) => (
                    <div key={col.title}>
                        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#2A9D8F", marginBottom: "1.25rem" }}>
                            {col.title}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            {col.links.map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        style={{
                                            fontFamily: "'Inter', sans-serif",
                                            fontSize: "0.875rem",
                                            color: "rgba(244,247,245,0.6)",
                                            textDecoration: "none",
                                            transition: "color 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D4AF37")}
                                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(244,247,245,0.6)")}
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "1.5rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(244,247,245,0.4)", margin: 0 }}>
                    © 2025 Follicia. All rights reserved. Clinically formulated with care.
                </p>
                <div style={{ display: "flex", gap: "1.25rem" }}>
                    {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                        <a
                            key={link}
                            href="#"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "0.78rem",
                                color: "rgba(244,247,245,0.4)",
                                textDecoration: "none",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D4AF37")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(244,247,245,0.4)")}
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>

            <style>{`
        @media (max-width: 1023px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; } }
        @media (max-width: 639px)  { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </footer>
    );
}
