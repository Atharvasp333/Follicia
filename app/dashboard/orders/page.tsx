"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Calendar, ChevronDown, ChevronUp,
  RotateCcw, Truck, CheckCircle2, Clock, XCircle,
  Star, Filter, ShoppingBag, Download, FileText, Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { useCart } from "@/contexts/CartContext";
import axios from "axios";

interface OrderItemData {
  id: string; quantity: number; price: number;
  product: { id: string; name: string; imageUrl: string | null; category: string | null; priceDisplay: string | null; };
}
interface Order {
  id: string; status: string; totalAmount: number; shippingCity: string | null;
  createdAt: string; items: OrderItemData[];
  razorpayInvoiceId: string | null; invoiceUrl: string | null; invoiceGeneratedAt: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; Icon: React.ElementType }> = {
  PAID:       { label: "Paid", bg: "rgba(34,197,94,0.1)", color: "#22C55E", Icon: CheckCircle2 },
  DELIVERED:  { label: "Delivered", bg: "rgba(42,157,143,0.1)", color: "#2A9D8F", Icon: CheckCircle2 },
  PROCESSING: { label: "Processing", bg: "rgba(212,175,55,0.12)", color: "#D4AF37", Icon: Clock },
  SHIPPED:    { label: "Shipped",    bg: "rgba(59,130,246,0.1)", color: "#3B82F6", Icon: Truck },
  PENDING:    { label: "Pending",    bg: "rgba(156,163,175,0.15)", color: "#6B7280", Icon: Clock },
  CANCELLED:  { label: "Cancelled", bg: "rgba(239,68,68,0.1)",  color: "#EF4444", Icon: XCircle },
};

