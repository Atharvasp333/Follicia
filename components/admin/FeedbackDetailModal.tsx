"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Calendar, Star, MessageSquare } from "lucide-react";

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

interface Feedback {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  rawComment: string;
  rating: number | null;
  aiCategory: string | null;
  sentiment: string | null;
  aiSummary: string | null;
  urgencyScore: number | null;
  status: string;
  createdAt: string;
}

interface Props {
  feedback: Feedback | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function FeedbackDetailModal({
  feedback,
  isOpen,
  onClose,
  onStatusChange,
}: Props) {
  if (!feedback) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(13, 59, 68, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 1000,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "90vh",
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(13, 59, 68, 0.3)",
              zIndex: 1001,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "2rem",
                borderBottom: `1px solid ${B.lightGray}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  color: B.forestTeal,
                }}
              >
                Feedback Details
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = B.cream)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <X size={24} color={B.bodyText} />
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                padding: "2rem",
                maxHeight: "calc(90vh - 200px)",
                overflowY: "auto",
              }}
            >
              {/* Customer Info */}
              <div
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  background: B.cream,
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: B.forestTeal,
                    marginBottom: "1rem",
                  }}
                >
                  Customer Information
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <User size={18} color={B.seafoam} />
                    <span style={{ color: B.darkText }}>
                      {feedback.userName || "Anonymous"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Mail size={18} color={B.seafoam} />
                    <span style={{ color: B.darkText }}>
                      {feedback.userEmail || "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Calendar size={18} color={B.seafoam} />
                    <span style={{ color: B.darkText }}>
                      {new Date(feedback.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {feedback.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <Star size={18} color={B.seafoam} fill={B.seafoam} />
                      <span style={{ color: B.darkText }}>
                        {feedback.rating} / 5 stars
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Original Comment */}
              <div style={{ marginBottom: "2rem" }}>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: B.forestTeal,
                    marginBottom: "0.75rem",
                  }}
                >
                  Original Feedback
                </h3>
                <div
                  style={{
                    padding: "1.25rem",
                    background: B.offWhite,
                    borderRadius: "12px",
                    border: `1px solid ${B.lightGray}`,
                    color: B.darkText,
                    lineHeight: "1.6",
                  }}
                >
                  <MessageSquare
                    size={18}
                    color={B.seafoam}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  {feedback.rawComment}
                </div>
              </div>

              {/* AI Analysis */}
              <div
                style={{
                  padding: "1.5rem",
                  background: `linear-gradient(135deg, ${B.seafoam}10, ${B.forestTeal}05)`,
                  borderRadius: "12px",
                  border: `1px solid ${B.seafoam}30`,
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: B.forestTeal,
                    marginBottom: "1rem",
                  }}
                >
                  AI Analysis
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: B.bodyText,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Category
                    </div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: B.forestTeal,
                      }}
                    >
                      {feedback.aiCategory || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: B.bodyText,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Sentiment
                    </div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: B.forestTeal,
                      }}
                    >
                      {feedback.sentiment || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: B.bodyText,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Urgency Score
                    </div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: B.forestTeal,
                      }}
                    >
                      {feedback.urgencyScore || "N/A"} / 10
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: B.bodyText,
                        marginBottom: "0.25rem",
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        color: B.forestTeal,
                      }}
                    >
                      {feedback.status}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: B.bodyText,
                      marginBottom: "0.5rem",
                    }}
                  >
                    AI Summary
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: B.darkText,
                      lineHeight: "1.6",
                    }}
                  >
                    {feedback.aiSummary || "No summary available"}
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: B.forestTeal,
                    marginBottom: "0.75rem",
                  }}
                >
                  Update Status
                </h3>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {["NEW", "REVIEWED", "RESOLVED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(feedback.id, status);
                        onClose();
                      }}
                      disabled={feedback.status === status}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          feedback.status === status
                            ? B.lightGray
                            : `linear-gradient(135deg, ${B.seafoam}, ${B.forestTeal})`,
                        color: feedback.status === status ? B.midGray : "white",
                        fontWeight: "500",
                        cursor:
                          feedback.status === status
                            ? "not-allowed"
                            : "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
