"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";

// Ease curve for smooth framer-motion transitions
const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ready for Firebase integration: signInWithEmailAndPassword & createUserWithEmailAndPassword
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", email);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        console.log("Signed up:", email, name);
      }
      onClose();
    } catch (error) {
      console.error("Auth error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Logging in with Google");
      onClose();
    } catch (error) {
      console.error("Google Auth error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: E }}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#FAFCFB", // Clean off-white
              borderRadius: "1.5rem", // rounded-3xl approx
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              // Subtle stitch border effect
              border: "2px dashed #E5DDD9",
              padding: "2.5rem 2rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9AABA5",
              }}
            >
              <X size={20} />
            </button>

            {/* Header Text */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700,
                  fontSize: "1.75rem",
                  color: "#1A1A1A",
                  marginBottom: "0.5rem",
                }}
              >
                {tab === "login" ? "Welcome Back" : "Join Follicia"}
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.9rem",
                  color: "#6B7280",
                }}
              >
                {tab === "login"
                  ? "Sign in to access your regimen."
                  : "Begin your personalised hair journey."}
              </p>
            </div>

            {/* Toggle */}
            <div
              style={{
                display: "flex",
                background: "#F3F4F6",
                borderRadius: "9999px",
                padding: "0.25rem",
                marginBottom: "2rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0.25rem",
                  bottom: "0.25rem",
                  left: tab === "login" ? "0.25rem" : "50%",
                  width: "calc(50% - 0.25rem)",
                  background: "#FFFFFF",
                  borderRadius: "9999px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              />
              <button
                type="button"
                onClick={() => setTab("login")}
                style={{
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                  padding: "0.5rem",
                  background: "none",
                  border: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: tab === "login" ? "#A36B5E" : "#6B7280",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                style={{
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                  padding: "0.5rem",
                  background: "none",
                  border: "none",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: tab === "signup" ? "#A36B5E" : "#6B7280",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Form inputs with basic floating label styles applied via typical structure */}
              
              {tab === "signup" && (
                <div style={{ position: "relative" }} className="group">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "1.25rem 1rem 0.5rem",
                      borderRadius: "0.75rem",
                      border: "1px solid #D5E0DC",
                      background: "transparent",
                      fontSize: "0.95rem",
                      fontFamily: "'Inter', sans-serif",
                      color: "#1A1A1A",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#A36B5E")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#D5E0DC")}
                  />
                  <label
                    htmlFor="name"
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: name ? "0.35rem" : "0.95rem",
                      fontSize: name ? "0.7rem" : "0.95rem",
                      color: "#9AABA5",
                      fontFamily: "'Inter', sans-serif",
                      transition: "all 0.2s ease",
                      pointerEvents: "none",
                    }}
                  >
                    Full Name
                  </label>
                </div>
              )}

              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "1.25rem 1rem 0.5rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #D5E0DC",
                    background: "transparent",
                    fontSize: "0.95rem",
                    fontFamily: "'Inter', sans-serif",
                    color: "#1A1A1A",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#A36B5E")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D5E0DC")}
                />
                <label
                  htmlFor="email"
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: email ? "0.35rem" : "0.95rem",
                    fontSize: email ? "0.7rem" : "0.95rem",
                    color: "#9AABA5",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s ease",
                    pointerEvents: "none",
                  }}
                >
                  Email Address
                </label>
              </div>

              <div style={{ position: "relative", marginBottom: "0.25rem" }}>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "1.25rem 2.5rem 0.5rem 1rem",
                    borderRadius: "0.75rem",
                    border: "1px solid #D5E0DC",
                    background: "transparent",
                    fontSize: "0.95rem",
                    fontFamily: "'Inter', sans-serif",
                    color: "#1A1A1A",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#A36B5E")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#D5E0DC")}
                />
                <label
                  htmlFor="password"
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: password ? "0.35rem" : "0.95rem",
                    fontSize: password ? "0.7rem" : "0.95rem",
                    color: "#9AABA5",
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s ease",
                    pointerEvents: "none",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9AABA5",
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {tab === "login" && (
                <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
                  <button
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.8rem",
                      color: "#A36B5E",
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  borderRadius: "9999px",
                  background: loading ? "#C4A29B" : "#A36B5E", // Terracotta
                  color: "#FFFFFF",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: loading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  transition: "background 0.3s ease",
                }}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#6B7280" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
            </div>

            <button
              onClick={handleGoogleAuth}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "9999px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                color: "#1A1A1A",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
