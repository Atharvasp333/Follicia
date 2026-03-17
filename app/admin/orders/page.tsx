"use client";

import { useState, useEffect } from "react";
import { Search, Bell, X, MapPin, User, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
};

interface Order {
  id: string;
  userId: string;
  user: {
    name: string | null;
    email: string;
    hairType: string | null;
    porosity: string | null;
    scalpCondition: string | null;
  };
  status: string;
  totalAmount: number;
  shippingCost: number;
  shippingName: string | null;
  shippingEmail: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPincode: string | null;
  shippingMethod: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl: string | null;
      description: string | null;
    };
  }>;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  COMPLETED: { bg: "#D1FAE5", text: "#065F46" },
  DELIVERED: { bg: "#D1FAE5", text: "#065F46" },
  PROCESSING: { bg: "#FEF3C7", text: "#92400E" },
  SHIPPED: { bg: "#DBEAFE", text: "#1E40AF" },
  PENDING: { bg: "#E0E7FF", text: "#3730A3" },
  CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updatedOrder = orders.find(o => o.id === orderId);
          if (updatedOrder) {
            setSelectedOrder({ ...updatedOrder, status: newStatus });
          }
        }
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem 3rem", maxWidth: "1600px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
        <div style={{ flex: 1, maxWidth: "500px", position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: B.midGray,
            }}
          />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 3rem",
              borderRadius: "12px",
              border: `1px solid ${B.lightGray}`,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.9rem",
              outline: "none",
              background: "#FFFFFF",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              border: `1px solid ${B.lightGray}`,
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Bell size={18} color={B.bodyText} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: B.teal,
                  marginBottom: "0.125rem",
                }}
              >
                Admin User
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.75rem",
                  color: B.midGray,
                }}
              >
                Store Manager
              </p>
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2A9D8F, #4DBCB0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: 600,
                color: "#FFFFFF",
              }}
            >
              AD
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: B.teal,
          }}
        >
          Order Management
        </h1>
      </div>

      {/* Orders Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: `1px solid ${B.lightGray}`,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: B.midGray }}>Loading orders...</div>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: B.cream }}>
                  {["ORDER ID", "CUSTOMER", "DATE", "TOTAL", "STATUS", "ACTIONS"].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "1rem 1.5rem",
                        textAlign: "left",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: B.midGray,
                        textTransform: "uppercase",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: `1px solid ${B.lightGray}`,
                    }}
                  >
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: B.teal,
                      }}
                    >
                      #FL-{order.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: B.teal,
                            marginBottom: "0.125rem",
                          }}
                        >
                          {order.user.name || "Guest"}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.75rem",
                            color: B.midGray,
                          }}
                        >
                          {order.user.email}
                        </p>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.85rem",
                        color: B.bodyText,
                      }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1.5rem",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: B.teal,
                      }}
                    >
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <span
                        style={{
                          padding: "0.375rem 0.875rem",
                          borderRadius: "6px",
                          background: statusColors[order.status]?.bg || statusColors.PENDING.bg,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: statusColors[order.status]?.text || statusColors.PENDING.text,
                        }}
                      >
                        {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "6px",
                          border: `1px solid ${B.lightGray}`,
                          background: "#FFFFFF",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          color: B.bodyText,
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1.5rem 2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  color: B.midGray,
                }}
              >
                Showing 1 to {Math.min(10, filteredOrders.length)} of {filteredOrders.length} entries
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "6px",
                      background: page === 1 ? B.teal : "#FFFFFF",
                      border: `1px solid ${B.lightGray}`,
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: page === 1 ? B.offWhite : B.bodyText,
                      cursor: "pointer",
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}) {
  if (!order) return null;

  const subtotal = order.totalAmount - order.shippingCost;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            maxWidth: "900px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: B.teal,
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: B.offWhite,
                  marginBottom: "0.25rem",
                }}
              >
                Order #FL-{order.id.slice(0, 6).toUpperCase()}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                STATUS: {order.status}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: B.offWhite,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: "auto", padding: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem" }}>
              {/* Left Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Customer Hair Profile */}
                <div
                  style={{
                    background: B.cream,
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <User size={18} color={B.teal} />
                    <h3
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: B.teal,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Customer Hair Profile
                    </h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <ProfileRow label="Hair Type" value={order.user.hairType || "Not specified"} />
                    <ProfileRow label="Porosity" value={order.user.porosity || "Not specified"} />
                    <ProfileRow label="Scalp Condition" value={order.user.scalpCondition || "Not specified"} />
                  </div>
                </div>

                {/* Shipping Address */}
                <div
                  style={{
                    background: B.cream,
                    borderRadius: "12px",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <MapPin size={18} color={B.teal} />
                    <h3
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: B.teal,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Shipping Address
                    </h3>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.85rem",
                      color: B.bodyText,
                      lineHeight: 1.6,
                    }}
                  >
                    <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{order.shippingName}</p>
                    <p>{order.shippingAddress}</p>
                    <p>
                      {order.shippingCity}, {order.shippingState} {order.shippingPincode}
                    </p>
                    <p style={{ marginTop: "0.5rem", color: B.midGray }}>
                      Method: {order.shippingMethod || "Standard"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Line Items */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Package size={18} color={B.teal} />
                  <h3
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: B.teal,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Line Items ({order.items.length})
                  </h3>
                </div>

                <div
                  style={{
                    background: B.cream,
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${B.lightGray}` }}>
                        <th
                          style={{
                            padding: "0.75rem 0.5rem",
                            textAlign: "left",
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: B.midGray,
                            textTransform: "uppercase",
                          }}
                        >
                          Product
                        </th>
                        <th
                          style={{
                            padding: "0.75rem 0.5rem",
                            textAlign: "center",
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: B.midGray,
                            textTransform: "uppercase",
                          }}
                        >
                          Qty
                        </th>
                        <th
                          style={{
                            padding: "0.75rem 0.5rem",
                            textAlign: "right",
                            fontFamily: "var(--font-montserrat), sans-serif",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: B.midGray,
                            textTransform: "uppercase",
                          }}
                        >
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: `1px solid ${B.lightGray}` }}>
                          <td style={{ padding: "1rem 0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "8px",
                                  background: "#FEF3C7",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  overflow: "hidden",
                                }}
                              >
                                {item.product.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                ) : (
                                  <Package size={20} color="#D97706" />
                                )}
                              </div>
                              <div>
                                <p
                                  style={{
                                    fontFamily: "var(--font-inter), sans-serif",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: B.teal,
                                    marginBottom: "0.125rem",
                                  }}
                                >
                                  {item.product.name}
                                </p>
                                {item.product.description && (
                                  <p
                                    style={{
                                      fontFamily: "var(--font-inter), sans-serif",
                                      fontSize: "0.7rem",
                                      color: B.midGray,
                                    }}
                                  >
                                    {item.product.description.slice(0, 30)}...
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "1rem 0.5rem",
                              textAlign: "center",
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: B.bodyText,
                            }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            style={{
                              padding: "1rem 0.5rem",
                              textAlign: "right",
                              fontFamily: "var(--font-montserrat), sans-serif",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: B.teal,
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Order Summary */}
                <div
                  style={{
                    background: B.teal,
                    borderRadius: "12px",
                    padding: "1.5rem",
                    color: B.offWhite,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem" }}>
                      Subtotal
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.85rem" }}>
                      Shipping
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      ${order.shippingCost.toFixed(2)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                      }}
                    >
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: "1.5rem 2rem",
              borderTop: `1px solid ${B.lightGray}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: B.cream,
            }}
          >
            <button
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                border: `1px solid ${B.lightGray}`,
                background: "#FFFFFF",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: B.bodyText,
                cursor: "pointer",
              }}
            >
              Print Invoice
            </button>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                background: B.seafoam,
                border: "none",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              <option value={order.status} disabled>
                Update Status
              </option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.75rem",
          color: B.midGray,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: B.teal,
        }}
      >
        {value}
      </span>
    </div>
  );
}
