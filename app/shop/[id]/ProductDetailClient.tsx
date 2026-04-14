"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Star, Package, Leaf, CheckCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/contexts/CartContext";
import Toast from "@/components/Toast";
import { formatPrice } from "@/lib/price-utils";

type Product = {
  id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  ingredients: string[];
  price: number;
  priceDisplay: string | null;
  imageUrl: string | null;
  category: string | null;
  hairType: string[];
  porosity: string[];
  scalpCondition: string[];
  badge: string | null;
  rating: number;
  reviews: number;
  stock: number;
  inventoryCount: number;
};

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      priceDisplay: product.priceDisplay || formatPrice(product.price),
      imageUrl: product.imageUrl || "/placeholder-product.jpg",
      category: product.category,
      quantity,
    });
    setShowToast(true);
  };

  const isInStock = product.inventoryCount > 0;
  const isLowStock = product.inventoryCount <= product.stock && product.inventoryCount > 0;

  return (
    <main style={{ background: "#F4F7F5", minHeight: "100vh" }}>
      <Navbar />
      <Toast message="Added to cart!" isVisible={showToast} onClose={() => setShowToast(false)} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        {/* Back Button */}
        <Link href="/shop">
          <motion.button
            whileHover={{ x: -4 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem 1.25rem",
              borderRadius: "9999px",
              border: "1px solid #E8EDEB",
              background: "#FFFFFF",
              color: "#0D3B44",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              marginBottom: "2rem",
            }}
          >
            <ArrowLeft size={18} />
            Back to Shop
          </motion.button>
        </Link>

        {/* Product Detail Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
          className="product-detail-grid"
        >
          {/* Left: Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: "#FFFFFF",
              borderRadius: "1.5rem",
              padding: "2rem",
              border: "1px solid #E8EDEB",
            }}
          >
            <ProductImage
              src={product.imageUrl || "/placeholder-product.jpg"}
              alt={`${product.name} - Follicia Hair Care Product`}
              width={600}
              height={600}
              style={{ width: "100%", height: "auto", borderRadius: "1rem" }}
            />
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Badge */}
            {product.badge && (
              <span
                style={{
                  display: "inline-block",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  background: "rgba(42,157,143,0.1)",
                  color: "#2A9D8F",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                {product.badge}
              </span>
            )}

            {/* Product Name */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "2.5rem",
                color: "#0D3B44",
                marginBottom: "0.75rem",
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  color: "#4A6B63",
                  marginBottom: "1.5rem",
                }}
              >
                {product.tagline}
              </p>
            )}

            {/* Rating */}
            {product.rating > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(product.rating) ? "#D4AF37" : "none"}
                      color="#D4AF37"
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    color: "#9AABA5",
                  }}
                >
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div style={{ marginBottom: "2rem" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#0D3B44",
                }}
              >
                {product.priceDisplay || `₹${product.price.toLocaleString("en-IN")}`}
              </span>
            </div>

            {/* Stock Status */}
            {isLowStock && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  marginBottom: "1.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    color: "#DC2626",
                    fontWeight: 600,
                  }}
                >
                  Only {product.inventoryCount} left in stock!
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <motion.button
                whileHover={{ scale: isInStock ? 1.02 : 1 }}
                whileTap={{ scale: isInStock ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={!isInStock}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "1rem 2rem",
                  borderRadius: "9999px",
                  background: isInStock
                    ? "linear-gradient(135deg, #0D3B44, #2A9D8F)"
                    : "#9AABA5",
                  border: "none",
                  color: "#FFFFFF",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: isInStock ? "pointer" : "not-allowed",
                }}
              >
                <ShoppingCart size={18} />
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </motion.button>
            </div>

            {/* Description */}
            {product.description && (
              <div style={{ marginBottom: "2rem" }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#0D3B44",
                    marginBottom: "1rem",
                  }}
                >
                  About This Product
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    color: "#4A6B63",
                    lineHeight: 1.7,
                  }}
                >
                  {product.description}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#0D3B44",
                    marginBottom: "1rem",
                  }}
                >
                  Key Ingredients
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {product.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "9999px",
                        background: "rgba(42,157,143,0.08)",
                        color: "#2A9D8F",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suitable For */}
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#0D3B44",
                  marginBottom: "1rem",
                }}
              >
                Suitable For
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {product.hairType.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={16} color="#2A9D8F" />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#4A6B63",
                      }}
                    >
                      Hair Type: {product.hairType.join(", ")}
                    </span>
                  </div>
                )}
                {product.scalpCondition.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle size={16} color="#2A9D8F" />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#4A6B63",
                      }}
                    >
                      Concerns: {product.scalpCondition.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}
