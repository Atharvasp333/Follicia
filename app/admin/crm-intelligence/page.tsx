"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  AlertCircle,
  TrendingUp,
  Filter,
  Mail,
  User,
  Calendar,
  MessageSquare,
  Sparkles,
  Eye,
} from "lucide-react";
import FeedbackDetailModal from "@/components/admin/FeedbackDetailModal";

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
  aiCategory: "PAYMENT" | "PRODUCT" | "WEBSITE" | "DELIVERY" | null;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | null;
  aiSummary: string | null;
  urgencyScore: number | null;
  status: "NEW" | "REVIEWED" | "RESOLVED";
  createdAt: string;
}

const CATEGORY_COLORS = {
  PAYMENT: "#E63946",
  PRODUCT: "#2A9D8F",
  WEBSITE: "#F77F00",
  DELIVERY: "#06AED5",
};

const SENTIMENT_COLORS = {
  POSITIVE: "#06D6A0",
  NEUTRAL: "#FFD166",
  NEGATIVE: "#EF476F",
};

export default function CRMIntelligencePage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  useEffect(() => {
    if (statusFilter === "ALL") {
      setFilteredFeedback(feedbackList);
    } else {
      setFilteredFeedback(
        feedbackList.filter((f) => f.status === statusFilter)
      );
    }
  }, [statusFilter, feedbackList]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      const data = await response.json();
      setFeedbackList(data.feedback || []);
      setFilteredFeedback(data.feedback || []);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate category distribution
  const categoryData = Object.entries(
    filteredFeedback.reduce((acc, f) => {
      if (f.aiCategory) {
        acc[f.aiCategory] = (acc[f.aiCategory] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Calculate sentiment stats
  const sentimentStats = filteredFeedback.reduce(
    (acc, f) => {
      if (f.sentiment) {
        acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const getUrgencyColor = (score: number | null) => {
    if (!score) return B.lightGray;
    if (score >= 9) return "#DC2626"; // Deep Red
    if (score >= 7) return "#F59E0B"; // Orange
    if (score >= 5) return "#FCD34D"; // Yellow
    if (score >= 3) return "#A7F3D0"; // Light Green
    return "#6EE7B7"; // Soft Green
  };

  const getUrgencyLabel = (score: number | null) => {
    if (!score) return "N/A";
    if (score >= 9) return "CRITICAL";
    if (score >= 7) return "HIGH";
    if (score >= 5) return "MEDIUM";
    return "LOW";
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh feedback list
        fetchFeedback();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleRowClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: B.offWhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles size={48} color={B.seafoam} />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: B.offWhite,
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "2rem" }}
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
            CRM Intelligence Dashboard
          </h1>
          <p style={{ fontSize: "1.1rem", color: B.bodyText }}>
            AI-powered customer feedback analysis
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: B.bodyText,
                marginBottom: "0.5rem",
              }}
            >
              Total Feedback
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: B.forestTeal,
              }}
            >
              {filteredFeedback.length}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: B.bodyText,
                marginBottom: "0.5rem",
              }}
            >
              Positive
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: SENTIMENT_COLORS.POSITIVE,
              }}
            >
              {sentimentStats.POSITIVE || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: B.bodyText,
                marginBottom: "0.5rem",
              }}
            >
              Negative
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: SENTIMENT_COLORS.NEGATIVE,
              }}
            >
              {sentimentStats.NEGATIVE || 0}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                color: B.bodyText,
                marginBottom: "0.5rem",
              }}
            >
              Avg Urgency
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                color: B.seafoam,
              }}
            >
              {filteredFeedback.length > 0
                ? (
                    filteredFeedback.reduce(
                      (sum, f) => sum + (f.urgencyScore || 0),
                      0
                    ) / filteredFeedback.length
                  ).toFixed(1)
                : "0"}
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Category Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "500",
                color: B.forestTeal,
                marginBottom: "1.5rem",
              }}
            >
              Feedback by Category
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          CATEGORY_COLORS[
                            entry.name as keyof typeof CATEGORY_COLORS
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: B.midGray,
                }}
              >
                No data available
              </div>
            )}
          </motion.div>

          {/* Sentiment Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "500",
                color: B.forestTeal,
                marginBottom: "1.5rem",
              }}
            >
              Sentiment Analysis
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {Object.entries(sentimentStats).map(([sentiment, count]) => (
                <div key={sentiment}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ color: B.darkText, fontWeight: "500" }}>
                      {sentiment}
                    </span>
                    <span style={{ color: B.bodyText }}>{count}</span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: B.lightGray,
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(count / filteredFeedback.length) * 100}%`,
                        background:
                          SENTIMENT_COLORS[
                            sentiment as keyof typeof SENTIMENT_COLORS
                          ],
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Filter size={20} color={B.seafoam} />
          <span style={{ color: B.darkText, fontWeight: "500" }}>
            Filter by Status:
          </span>
          {["ALL", "NEW", "REVIEWED", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                background:
                  statusFilter === status
                    ? `linear-gradient(135deg, ${B.seafoam}, ${B.forestTeal})`
                    : B.cream,
                color: statusFilter === status ? "white" : B.bodyText,
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {status}
            </button>
          ))}
        </motion.div>

        {/* Feedback Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(13, 59, 68, 0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: B.cream }}>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    Urgency
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    Sentiment
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    AI Summary
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "1rem",
                      textAlign: "left",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: B.forestTeal,
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((feedback, index) => (
                  <motion.tr
                    key={feedback.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      borderBottom: `1px solid ${B.lightGray}`,
                      background: getUrgencyColor(feedback.urgencyScore) + "15",
                      cursor: "pointer",
                    }}
                    whileHover={{ backgroundColor: B.cream }}
                    onClick={() => handleRowClick(feedback)}
                  >
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          background: getUrgencyColor(feedback.urgencyScore),
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                        }}
                      >
                        <AlertCircle size={14} />
                        {feedback.urgencyScore || "N/A"} -{" "}
                        {getUrgencyLabel(feedback.urgencyScore)}
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.25rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: B.darkText,
                            fontWeight: "500",
                          }}
                        >
                          <User size={14} />
                          {feedback.userName || "Anonymous"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            color: B.bodyText,
                            fontSize: "0.85rem",
                          }}
                        >
                          <Mail size={12} />
                          {feedback.userEmail || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "8px",
                          background: feedback.aiCategory
                            ? CATEGORY_COLORS[feedback.aiCategory] + "20"
                            : B.lightGray,
                          color: feedback.aiCategory
                            ? CATEGORY_COLORS[feedback.aiCategory]
                            : B.bodyText,
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {feedback.aiCategory || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "8px",
                          background: feedback.sentiment
                            ? SENTIMENT_COLORS[feedback.sentiment] + "20"
                            : B.lightGray,
                          color: feedback.sentiment
                            ? SENTIMENT_COLORS[feedback.sentiment]
                            : B.bodyText,
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {feedback.sentiment || "N/A"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        maxWidth: "300px",
                        color: B.bodyText,
                        fontSize: "0.9rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "start",
                          gap: "0.5rem",
                        }}
                      >
                        <MessageSquare size={14} style={{ marginTop: "0.2rem", flexShrink: 0 }} />
                        <span>{feedback.aiSummary || "No summary"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "8px",
                          background:
                            feedback.status === "NEW"
                              ? "#FEF3C7"
                              : feedback.status === "REVIEWED"
                              ? "#DBEAFE"
                              : "#D1FAE5",
                          color:
                            feedback.status === "NEW"
                              ? "#92400E"
                              : feedback.status === "REVIEWED"
                              ? "#1E40AF"
                              : "#065F46",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {feedback.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: B.bodyText,
                          fontSize: "0.85rem",
                        }}
                      >
                        <Calendar size={14} />
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFeedback.length === 0 && (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: B.midGray,
              }}
            >
              No feedback found for the selected filter.
            </div>
          )}
        </motion.div>
      </div>

      {/* Feedback Detail Modal */}
      <FeedbackDetailModal
        feedback={selectedFeedback}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