function SkeletonRow() {
  return (
    <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #F0F4F3", display: "flex", gap: "1rem" }}>
      {[60, 200, 100, 80].map((w, i) => (
        <div key={i} style={{ height: 14, width: w, borderRadius: 9999, background: "#F0F4F3", animation: "shimmer 1.5s infinite" }} />
      ))}
      <style>{`@keyframes shimmer{0%{background:#F0F4F3}50%{background:#E4EDEA}100%{background:#F0F4F3}}
        @keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        .animate-spin{animation:spin 1s linear infinite}`}</style>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const { addToCart } = useCart();
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const { Icon } = config;

  const handleReorder = async () => {
    for (const item of order.items) {
      await addToCart({
        productId: item.product.id, name: item.product.name, price: item.price,
        priceDisplay: item.product.priceDisplay || `₹${item.price.toLocaleString("en-IN")}`,
        imageUrl: item.product.imageUrl, category: item.product.category, quantity: item.quantity,
      });
    }
  };

  const handleDownloadInvoice = async () => {
    if (order.invoiceUrl) {
      // Open existing invoice
      window.open(order.invoiceUrl, '_blank');
      return;
    }

    // Generate invoice if it doesn't exist
    setGeneratingInvoice(true);
    try {
      const response = await axios.post('/api/razorpay/invoice', { orderId: order.id });
      if (response.data.success && response.data.invoiceUrl) {
        window.open(response.data.invoiceUrl, '_blank');
        // Refresh orders to update invoice status
        window.location.reload();
      } else {
        alert('Failed to generate invoice. Please try again.');
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      alert('Failed to generate invoice. Please contact support.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  const showInvoiceButton = order.status === 'PAID' || order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED';

  return (
    <motion.div layout style={{ borderBottom: "1px solid #F0F4F3", overflow: "hidden" }}>
      <div onClick={() => setExpanded(p => !p)} style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", cursor: "pointer" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${config.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Package size={16} color={config.color} />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0D3B44", fontFamily: "'Inter', sans-serif" }}>Order #{order.id.slice(-8).toUpperCase()}</div>
          <div style={{ fontSize: "0.72rem", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}{order.shippingCity ? ` · ${order.shippingCity}` : ""}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.71rem", color: "#9CA3AF", fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>
          <Calendar size={11} />{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
        <span style={{ padding: "4px 10px", borderRadius: 9999, fontSize: "0.68rem", fontWeight: 700, fontFamily: "'Montserrat',sans-serif", background: config.bg, color: config.color, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <Icon size={10} />{config.label}
        </span>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D3B44", fontFamily: "'Inter',sans-serif", flexShrink: 0 }}>₹{order.totalAmount.toLocaleString("en-IN")}</div>
        
        {/* Invoice Download Button */}
        {showInvoiceButton && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadInvoice();
            }}
            disabled={generatingInvoice}
            style={{
              padding: "6px 12px",
              borderRadius: 9999,
              background: order.invoiceUrl ? "rgba(42,157,143,0.1)" : "rgba(212,175,55,0.1)",
              border: order.invoiceUrl ? "1px solid rgba(42,157,143,0.3)" : "1px solid rgba(212,175,55,0.3)",
              color: order.invoiceUrl ? "#2A9D8F" : "#D4AF37",
              fontSize: "0.68rem",
              fontWeight: 700,
              fontFamily: "'Montserrat',sans-serif",
              cursor: generatingInvoice ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
              opacity: generatingInvoice ? 0.6 : 1,
            }}
            title={order.invoiceUrl ? "Download Invoice" : "Generate Invoice"}
          >
            {generatingInvoice ? (
              <><Loader2 size={10} className="animate-spin" /> Generating...</>
            ) : order.invoiceUrl ? (
              <><Download size={10} /> Invoice</>
            ) : (
              <><FileText size={10} /> Generate</>
            )}
          </motion.button>
        )}
        
        <div style={{ flexShrink: 0, color: "#9CA3AF" }}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ padding: "0 1.5rem 1.25rem", background: "#F8FAFB", borderTop: "1px solid #F0F4F3" }}>
            <div style={{ paddingTop: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.75rem", background: "white", borderRadius: 10, border: "1px solid #E8F0ED" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(42,157,143,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Star size={14} color="#2A9D8F" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0D3B44", fontFamily: "'Inter',sans-serif" }}>{item.product.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", fontFamily: "'Inter',sans-serif" }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem", color: "#0D3B44", fontFamily: "'Inter',sans-serif" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
              {order.status !== "CANCELLED" && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleReorder}
                  style={{ padding: "0.55rem 1.2rem", borderRadius: 9999, background: "#2A9D8F", border: "none", color: "white", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Montserrat',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <RotateCcw size={12} /> Reorder
                </motion.button>
              )}
              {showInvoiceButton && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadInvoice}
                  disabled={generatingInvoice}
                  style={{
                    padding: "0.55rem 1.2rem",
                    borderRadius: 9999,
                    background: order.invoiceUrl ? "#0D3B44" : "rgba(212,175,55,0.15)",
                    border: order.invoiceUrl ? "none" : "1px solid #D4AF37",
                    color: order.invoiceUrl ? "white" : "#D4AF37",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    fontFamily: "'Montserrat',sans-serif",
                    cursor: generatingInvoice ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    opacity: generatingInvoice ? 0.6 : 1,
                  }}
                >
                  {generatingInvoice ? (
                    <><Loader2 size={12} className="animate-spin" /> Generating Invoice...</>
                  ) : order.invoiceUrl ? (
                    <><Download size={12} /> Download Statement</>
                  ) : (
                    <><FileText size={12} /> Generate Invoice</>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrderArchivesPage() {
  const { dbUser } = useAuthModal();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    if (!dbUser?.id) return;
    axios.get(`/api/dashboard/orders?userId=${dbUser.id}`)
      .then(res => setOrders(res.data.orders || []))
      .catch(console.error).finally(() => setLoading(false));
  }, [dbUser?.id]);

  const totalSpend = orders.reduce((s, o) => s + o.totalAmount, 0);
  const filtered = filterStatus === "ALL" ? orders : orders.filter(o => o.status === filterStatus);

  const stats = [
    { label: "Total Investment", value: `₹${totalSpend.toLocaleString("en-IN")}`, icon: ShoppingBag },
    { label: "Orders Placed", value: orders.length.toString(), icon: Package },
    { label: "Delivered", value: orders.filter(o => o.status === "DELIVERED").length.toString(), icon: CheckCircle2 },
    { label: "Vial Tier", value: totalSpend > 100000 ? "Platinum" : totalSpend > 50000 ? "Gold" : "Silver", icon: Star },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: 1000 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Package size={13} color="#2A9D8F" />
          <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#2A9D8F", letterSpacing: "0.2em", textTransform: "uppercase" as const, fontFamily: "'Montserrat',sans-serif" }}>Procurement History</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 700, color: "#0D3B44", margin: 0 }}>Order Archives</h1>
        <p style={{ marginTop: 6, color: "#6B7280", fontSize: "0.85rem", fontFamily: "'Inter',sans-serif" }}>Review your scientific procurement history and reacquire essential follicle treatments.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {stats.map(stat => {
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

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        style={{ background: "white", borderRadius: 20, border: "1px solid #E8F0ED", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #F0F4F3", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Filter size={14} color="#6B7280" />
          {["ALL", "PAID", "DELIVERED", "PROCESSING", "SHIPPED", "PENDING", "CANCELLED"].map(s => {
            const active = filterStatus === s;
            const cfg = s === "ALL" ? null : STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "4px 10px", borderRadius: 9999, border: active ? `1.5px solid ${cfg?.color || "#0D3B44"}` : "1.5px solid #E8F0ED", background: active ? cfg?.bg || "rgba(13,59,68,0.08)" : "transparent", color: active ? cfg?.color || "#0D3B44" : "#6B7280", fontSize: "0.68rem", fontWeight: 600, fontFamily: "'Montserrat',sans-serif", cursor: "pointer" }}>
                {s === "ALL" ? "All" : cfg?.label}
              </button>
            );
          })}
        </div>

        {loading ? <div>{[1,2,3].map(i => <SkeletonRow key={i} />)}</div>
          : filtered.length > 0 ? filtered.map(o => <OrderRow key={o.id} order={o} />)
          : (
            <div style={{ padding: "3rem", textAlign: "center", color: "#9CA3AF", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem" }}>
              <Package size={36} style={{ opacity: 0.25, marginBottom: 12 }} />
              <p>No orders yet.</p>
              <Link href="/shop" style={{ color: "#2A9D8F", fontWeight: 600, textDecoration: "none" }}>Browse the Atelier →</Link>
            </div>
          )}
      </motion.div>
    </div>
  );
}
