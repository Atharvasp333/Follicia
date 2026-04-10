"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, Send, CheckCircle } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthModalContext";

const B = {
  forestTeal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
  darkText: "#2C4A42",
};

export default function FeedbackPage() {
  const { currentUser, dbUser } = useAuthModal();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !rating) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawComment: comment,
          rating: rating,
          firebaseUid: currentUser?.uid || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setComment("");
        setRating(0);
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        alert(result.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: B.offWhite,
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "300",
              color: B.forestTeal,
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Share Your Experience
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: B.bodyText,
              marginBottom: "1rem",
            }}
          >
            Your feedback helps us craft better hair care solutions
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: `linear-gradient(135deg, ${B.seafoam}15, ${B.forestTeal}10)`,
              borderRadius: "50px",
              border: `1px solid ${B.seafoam}30`,
            }}
          >
            <Sparkles size={16} color={B.seafoam} />
            <span
              style={{
                fontSize: "0.85rem",
                color: B.forestTeal,
                fontWeight: "500",
              }}
            >
              AI-Powered Analysis
            </span>
          </div>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "3rem",
            boxShadow: "0 4px 24px rgba(13, 59, 68, 0.08)",
            border: `1px solid ${B.lightGray}`,
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  color: B.darkText,
                  marginBottom: "1rem",
                }}
              >
                How would you rate your experience?
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.5rem",
                    }}
                  >
                    <Star
                      size={32}
                      fill={
                        star <= (hoveredRating || rating)
                          ? B.seafoam
                          : "transparent"
                      }
                      color={
                        star <= (hoveredRating || rating)
                          ? B.seafoam
                          : B.midGray
                      }
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  color: B.darkText,
                  marginBottom: "1rem",
                }}
              >
                Tell us more about your experience
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts, suggestions, or concerns..."
                required
                style={{
                  width: "100%",
                  minHeight: "180px",
                  padding: "1.25rem",
                  fontSize: "1rem",
                  color: B.darkText,
                  background: B.cream,
                  border: `2px solid ${B.lightGray}`,
                  borderRadius: "16px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  lineHeight: "1.6",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = B.seafoam;
                  e.target.style.background = "white";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = B.lightGray;
                  e.target.style.background = B.cream;
                }}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !comment.trim() || !rating}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                fontSize: "1.05rem",
                fontWeight: "500",
                color: "white",
                background: isSubmitting
                  ? B.midGray
                  : `linear-gradient(135deg, ${B.seafoam}, ${B.forestTeal})`,
                border: "none",
                borderRadius: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem",
                transition: "all 0.3s ease",
              }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles size={20} />
                  </motion.div>
                  Analyzing with AI...
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle size={20} />
                  Submitted Successfully!
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Feedback
                </>
              )}
            </motion.button>
          </form>

          {/* Success Message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: `${B.seafoam}15`,
                borderRadius: "12px",
                border: `1px solid ${B.seafoam}30`,
                textAlign: "center",
                color: B.forestTeal,
              }}
            >
              Thank you! Our AI has analyzed your feedback and our team will
              review it shortly.
            </motion.div>
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: `linear-gradient(135deg, ${B.forestTeal}05, ${B.seafoam}05)`,
            borderRadius: "16px",
            border: `1px solid ${B.lightGray}`,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.9rem", color: B.bodyText, lineHeight: 1.6 }}>
            Your feedback is automatically analyzed by our AI to ensure we
            address your concerns promptly and effectively.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
