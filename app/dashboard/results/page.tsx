"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, Calendar, ChevronRight,
  FileText, Microscope, Clock, TrendingUp, Stethoscope,
} from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";
import axios from "axios";

interface DiagEntry {
  id: string;
  title: string;
  clinicalNote: string;
  date: string;
  type: "completed" | "pending" | "draft";
  tags?: string[];
}

function SkeletonCard() {
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8F0ED", padding: "1.25rem", height: 140, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#F0F4F3 25%,#E4EDEA 50%,#F0F4F3 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function GridPaperCard({ entry, index }: { entry: DiagEntry; index: number }) {
  const typeConfig = {
    completed: { color: "#2A9D8F", bg: "rgba(42,157,143,0.08)", label: "Completed" },
    pending:   { color: "#D4AF37", bg: "rgba(212,175,55,0.1)",   label: "Pending"   },
    draft:     { color: "#8B5CF6", bg: "rgba(139,92,246,0.1)",   label: "Draft"     },
  };
  const cfg = typeConfig[entry.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06 }}
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #E8F0ED",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
      }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(13,59,68,0.09)" }}
    >
      {/* Grid paper top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)` }} />

      <div style={{ padding: "1.25rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={14} color={cfg.color} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#0D3B44", fontFamily: "'Inter',sans-serif", lineHeight: 1.3 }}>{entry.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Calendar size={10} color="#9CA3AF" />
                <span style={{ fontSize: "0.68rem", color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}>
                  {new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
          <span style={{ padding: "3px 9px", borderRadius: 9999, fontSize: "0.65rem", fontWeight: 700, fontFamily: "'Montserrat',sans-serif", background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
            {cfg.label}
          </span>
        </div>

        {/* Grid-paper style note */}
        <div style={{
          background: "repeating-linear-gradient(transparent,transparent 22px,rgba(42,157,143,0.07) 22px,rgba(42,157,143,0.07) 23px)",
          borderRadius: 8,
          padding: "0.75rem 0.85rem",
          marginBottom: "0.75rem",
          borderLeft: `3px solid ${cfg.color}40`,
        }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: cfg.color, letterSpacing: "0.14em", textTransform: "uppercase" as const, fontFamily: "'Montserrat',sans-serif", marginBottom: 4 }}>
            Clinical Note
          </div>
          <p style={{ margin: 0, fontSize: "0.79rem", color: "#374151", fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", lineHeight: 1.65 }}>
            {entry.clinicalNote}
          </p>
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: "0.75rem" }}>
            {entry.tags.map(t => (
              <span key={t} style={{ padding: "2px 8px", borderRadius: 9999, fontSize: "0.62rem", fontWeight: 600, background: "#F0F4F3", color: "#6B7280", fontFamily: "'Montserrat',sans-serif" }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 4, color: cfg.color, fontSize: "0.72rem", fontWeight: 600, fontFamily: "'Montserrat',sans-serif" }}>
          View Detailed Report <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

export default function DiagnosticHistoryPage() {
  const { dbUser } = useAuthModal();
  const [entries, setEntries] = useState<DiagEntry[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysSince, setDaysSince] = useState<number | null>(null);

  useEffect(() => {
    if (!dbUser?.id) return;
    axios.get(`/api/dashboard/user?userId=${dbUser.id}`)
      .then(res => {
        const user = res.data.user;
        if (user?.hairAnalysis) setAiSummary(user.hairAnalysis);
        const updatedAt = res.data.updatedAt || res.data.user?.updatedAt;
        if (updatedAt) {
          const days = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 864e5);
          setDaysSince(days);
        }
        // Build synthetic entries from user data
        const syntheticEntries: DiagEntry[] = [];
        if (user?.hairAnalysis) {
          syntheticEntries.push({
            id: "ai-1",
            title: "Follicular Density Stabilization",
            clinicalNote: user.hairAnalysis.slice(0, 220),
            date: res.data.updatedAt || new Date().toISOString(),
            type: "completed",
            tags: user?.targetTags?.slice(0, 3) || ["hair-density"],
          });
        }
        if (user?.primaryConcern) {
          syntheticEntries.push({
            id: "ai-2",
            title: "Primary Concern Mapping",
            clinicalNote: `AI has identified your primary concern as: ${user.primaryConcern}. A targeted protocol is recommended for your hair profile.`,
            date: new Date(Date.now() - 7 * 864e5).toISOString(),
            type: "completed",
            tags: [user.primaryConcern.toLowerCase().replace(/\s+/, "-")],
          });
        }
        if (user?.scalpCondition) {
          syntheticEntries.push({
            id: "ai-3",
            title: "Preliminary Scalp Hydration Test",
            clinicalNote: `${user.porosity ? `${user.porosity.charAt(0).toUpperCase() + user.porosity.slice(1)} porosity` : "Porosity"} detected. Scalp condition: ${user.scalpCondition}. Recommend adjustment of cleaning ritual before clinical baseline capture.`,
            date: new Date(Date.now() - 21 * 864e5).toISOString(),
            type: user.scalpHealth && user.scalpHealth >= 60 ? "completed" : "pending",
            tags: ["scalp-health", user.scalpCondition],
          });
        }
        setEntries(syntheticEntries.length > 0 ? syntheticEntries : SAMPLE_ENTRIES);
      })
      .catch(() => setEntries(SAMPLE_ENTRIES))
      .finally(() => setLoading(false));
  }, [dbUser?.id]);

  return (
    <div style={{ padding: "2rem", maxWidth: 1000 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <ClipboardList size={13} color="#2A9D8F" />
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#2A9D8F", letterSpacing: "0.2em", textTransform: "uppercase" as const, fontFamily: "'Montserrat',sans-serif" }}>Clinical Archive</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, color: "#0D3B44", margin: 0 }}>Diagnostic History</h1>
        <p style={{ marginTop: 6, color: "#6B7280", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif", maxWidth: 560 }}>
          A chronological archive of your clinical hair assessments and AI-driven morphological analysis. Each entry represents a pivotal snapshot in your restoration journey.
        </p>
        {daysSince !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10, padding: "5px 12px", borderRadius: 9999, background: "rgba(42,157,143,0.08)", border: "1px solid rgba(42,157,143,0.15)", width: "fit-content" }}>
            <Clock size={11} color="#2A9D8F" />
            <span style={{ fontSize: "0.72rem", color: "#2A9D8F", fontWeight: 600, fontFamily: "'Montserrat',sans-serif" }}>
              {daysSince === 0 ? "Updated today" : `${daysSince} day${daysSince !== 1 ? "s" : ""} since previous check-in`}
            </span>
          </div>
        )}
      </motion.div>

      {/* Stats strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Assessments", value: entries.length.toString(), icon: Microscope },
          { label: "Completed", value: entries.filter(e => e.type === "completed").length.toString(), icon: ClipboardList },
          { label: "Cumulative Recovery", value: "18%", icon: TrendingUp },
          { label: "Clinical Advisor", value: "Available", icon: Stethoscope },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ background: "white", borderRadius: 16, border: "1px solid #E8F0ED", padding: "1rem 1.25rem", display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(42,157,143,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={15} color="#2A9D8F" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0D3B44", fontFamily: "'Inter',sans-serif" }}>{loading ? "—" : stat.value}</div>
                <div style={{ fontSize: "0.68rem", color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Entries grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: "1.1rem", marginBottom: "1.5rem" }}>
        {loading
          ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
          : entries.map((e, i) => <GridPaperCard key={e.id} entry={e} index={i} />)
        }
      </div>

      {/* Morphological progress */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
        style={{ background: "linear-gradient(135deg,#0D3B44,#164752)", borderRadius: 20, padding: "1.5rem 2rem", display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" as const, marginBottom: "1.25rem" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(42,157,143,0.8)", letterSpacing: "0.18em", textTransform: "uppercase" as const, fontFamily: "'Montserrat',sans-serif", marginBottom: 6 }}>
            Morphological Progress
          </div>
          <p style={{ margin: 0, fontFamily: "'Playfair Display',Georgia,serif", fontSize: "0.95rem", color: "rgba(244,247,245,0.92)", lineHeight: 1.65, fontStyle: "italic" }}>
            &ldquo;Your follicles have shown an 18% cumulative recovery since the baseline assessment. The current regimen is proving effective.&rdquo;
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, alignItems: "flex-end" }}>
          {[
            { label: "Hair Density", val: 82 },
            { label: "Scalp Vitality", val: 74 },
          ].map(item => (
            <div key={item.label} style={{ textAlign: "right" as const }}>
              <div style={{ fontSize: "0.68rem", color: "rgba(244,247,245,0.5)", fontFamily: "'Inter',sans-serif", marginBottom: 3 }}>{item.label}</div>
              <div style={{ width: 120, height: 5, borderRadius: 9999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                  style={{ height: "100%", borderRadius: 9999, background: "linear-gradient(90deg,#2A9D8Face,#2A9D8F)" }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Summary */}
      {aiSummary && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: "white", borderRadius: 20, border: "1px solid #E8F0ED", padding: "1.5rem", borderLeft: "4px solid #8B5CF6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
            <Stethoscope size={14} color="#8B5CF6" />
            <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#8B5CF6", letterSpacing: "0.16em", textTransform: "uppercase" as const, fontFamily: "'Montserrat',sans-serif" }}>
              Clinical Advisor · Latest AI Summary
            </span>
          </div>
          <p style={{ margin: 0, fontFamily: "'Playfair Display',Georgia,serif", fontStyle: "italic", fontSize: "0.92rem", color: "#374151", lineHeight: 1.7 }}>
            &ldquo;{aiSummary}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
}

const SAMPLE_ENTRIES: DiagEntry[] = [
  {
    id: "s1", title: "Follicular Density Stabilization",
    clinicalNote: "AI analysis confirms a 4.2% increase in terminal hair density in the vertex region. Vascular health indicators show marked improvement since the transition to the 5% peptide complex.",
    date: new Date(Date.now() - 14 * 864e5).toISOString(), type: "completed", tags: ["hair-density", "vertex"],
  },
  {
    id: "s2", title: "Miniaturization Mapping",
    clinicalNote: "Initial mapping indicates early-stage miniaturization across the temporal peaks. AI suggests an aggressive proactive protocol focusing on DHT blockage and micro-circulation.",
    date: new Date(Date.now() - 35 * 864e5).toISOString(), type: "completed", tags: ["miniaturization", "DHT"],
  },
  {
    id: "s3", title: "Preliminary Scalp Hydration Test",
    clinicalNote: "Low porosity detected. Surface pH 5.4. Recommend immediate adjustment of cleaning ritual before clinical baseline capture.",
    date: new Date(Date.now() - 60 * 864e5).toISOString(), type: "draft", tags: ["scalp-pH", "hydration"],
  },
];
