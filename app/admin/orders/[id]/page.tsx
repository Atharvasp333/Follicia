"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, MapPin, CreditCard, User, Mail, Phone } from "lucide-react";
import Link from "next/link";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  COMPLETED: { bg: "#D1FAE5", text: "#065F46" },
  PROCESSING: { bg: "#FEF3C7", text: "#92400E" },
  PENDING: { bg: "#DBEAFE", text: "#1E40AF" },
  SHIPPED: { bg: "#E0E7FF", text: "#3730A3" },
  CANCELLED: { bg: "#FEE2E2", text: "#991B1B" },
};

interface OrderDetails {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  shippingMethod: string | null;
  shippingCost: number;
  shippingName: string | null;
  shippingEmail: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPincode: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl: string | null;
    };
  }>;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrderDetails();
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: B.midGray }}>
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: B.midGray }}>
        Order not found
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 3rem", maxWidth: "1400px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/orders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: B.bodyText,
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: B.teal,
                marginBottom: "0.5rem",
              }}
            >
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9rem",
                color: B.bodyText,
              }}
            >
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updating}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
                border: `1px solid ${B.lightGray}`,
                background: "#FFFFFF",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: B.teal,
                cursor: "pointer",
              }}
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Order Items */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "2rem",
              border: `1px solid ${B.lightGray}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Package size={20} color={B.teal} />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: B.teal,
                }}
              >
                Order Items
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: B.cream,
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      background: B.lightGray,
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
                      <Package size={24} color={B.midGray} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: B.teal,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.product.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.8rem",
                        color: B.midGray,
                      }}
                    >
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: B.teal,
                    }}
                  >
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "2rem",
              border: `1px solid ${B.lightGray}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <MapPin size={20} color={B.teal} />
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: B.teal,
                }}
              >
                Shipping Address
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <InfoRow icon={<User size={16} />} label="Name" value={order.shippingName || "N/A"} />
              <InfoRow icon={<Mail size={16} />} label="Email" value={order.shippingEmail || "N/A"} />
              <InfoRow icon={<Phone size={16} />} label="Phone" value={order.shippingPhone || "N/A"} />
              <InfoRow
                icon={<MapPin size={16} />}
                label="Address"
                value={
                  order.shippingAddress
                    ? `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`
                    : "N/A"
                }
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Order Summary */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "2rem",
              border: `1px solid ${B.lightGray}`,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: B.teal,
                marginBottom: "1.5rem",
              }}
            >
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.9rem",
                    color: B.bodyText,
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: B.teal,
                  }}
                >
                  ₹{(order.totalAmount - order.shippingCost).toLocaleString("en-IN")}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.9rem",
                    color: B.bodyText,
                  }}
                >
                  Shipping ({order.shippingMethod || "standard"})
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: order.shippingCost === 0 ? B.seafoam : B.teal,
                  }}
                >
                  {order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}
                </span>
              </div>
            </div>

            <div
              style={{
                paddingTop: "1rem",
                borderTop: `2px solid ${B.lightGray}`,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: B.teal,
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: B.teal,
                }}
              >
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "2rem",
              border: `1px solid ${B.lightGray}`,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: B.teal,
                marginBottom: "1.5rem",
              }}
            >
              Customer
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: B.seafoam,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                {order.user.name?.charAt(0).toUpperCase() || order.user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: B.teal,
                    marginBottom: "0.25rem",
                  }}
                >
                  {order.user.name || "Guest"}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8rem",
                    color: B.midGray,
                  }}
                >
                  {order.user.email}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                borderRadius: "8px",
                background: statusColors[order.status]?.bg || statusColors.PENDING.bg,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: statusColors[order.status]?.text || statusColors.PENDING.text,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem",
                }}
              >
                Status
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: statusColors[order.status]?.text || statusColors.PENDING.text,
                }}
              >
                {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
      <div style={{ color: B.midGray, marginTop: "0.125rem" }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.75rem",
            color: B.midGray,
            marginBottom: "0.25rem",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: B.teal,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
