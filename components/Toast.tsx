"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, AlertCircle } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: "success" | "error" | "warning";
}

export default function Toast({ 
  message, 
  isVisible, 
  onClose, 
  duration = 3000,
  type = "success" 
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      color: "#2A9D8F",
      bg: "rgba(42,157,143,0.1)",
    },
    error: {
      icon: AlertCircle,
      color: "#EF4444",
      bg: "rgba(239,68,68,0.1)",
    },
    warning: {
      icon: AlertCircle,
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.1)",
    },
  };

  const { icon: Icon, color, bg } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            background: "#FFFFFF",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 12px 40px rgba(13,59,68,0.15)",
            border: "1px solid #E8EDEB",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "300px",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={color} />
          </div>
          <p
            style={{
              flex: 1,
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              color: "#0D3B44",
              fontWeight: 500,
            }}
          >
            {message}
          </p>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#9AABA5",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
