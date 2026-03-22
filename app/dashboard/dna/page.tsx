"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dna,
  Droplets,
  Wind,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Download,
} from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import axios from "axios";

interface HairDNA {
  hairType: string | null;
  porosity: string | null;
  scalpCondition: string | null;
  porosityScore: number | null;
  scalpHealth: number | null;
  primaryConcern: string | null;
  hairAnalysis: string | null;
  targetTags: string[];
}

const HAIR_TYPE_INFO: Record<string, { label: string; description: string; color: string }> = {
  straight: {
    label: "Type 1 — Straight",
    description: "Smooth cuticle structure with high natural shine. Prone to oiliness at the roots.",
    color: "#2A9D8F",
  },
  wavy: {
    label: "Type 2 — Wavy",
    description: "S-pattern formation with moderate porosity. Balanced moisture retention.",
    color: "#3B82F6",
  },
  curly: {
    label: "Type 3 — Curly",
    description: "Defined curl pattern with higher porosity. Requires intensive moisture binding.",
    color: "#8B5CF6",
  },
  coily: {
    label: "Type 4 — Coily / Kinky",
    description: "Tight coil pattern with very high porosity. Maximum moisture therapy recommended.",
    color: "#D4AF37",
  },
};

const POROSITY_INFO: Record<string, { label: string; desc: string; tip: string }> = {
  low: {
    label: "Low Porosity",
    desc: "Tightly sealed cuticle layer. Water and products sit on the surface.",
    tip: "Use heat to open cuticles. Lightweight, liquid-based products work best.",
  },
  medium: {
    label: "Medium Porosity",
    desc: "Well-balanced cuticle structure with ideal moisture absorption.",
    tip: "Maintain with regular deep conditioning. Minimal frizz expected.",
  },
  high: {
    label: "High Porosity",
    desc: "Open cuticle structure that absorbs moisture quickly but loses it fast.",
    tip: "Use heavy sealants. Focus on protein treatments to fill gaps.",
  },
};

function SkeletonBar() {
  return (
    <div
      style={{
        height: "12px",
        borderRadius: "9999px",
        background: "linear-gradient(90deg, #F0F4F3 25%, #E4EDEA 50%, #F0F4F3 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        width: "100%",
      }}
    />
  );
}

