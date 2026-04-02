"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Eye, EyeOff, Leaf, Shield } from "lucide-react";

export default function AdminAuthPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
        // Trigger shake animation
        setShake(true);
        setTimeout(() => setShake(false), 650);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      // Trigger shake animation
      setShake(true);
      setTimeout(() => setShake(false), 650);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0D3B44 0%, #1A5A68 100%)",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Laboratory Plus-Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(42,157,143,0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          x: shake ? [0, -10, 10, -10, 10, -5, 5, 0] : 0,
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1],
          x: { duration: 0.6, ease: "easeInOut" }
        }}
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#FFFFFF",
          borderRadius: "1.75rem",
          padding: "3.5rem 3rem",
          boxShadow: "0 40px 100px rgba(0,0,0,0.4), 0 20px 50px rgba(13,59,68,0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo & Title */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3, 
              type: "spring", 
              stiffness: 200,
              damping: 15,
            }}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0D3B44, #2A9D8F)",
              border: "4px solid rgba(212,175,55,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              boxShadow: "0 12px 32px rgba(13,59,68,0.3), 0 0 0 8px rgba(42,157,143,0.1)",
            }}
          >
            <Shield size={36} color="#D4AF37" strokeWidth={2.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0D3B44",
              marginBottom: "0.5rem",
              letterSpacing: "0.02em",
            }}
          >
            Admin Access
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.95rem",
              color: "#9AABA5",
            }}
          >
            Follicia Laboratory Dashboard
          </motion.p>
        </div>

        {/* Error Message with Animation */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "0.875rem",
                background: "rgba(239,68,68,0.08)",
                border: "1.5px solid rgba(239,68,68,0.25)",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#DC2626",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Admin ID Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <label
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0D3B44",
                marginBottom: "0.625rem",
              }}
            >
              Admin Identity
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={18}
                color="#9AABA5"
                style={{
                  position: "absolute",
                  left: "1.125rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter admin ID"
                required
                style={{
                  width: "100%",
                  padding: "1rem 1.125rem 1rem 3.25rem",
                  borderRadius: "0.875rem",
                  border: "2px solid #E8EDEB",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "#FAFCFB",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2A9D8F";
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(42,157,143,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E8EDEB";
                  e.currentTarget.style.background = "#FAFCFB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ marginBottom: "2rem" }}
          >
            <label
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#0D3B44",
                marginBottom: "0.625rem",
              }}
            >
              Access Key
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                color="#9AABA5"
                style={{
                  position: "absolute",
                  left: "1.125rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access key"
                required
                style={{
                  width: "100%",
                  padding: "1rem 3.25rem 1rem 3.25rem",
                  borderRadius: "0.875rem",
                  border: "2px solid #E8EDEB",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "#FAFCFB",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#2A9D8F";
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(42,157,143,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E8EDEB";
                  e.currentTarget.style.background = "#FAFCFB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: "absolute",
                  right: "1.125rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.375rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0.5rem",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(42,157,143,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#9AABA5" />
                ) : (
                  <Eye size={18} color="#9AABA5" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            whileHover={!isLoading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            style={{
              width: "100%",
              padding: "1.125rem",
              borderRadius: "0.875rem",
              background: isLoading
                ? "#9AABA5"
                : "linear-gradient(135deg, #0D3B44, #2A9D8F)",
              border: "none",
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.625rem",
              boxShadow: isLoading
                ? "none"
                : "0 12px 32px rgba(13,59,68,0.35), 0 4px 12px rgba(42,157,143,0.2)",
              transition: "all 0.3s ease",
            }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#FFFFFF",
                  }}
                />
                Authenticating...
              </>
            ) : (
              <>
                <Lock size={18} />
                Secure Access
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            marginTop: "2.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid #E8EDEB",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.625rem",
              marginBottom: "0.625rem",
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Leaf size={16} color="#2A9D8F" />
            </motion.div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: "#0D3B44",
                letterSpacing: "0.02em",
              }}
            >
              Follicia
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              color: "#9AABA5",
              margin: 0,
              fontWeight: 500,
            }}
          >
            Secure Laboratory Management System
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
