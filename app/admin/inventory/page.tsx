"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Trash2,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { useInventoryStore } from "@/store/useInventoryStore";

export default function InventoryManagementPage() {
  const { 
    products, 
    loading, 
    syncWithDB, 
    updateStock, 
    toggleVisibility,
    resetAllStock,
    updateStockOptimistic 
  } = useInventoryStore();
  
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [resetting, setResetting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    syncWithDB();
  }, [syncWithDB]);

  // Initialize stock inputs when products load
  useEffect(() => {
    const initialInputs: Record<string, string> = {};
    products.forEach((p) => {
      initialInputs[p.id] = p.inventoryCount.toString();
    });
    setStockInputs(initialInputs);
  }, [products]);

  const handleSyncAll = async () => {
    setSyncing(true);
    await syncWithDB();
    setSyncing(false);
    alert("✅ Inventory synced with database!");
  };

  const handleStockInputChange = (productId: string, value: string) => {
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setStockInputs((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const handleStockUpdate = async (productId: string) => {
    const newValue = parseInt(stockInputs[productId] || "0");
    if (isNaN(newValue) || newValue < 0) return;

    setUpdating((prev) => ({ ...prev, [productId]: true }));
    await updateStock(productId, newValue);
    setUpdating((prev) => ({ ...prev, [productId]: false }));
  };

  const handleQuickRefill = async (productId: string) => {
    setUpdating((prev) => ({ ...prev, [productId]: true }));
    const newStock = 15;
    setStockInputs((prev) => ({ ...prev, [productId]: newStock.toString() }));
    await updateStock(productId, newStock);
    setUpdating((prev) => ({ ...prev, [productId]: false }));
  };

  const handleVisibilityToggle = async (productId: string, currentState: boolean) => {
    setUpdating((prev) => ({ ...prev, [productId]: true }));
    await toggleVisibility(productId, !currentState);
    setUpdating((prev) => ({ ...prev, [productId]: false }));
  };

  const handleResetAll = async () => {
    if (!confirm("Are you sure you want to reset ALL product stock to 0? This cannot be undone.")) {
      return;
    }
    
    setResetting(true);
    const success = await resetAllStock();
    setResetting(false);
    
    if (success) {
      alert("All product stock has been reset to 0");
    } else {
      alert("Failed to reset stock. Please try again.");
    }
  };

  const getStockStatus = (count: number, threshold: number) => {
    if (count === 0) return { 
      label: "Out of Stock", 
      color: "#EF4444", 
      bg: "rgba(239,68,68,0.1)",
      icon: AlertTriangle 
    };
    if (count < threshold) return { 
      label: "Low Stock", 
      color: "#F59E0B", 
      bg: "rgba(245,158,11,0.1)",
      icon: AlertCircle 
    };
    return { 
      label: "In Stock", 
      color: "#2A9D8F", 
      bg: "rgba(42,157,143,0.1)",
      icon: CheckCircle2 
    };
  };

  const getStockPercentage = (count: number, threshold: number) => {
    const max = threshold * 3; // Assume max is 3x threshold
    return Math.min((count / max) * 100, 100);
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ padding: "2rem", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF" }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: "0 auto 1rem" }} />
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <Package size={12} color="#2A9D8F" />
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                color: "#2A9D8F",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Inventory Control
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#0D3B44",
              margin: 0,
            }}
          >
            Stock Management
          </h1>
          <p style={{ marginTop: 4, color: "#6B7280", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>
            Real-time inventory tracking with direct stock control
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {/* Sync All Button */}
          <button
            onClick={handleSyncAll}
            disabled={syncing}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: syncing ? "#9CA3AF" : "#2A9D8F",
              border: "none",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              cursor: syncing ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            {syncing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            {syncing ? "Syncing..." : "Sync All"}
          </button>

          {/* Reset All Button */}
          <button
            onClick={handleResetAll}
            disabled={resetting}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: resetting ? "#9CA3AF" : "#EF4444",
              border: "none",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              cursor: resetting ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            {resetting ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {resetting ? "Resetting..." : "Reset All"}
          </button>
        </div>
      </motion.div>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid #E8F0ED",
          overflow: "hidden",
        }}
      >
        {/* Table Header */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            borderBottom: "1px solid #F0F4F3",
            display: "grid",
            gridTemplateColumns: "2.5fr 1fr 1.5fr 1fr 0.8fr 1.5fr",
            gap: "0.85rem",
            fontWeight: 600,
            fontSize: "0.65rem",
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <div>Product</div>
          <div style={{ textAlign: "center" }}>Category</div>
          <div style={{ textAlign: "center" }}>Stock Controller</div>
          <div style={{ textAlign: "center" }}>Status</div>
          <div style={{ textAlign: "center" }}>Visible</div>
          <div style={{ textAlign: "center" }}>Actions</div>
        </div>

        {/* Table Body */}
        {products.map((product, index) => {
          const status = getStockStatus(product.inventoryCount, product.lowStockThreshold);
          const stockPercentage = getStockPercentage(product.inventoryCount, product.lowStockThreshold);
          const isUpdating = updating[product.id];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              style={{
                padding: "1rem 1.25rem",
                borderBottom: index < products.length - 1 ? "1px solid #F0F4F3" : "none",
                display: "grid",
                gridTemplateColumns: "2.5fr 1fr 1.5fr 1fr 0.8fr 1.5fr",
                gap: "0.85rem",
                alignItems: "center",
                background: !product.isActive 
                  ? "rgba(156,163,175,0.05)" 
                  : product.inventoryCount === 0 
                  ? "rgba(239,68,68,0.03)" 
                  : product.inventoryCount < product.lowStockThreshold 
                  ? "rgba(245,158,11,0.03)" 
                  : "transparent",
                opacity: !product.isActive ? 0.6 : 1,
              }}
            >
              {/* Product Info */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: product.imageUrl ? "#F0F4F3" : "#F0F4F3",
                    backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    flexShrink: 0,
                    border: "2px solid #E8F0ED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {!product.imageUrl && (
                    <Package size={20} color="#9CA3AF" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#0D3B44",
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div style={{ textAlign: "center" }}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    background: "#F0F4F3",
                    color: "#0D3B44",
                    display: "inline-block",
                  }}
                >
                  {product.category || "General"}
                </span>
              </div>

              {/* Stock Controller */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {/* Progress Bar */}
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: "100%",
                      height: 6,
                      background: "#F0F4F3",
                      borderRadius: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${stockPercentage}%`,
                        height: "100%",
                        background: status.color,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Direct Input */}
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  <input
                    type="text"
                    value={stockInputs[product.id] || "0"}
                    onChange={(e) => handleStockInputChange(product.id, e.target.value)}
                    onBlur={() => handleStockUpdate(product.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleStockUpdate(product.id);
                    }}
                    disabled={isUpdating}
                    style={{
                      flex: 1,
                      padding: "5px 8px",
                      borderRadius: 6,
                      border: "1.5px solid #E8F0ED",
                      textAlign: "center",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      color: status.color,
                      background: "white",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#2A9D8F";
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.borderColor = "#E8F0ED";
                    }}
                  />
                  <span style={{ fontSize: "0.65rem", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
                    units
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: 9999,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    fontFamily: "'Montserrat', sans-serif",
                    background: status.bg,
                    color: status.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    whiteSpace: "nowrap",
                  }}
                >
                  <StatusIcon size={11} />
                  {status.label}
                </span>
              </div>

              {/* Visibility Toggle */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => handleVisibilityToggle(product.id, product.isActive)}
                  disabled={isUpdating}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: "1px solid #E8F0ED",
                    background: product.isActive ? "rgba(42,157,143,0.1)" : "rgba(156,163,175,0.1)",
                    color: product.isActive ? "#2A9D8F" : "#9CA3AF",
                    cursor: isUpdating ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                  title={product.isActive ? "Hide from customers" : "Show to customers"}
                >
                  {product.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                {/* Refill Button */}
                <button
                  onClick={() => handleQuickRefill(product.id)}
                  disabled={isUpdating}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: isUpdating ? "#E8F0ED" : "rgba(42,157,143,0.1)",
                    border: "1px solid rgba(42,157,143,0.3)",
                    color: isUpdating ? "#9CA3AF" : "#2A9D8F",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    fontFamily: "'Montserrat', sans-serif",
                    cursor: isUpdating ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isUpdating ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    <RefreshCw size={12} />
                  )}
                  Refill (15)
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          marginTop: "1.25rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.85rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1.25rem",
            borderRadius: 12,
            border: "1px solid #E8F0ED",
          }}
        >
          <div style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: "'Montserrat', sans-serif", marginBottom: 6 }}>
            Total Products
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0D3B44", fontFamily: "'Inter', sans-serif" }}>
            {products.length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.25rem",
            borderRadius: 12,
            border: "1px solid #E8F0ED",
          }}
        >
          <div style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: "'Montserrat', sans-serif", marginBottom: 6 }}>
            Out of Stock
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#EF4444", fontFamily: "'Inter', sans-serif" }}>
            {products.filter((p) => p.inventoryCount === 0).length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.25rem",
            borderRadius: 12,
            border: "1px solid #E8F0ED",
          }}
        >
          <div style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: "'Montserrat', sans-serif", marginBottom: 6 }}>
            Low Stock
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#F59E0B", fontFamily: "'Inter', sans-serif" }}>
            {products.filter((p) => p.inventoryCount > 0 && p.inventoryCount < p.lowStockThreshold).length}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "1.25rem",
            borderRadius: 12,
            border: "1px solid #E8F0ED",
          }}
        >
          <div style={{ fontSize: "0.65rem", color: "#6B7280", fontFamily: "'Montserrat', sans-serif", marginBottom: 6 }}>
            Hidden Products
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
            {products.filter((p) => !p.isActive).length}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