function AnimatedBar({
  value,
  color,
  label,
  sublabel,
}: {
  value: number;
  color: string;
  label: string;
  sublabel?: string;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "6px",
        }}
      >
        <div>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#0D3B44",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontSize: "0.72rem",
                color: "#9CA3AF",
                fontFamily: "'Inter', sans-serif",
                marginLeft: "8px",
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.88rem",
            color: color,
          }}
        >
          {value}
          <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "#9CA3AF" }}>/100</span>
        </span>
      </div>
      <div
        style={{
          height: "8px",
          borderRadius: "9999px",
          background: "rgba(42,157,143,0.1)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{
            height: "100%",
            borderRadius: "9999px",
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

function HairTypeCircle({ type }: { type: string }) {
  const info = HAIR_TYPE_INFO[type] || HAIR_TYPE_INFO.wavy;
  const patterns: Record<string, string> = {
    straight: "M 25 10 L 25 90",
    wavy: "M 10 50 Q 20 20 25 50 Q 30 80 40 50",
    curly: "M 20 80 C 5 60 40 40 25 25 C 10 10 45 0 30 15",
    coily: "M 25 80 C 5 70 45 55 25 45 C 5 35 45 20 25 10",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: `2.5px solid ${info.color}`,
          background: `${info.color}12`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg width="50" height="90" viewBox="0 0 50 90" fill="none">
          <path
            d={patterns[type] || patterns.wavy}
            stroke={info.color}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          color: info.color,
          fontFamily: "'Montserrat', sans-serif",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {info.label}
      </div>
    </div>
  );
}

const BENCHMARKS = [
  { label: "Tensile Strength", value: "+4.2 pts", trend: "up" },
  { label: "Oxidative Stress", value: "-8%", trend: "down" },
  { label: "Cuticle Alignment", value: "Optimal", trend: "neutral" },
];

export default function HairDNAPage() {
  const { dbUser } = useAuthModal();
  const [dna, setDna] = useState<HairDNA | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbUser?.id) return;
    axios
      .get(`/api/dashboard/user?userId=${dbUser.id}`)
      .then((res) => {
        setDna(res.data.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dbUser?.id]);

  const hairInfo =
    dna?.hairType && HAIR_TYPE_INFO[dna.hairType]
      ? HAIR_TYPE_INFO[dna.hairType]
      : null;
  const porosityInfo =
    dna?.porosity && POROSITY_INFO[dna.porosity]
      ? POROSITY_INFO[dna.porosity]
      : null;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <Dna size={13} color="#2A9D8F" />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "#2A9D8F",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Genomic Analysis
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "#0D3B44",
            margin: 0,
          }}
        >
          My Hair DNA
        </h1>
        <p
          style={{
            marginTop: "6px",
            color: "#6B7280",
            fontSize: "0.85rem",
            fontFamily: "'Inter', sans-serif",
            maxWidth: "520px",
          }}
        >
          A comprehensive molecular breakdown of your unique strand architecture,
          synthesized through genomic sequencing and high-resolution imaging.
        </p>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* Vitality Indices card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "white",
            borderRadius: "20px",
            border: "1px solid #E8F0ED",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1.25rem",
            }}
          >
            <Sparkles size={15} color="#2A9D8F" />
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#0D3B44",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Vitality Indices
            </span>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2].map((i) => (
                <SkeletonBar key={i} />
              ))}
            </div>
          ) : dna?.porosityScore != null || dna?.scalpHealth != null ? (
            <>
              {dna.porosityScore != null && (
                <AnimatedBar
                  value={dna.porosityScore}
                  color="#2A9D8F"
                  label="Porosity Index"
                  sublabel="optimal moisture retention"
                />
              )}
              {dna.scalpHealth != null && (
                <AnimatedBar
                  value={dna.scalpHealth}
                  color="#D4AF37"
                  label="Scalp Health"
                  sublabel="exceptional lipid balance"
                />
              )}
              {dna.primaryConcern && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(42,157,143,0.06)",
                    border: "1px solid rgba(42,157,143,0.12)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#2A9D8F",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontFamily: "'Montserrat', sans-serif",
                      marginBottom: "3px",
                    }}
                  >
                    Primary Concern
                  </div>
                  <div
                    style={{
                      fontSize: "0.83rem",
                      color: "#374151",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  >
                    {dna.primaryConcern}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#9CA3AF",
                fontSize: "0.82rem",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <Dna size={28} style={{ opacity: 0.3, marginBottom: "8px" }} />
              <p>Complete the Hair Quiz to unlock your DNA analysis.</p>
            </div>
          )}
        </motion.div>

        {/* Hair Type Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            background: "white",
            borderRadius: "20px",
            border: "1px solid #E8F0ED",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1.25rem",
            }}
          >
            <Droplets size={15} color="#2A9D8F" />
            <span
              style={{
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#0D3B44",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Current Strand Architecture
            </span>
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#F0F4F3",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {dna?.hairType && (
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <HairTypeCircle type={dna.hairType} />
                  <div>
                    {hairInfo && (
                      <>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            color: "#0D3B44",
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: "4px",
                          }}
                        >
                          {hairInfo.label}
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.76rem",
                            color: "#6B7280",
                            fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.55,
                          }}
                        >
                          {hairInfo.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {dna?.porosity && porosityInfo && (
                <div
                  style={{
                    padding: "0.9rem",
                    borderRadius: "12px",
                    background: "rgba(42,157,143,0.05)",
                    border: "1px solid rgba(42,157,143,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    <Wind size={12} color="#2A9D8F" />
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        color: "#0D3B44",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {porosityInfo.label}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.73rem",
                      color: "#6B7280",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {porosityInfo.desc}
                  </p>
                  <div
                    style={{
                      marginTop: "6px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "5px",
                    }}
                  >
                    <Info size={10} color="#2A9D8F" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span
                      style={{
                        fontSize: "0.68rem",
                        color: "#2A9D8F",
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: "italic",
                      }}
                    >
                      {porosityInfo.tip}
                    </span>
                  </div>
                </div>
              )}

              {!dna?.hairType && !loading && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "1.5rem",
                    color: "#9CA3AF",
                    fontSize: "0.82rem",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Complete the Hair Quiz to reveal your strand architecture.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Structural Progression */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid #E8F0ED",
          padding: "1.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "#0D3B44",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "0.75rem",
          }}
        >
          Structural Progression
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "#6B7280",
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.65,
            margin: "0 0 1.25rem",
          }}
        >
          Our longitudinal comparison reveals a significant stabilization of the
          protein matrix within your primary cortex. The lipid barrier shows
          marked improvement, likely due to the prescribed Atelier Treatment #04.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {BENCHMARKS.map((b) => (
            <div
              key={b.label}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                background: "#F8FAFB",
                border: "1px solid #E8F0ED",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  marginBottom: "4px",
                }}
              >
                {b.trend === "up" && <TrendingUp size={13} color="#2A9D8F" />}
                {b.trend === "down" && <TrendingDown size={13} color="#2A9D8F" />}
                {b.trend === "neutral" && <Minus size={13} color="#D4AF37" />}
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#0D3B44",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {b.value}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  color: "#9CA3AF",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {b.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Analysis note */}
      {dna?.hairAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          style={{
            background: "linear-gradient(135deg, #0D3B44, #164752)",
            borderRadius: "20px",
            padding: "1.5rem",
            marginBottom: "1.25rem",
            color: "#F4F7F5",
          }}
        >
          <div
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "rgba(42,157,143,0.8)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'Montserrat', sans-serif",
              marginBottom: "0.6rem",
            }}
          >
            AI Clinical Summary
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "rgba(244,247,245,0.9)",
            }}
          >
            &ldquo;{dna.hairAnalysis}&rdquo;
          </p>
        </motion.div>
      )}

      {/* Footer actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        {[
          { label: "Methodology", icon: Info },
          { label: "Raw Data Export", icon: Download },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: "9999px",
              border: "1.5px solid #E8F0ED",
              background: "white",
              color: "#0D3B44",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#2A9D8F";
              (e.currentTarget as HTMLElement).style.color = "#2A9D8F";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#E8F0ED";
              (e.currentTarget as HTMLElement).style.color = "#0D3B44";
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </motion.div>

      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}
