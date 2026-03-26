"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Lock,
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle,
  ArrowRight,
  Home,
  Sparkles,
  Shield,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuthModal } from "@/contexts/AuthModalContext";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ── Brand Constants ──────────────────────────────────────── */
const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  gold: "#D4AF37",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  borderGray: "#D5E0DC",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
};

type ShippingMethod = "standard" | "express";

interface CheckoutFormData {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

/* ── Success Modal ──────────────────────────────────────── */
function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(13,59,68,0.75)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: E }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "1.5rem",
              padding: "3rem 2.5rem",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2A9D8F, #4DBCB0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                boxShadow: "0 12px 32px rgba(42,157,143,0.3)",
              }}
            >
              <CheckCircle size={40} color="#FFFFFF" />
            </motion.div>

            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: B.teal,
                marginBottom: "0.75rem",
              }}
            >
              Order Confirmed!
            </h2>

            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.95rem",
                color: B.bodyText,
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              Your hair ritual is on its way! We've sent a confirmation email with your order details and tracking information.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                borderRadius: "9999px",
                background: B.teal,
                color: B.offWhite,
                border: "none",
                fontFamily: "var(--font-montserrat), sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Home size={18} />
              Return to Home
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Order Summary Component ──────────────────────────────── */
function OrderSummary({
  items,
  shippingMethod,
  onShippingChange,
}: {
  items: any[];
  shippingMethod: ShippingMethod;
  onShippingChange: (method: ShippingMethod) => void;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === "express" ? 299 : subtotal >= 2999 ? 0 : 199;
  const total = subtotal + shippingCost;

  return (
    <div
      style={{
        background: "rgba(250,252,251,0.82)",
        backdropFilter: "blur(20px)",
        borderRadius: "1.5rem",
        padding: "2rem",
        border: `1px solid ${B.lightGray}`,
        position: "sticky",
        top: "120px",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "1.4rem",
          fontWeight: 700,
          color: B.teal,
          marginBottom: "1.5rem",
        }}
      >
        Order Summary
      </h3>

      {/* Items */}
      <div style={{ marginBottom: "1.5rem" }}>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              paddingBottom: "1rem",
              borderBottom: `1px solid ${B.lightGray}`,
            }}
          >
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
                {item.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.8rem",
                  color: B.midGray,
                }}
              >
                Qty: {item.quantity}
              </p>
            </div>
            <span
              style={{
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: B.teal,
              }}
            >
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      {/* Shipping Method */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: B.teal,
            marginBottom: "0.75rem",
          }}
        >
          Delivery Method
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { value: "standard" as ShippingMethod, label: "Standard Delivery", time: "5-7 days", cost: subtotal >= 2999 ? 0 : 199 },
            { value: "express" as ShippingMethod, label: "Express Delivery", time: "2-3 days", cost: 299 },
          ].map((method) => (
            <button
              key={method.value}
              onClick={() => onShippingChange(method.value)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem",
                borderRadius: "1.25rem",
                border: `2px solid ${shippingMethod === method.value ? B.seafoam : B.borderGray}`,
                background: shippingMethod === method.value ? "rgba(42,157,143,0.05)" : "transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: `2px solid ${shippingMethod === method.value ? B.seafoam : B.borderGray}`,
                    background: shippingMethod === method.value ? B.seafoam : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {shippingMethod === method.value && (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FFFFFF" }} />
                  )}
                </div>
                <div style={{ textAlign: "left" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: B.teal,
                    }}
                  >
                    {method.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.75rem",
                      color: B.midGray,
                    }}
                  >
                    {method.time}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: method.cost === 0 ? B.seafoam : B.teal,
                }}
              >
                {method.cost === 0 ? "FREE" : `₹${method.cost}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: B.bodyText }}>
            Subtotal
          </span>
          <span style={{ fontFamily: "var(--font-montserrat), sans-serif", fontSize: "0.9rem", fontWeight: 600, color: B.teal }}>
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: B.bodyText }}>
            Shipping
          </span>
          <span
            style={{
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: shippingCost === 0 ? B.seafoam : B.teal,
            }}
          >
            {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "1rem",
            borderTop: `2px solid ${B.lightGray}`,
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
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Trust Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          paddingTop: "1rem",
          borderTop: `1px solid ${B.lightGray}`,
        }}
      >
        {[
          { icon: <Shield size={14} />, label: "Secure Payment" },
          { icon: <Package size={14} />, label: "Eco Packaging" },
        ].map((badge) => (
          <div
            key={badge.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.75rem",
              color: B.midGray,
            }}
          >
            {badge.icon}
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Checkout Page ──────────────────────────────────── */
export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, subtotal, validateStock } = useCart();
  const { currentUser, dbUser } = useAuthModal();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  // Auth guard
  useEffect(() => {
    if (!currentUser && !dbUser) {
      router.push("/");
    }
  }, [currentUser, dbUser, router]);

  // Empty cart guard
  useEffect(() => {
    if (cartItems.length === 0 && !showSuccess) {
      router.push("/shop");
    }
  }, [cartItems, router, showSuccess]);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // STOCK VALIDATION: Validate stock before proceeding
      console.log("🔍 Validating stock availability...");
      const stockValidation = await validateStock();
      
      if (!stockValidation.valid) {
        let errorMessage = "Some items in your cart are no longer available:\n\n";
        
        if (stockValidation.outOfStock.length > 0) {
          errorMessage += "Out of Stock:\n" + stockValidation.outOfStock.map(name => `• ${name}`).join('\n') + "\n\n";
        }
        
        if (stockValidation.insufficientStock.length > 0) {
          errorMessage += "Insufficient Stock:\n" + stockValidation.insufficientStock.map(item => 
            `• ${item.name}: Only ${item.available} available (you requested ${item.requested})`
          ).join('\n');
        }
        
        errorMessage += "\n\nPlease update your cart and try again.";
        
        alert(errorMessage);
        setIsProcessing(false);
        router.push('/cart');
        return;
      }
      
      console.log("✅ Stock validation passed");

      // Calculate final total
      const shippingCost = shippingMethod === "express" ? 299 : subtotal >= 2999 ? 0 : 199;
      const total = subtotal + shippingCost;

      // Step 1: Create order in our database (with server-side validation)
      console.log("📦 Creating order in database...");
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser?.id,
          totalAmount: total,
          shippingMethod,
          shippingCost,
          shippingAddress: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
          },
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation failed:", errorData);
        throw new Error(errorData.error || errorData.details || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.order.id;
      console.log("✅ Order created successfully:", orderId);

      // Step 2: Create Razorpay order
      console.log("💳 Creating Razorpay order...");
      const razorpayOrderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderId: orderId,
        }),
      });

      if (!razorpayOrderResponse.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const razorpayOrderData = await razorpayOrderResponse.json();
      console.log("✅ Razorpay order created:", razorpayOrderData.id);

      // Step 3: Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "Follicia",
        description: "Finalizing your Follicia Ritual.",
        order_id: razorpayOrderData.id,
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#0D3B44", // Brand teal
        },
        handler: async function (response: any) {
          console.log("💰 Payment successful, verifying...");
          
          // Step 4: Verify payment
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderId,
            }),
          });

          if (verifyResponse.ok) {
            console.log("✅ Payment verified successfully");
            
            // POST-PURCHASE WIPE: Clear cart (frontend + backend + localStorage)
            console.log("🧹 Clearing cart after successful payment...");
            await clearCart();
            console.log("✅ Cart cleared successfully");
            
            // Show success modal
            setShowSuccess(true);
          } else {
            console.error("❌ Payment verification failed");
            alert("Payment verification failed. Please contact support with your order ID: " + orderId);
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      // Reset processing state after opening modal
      setIsProcessing(false);
    } catch (error) {
      console.error("Payment failed:", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/");
  };

  if (!currentUser && !dbUser) {
    return null;
  }

  if (cartItems.length === 0 && !showSuccess) {
    return null;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Navbar isFixed />
      <SuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />

      <main style={{ background: B.cream, minHeight: "100vh", paddingTop: "100px", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: E }}
            style={{ marginBottom: "2.5rem" }}
          >
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "2.5rem",
                fontWeight: 800,
                color: B.teal,
                marginBottom: "0.5rem",
              }}
            >
              Secure Checkout
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.95rem",
                color: B.bodyText,
              }}
            >
              Complete your hair ritual journey
            </p>
          </motion.div>

          {/* Two Column Layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2.5rem", alignItems: "start" }}>
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: E }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Contact & Shipping */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "1.5rem",
                    padding: "2rem",
                    marginBottom: "1.5rem",
                    border: `1px solid ${B.lightGray}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: currentStep >= 1 ? B.seafoam : B.lightGray,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      1
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: B.teal,
                      }}
                    >
                      Contact & Shipping
                    </h2>
                  </div>

                  <div style={{ display: "grid", gap: "1.25rem" }}>
                    {/* Email */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: B.teal,
                          marginBottom: "0.5rem",
                        }}
                      >
                        <Mail size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        defaultValue={currentUser?.email || ""}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem",
                          borderRadius: "1.25rem",
                          border: `2px solid ${errors.email ? "#ef4444" : B.borderGray}`,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "border-color 0.2s ease",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "#ef4444" : B.borderGray)}
                      />
                      {errors.email && (
                        <span style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem", display: "block" }}>
                          {errors.email.message}
                        </span>
                      )}
                    </div>

                    {/* Full Name */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: B.teal,
                          marginBottom: "0.5rem",
                        }}
                      >
                        <User size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register("fullName", { required: "Full name is required" })}
                        defaultValue={dbUser?.name || ""}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem",
                          borderRadius: "1.25rem",
                          border: `2px solid ${errors.fullName ? "#ef4444" : B.borderGray}`,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.fullName ? "#ef4444" : B.borderGray)}
                      />
                      {errors.fullName && (
                        <span style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem", display: "block" }}>
                          {errors.fullName.message}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: B.teal,
                          marginBottom: "0.5rem",
                        }}
                      >
                        <Phone size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { required: "Phone number is required" })}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem",
                          borderRadius: "1.25rem",
                          border: `2px solid ${errors.phone ? "#ef4444" : B.borderGray}`,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "#ef4444" : B.borderGray)}
                      />
                      {errors.phone && (
                        <span style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem", display: "block" }}>
                          {errors.phone.message}
                        </span>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: B.teal,
                          marginBottom: "0.5rem",
                        }}
                      >
                        <MapPin size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                        Street Address
                      </label>
                      <input
                        type="text"
                        {...register("address", { required: "Address is required" })}
                        style={{
                          width: "100%",
                          padding: "0.875rem 1rem",
                          borderRadius: "1.25rem",
                          border: `2px solid ${errors.address ? "#ef4444" : B.borderGray}`,
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.9rem",
                          outline: "none",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.address ? "#ef4444" : B.borderGray)}
                      />
                      {errors.address && (
                        <span style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.25rem", display: "block" }}>
                          {errors.address.message}
                        </span>
                      )}
                    </div>

                    {/* City, State, Pincode */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: B.teal,
                            marginBottom: "0.5rem",
                          }}
                        >
                          City
                        </label>
                        <input
                          type="text"
                          {...register("city", { required: "City is required" })}
                          style={{
                            width: "100%",
                            padding: "0.875rem 1rem",
                            borderRadius: "1.25rem",
                            border: `2px solid ${errors.city ? "#ef4444" : B.borderGray}`,
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = errors.city ? "#ef4444" : B.borderGray)}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: B.teal,
                            marginBottom: "0.5rem",
                          }}
                        >
                          State
                        </label>
                        <input
                          type="text"
                          {...register("state", { required: "State is required" })}
                          style={{
                            width: "100%",
                            padding: "0.875rem 1rem",
                            borderRadius: "1.25rem",
                            border: `2px solid ${errors.state ? "#ef4444" : B.borderGray}`,
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = errors.state ? "#ef4444" : B.borderGray)}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: B.teal,
                            marginBottom: "0.5rem",
                          }}
                        >
                          Pincode
                        </label>
                        <input
                          type="text"
                          {...register("pincode", { required: "Pincode is required" })}
                          style={{
                            width: "100%",
                            padding: "0.875rem 1rem",
                            borderRadius: "1.25rem",
                            border: `2px solid ${errors.pincode ? "#ef4444" : B.borderGray}`,
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: "0.9rem",
                            outline: "none",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = B.seafoam)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = errors.pincode ? "#ef4444" : B.borderGray)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Review & Pay */}
                <div
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "1.5rem",
                    padding: "2rem",
                    marginBottom: "1.5rem",
                    border: `1px solid ${B.lightGray}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: currentStep >= 2 ? B.seafoam : B.lightGray,
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-montserrat), sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      2
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: B.teal,
                      }}
                    >
                      Review & Pay
                    </h2>
                    <Lock size={18} color={B.midGray} style={{ marginLeft: "auto" }} />
                  </div>

                  <div
                    style={{
                      padding: "1.5rem",
                      borderRadius: "1rem",
                      background: "rgba(42,157,143,0.05)",
                      border: `1px solid rgba(42,157,143,0.2)`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <Shield size={20} color={B.seafoam} />
                      <p
                        style={{
                          fontFamily: "var(--font-montserrat), sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: B.teal,
                        }}
                      >
                        Secure Payment via Razorpay
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "0.85rem",
                        color: B.bodyText,
                        lineHeight: 1.6,
                      }}
                    >
                      Your payment will be processed securely through Razorpay. You can pay using Credit/Debit Cards, UPI, Net Banking, and Wallets.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isProcessing}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  style={{
                    width: "100%",
                    padding: "1.25rem 2rem",
                    borderRadius: "9999px",
                    background: isProcessing ? B.midGray : B.teal,
                    color: B.offWhite,
                    border: "none",
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    letterSpacing: "0.03em",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    boxShadow: isProcessing ? "none" : "0 8px 24px rgba(13,59,68,0.3)",
                  }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#FFFFFF",
                          borderRadius: "50%",
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Proceed to Payment
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Security Note */}
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.8rem",
                    color: B.midGray,
                    marginTop: "1rem",
                  }}
                >
                  <Shield size={14} style={{ display: "inline", marginRight: "0.5rem" }} />
                  Your payment information is encrypted and secure
                </p>
              </form>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: E, delay: 0.2 }}
            >
              <OrderSummary
                items={cartItems}
                shippingMethod={shippingMethod}
                onShippingChange={setShippingMethod}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          main > div > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
