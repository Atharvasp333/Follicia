"use client";

import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";

interface PointsBalanceProps {
  points: number;
  compact?: boolean;
}

export default function PointsBalance({ points, compact = false }: PointsBalanceProps) {
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    // Animate points counting up
    const duration = 1000;
    const steps = 30;
    const increment = points / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), points);
      setDisplayPoints(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayPoints(points);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [points]);

  if (compact) {
    return (
      <div
        style={{
          padding: "0.75rem 1rem",
          margin: "0 0.5rem",
          borderRadius: "10px",
          background: "linear-gradient(135deg, rgba(42,157,143,0.12), rgba(42,157,143,0.06))",
          border: "1px solid rgba(42,157,143,0.25)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Coins size={18} color="#2A9D8F" />
        </motion.div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.62rem",
              color: "rgba(42,157,143,0.7)",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "2px",
            }}
          >
            Points Balance
          </div>
          <motion.div
            key={displayPoints}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#2A9D8F",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
              display: "inline-block",
            }}
          >
            {/* Shimmer effect */}
            <span
              style={{
                background: "linear-gradient(90deg, #2A9D8F 0%, #4DBCB0 50%, #2A9D8F 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s ease-in-out infinite",
              }}
            >
              {displayPoints.toLocaleString()}
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "1.25rem",
        borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(42,157,143,0.15), rgba(42,157,143,0.08))",
        border: "1.5px solid rgba(42,157,143,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Coins size={20} color="#2A9D8F" />
        </motion.div>
        <span
          style={{
            fontSize: "0.7rem",
            color: "rgba(42,157,143,0.8)",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Loyalty Points
        </span>
      </div>
      <motion.div
        key={displayPoints}
        initial={{ scale: 1.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          fontFamily: "'Inter', sans-serif",
          position: "relative",
        }}
      >
        {/* Shimmer effect on the number */}
        <span
          style={{
            background: "linear-gradient(90deg, #2A9D8F 0%, #4DBCB0 40%, #2A9D8F 60%, #4DBCB0 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        >
          {displayPoints.toLocaleString()}
        </span>
      </motion.div>
      <div
        style={{
          fontSize: "0.72rem",
          color: "rgba(42,157,143,0.65)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Redeem for exclusive rewards
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </motion.div>
  );
}
