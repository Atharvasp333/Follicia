"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Check } from "lucide-react";
import axios from "axios";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
  darkText: "#2C4A42",
};

interface ProductFormData {
  name: string;
  tagline: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  ingredients: string[];
  stock: string;
  lowStockThreshold: string;
  isActive: boolean;
  aiMatchTag: string;
  hairType: string[];
  porosity: string[];
  scalpCondition: string[];
}

const HAIR_TYPES = ["straight", "wavy", "curly", "coily"];
const POROSITY_LEVELS = ["low", "medium", "high"];
const SCALP_CONDITIONS = ["oily", "dry", "normal", "sensitive"];

// Helper to validate and extract direct image URL
const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Check if it's a direct image URL (not a Google search result)
    if (urlObj.hostname.includes('google.com') && urlObj.pathname.includes('imgres')) {
      return false;
    }
    // Check if URL ends with common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = urlObj.pathname.toLowerCase();
    return imageExtensions.some(ext => pathname.includes(ext)) || pathname.includes('/wp-content/uploads/');
  } catch {
    return false;
  }
};

// Extract direct image URL from Google Images URL
const extractDirectImageUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('google.com') && urlObj.searchParams.has('imgurl')) {
      return decodeURIComponent(urlObj.searchParams.get('imgurl') || '');
    }
    return url;
  } catch {
    return url;
  }
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ingredientInput, setIngredientInput] = useState("");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    tagline: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    ingredients: [],
    stock: "",
    lowStockThreshold: "5",
    isActive: true,
    aiMatchTag: "",
    hairType: [],
    porosity: [],
    scalpCondition: [],
  });

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    // Special handling for image URL
    if (field === 'imageUrl' && typeof value === 'string') {
      const cleanedUrl = extractDirectImageUrl(value);
      setFormData((prev) => ({ ...prev, [field]: cleanedUrl }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const toggleArrayField = (field: "hairType" | "porosity" | "scalpCondition", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        price: parseFloat(formData.price),
        priceDisplay: `₹${parseFloat(formData.price).toLocaleString("en-IN")}`,
        category: formData.category,
        imageUrl: formData.imageUrl,
        ingredients: formData.ingredients,
        stock: parseInt(formData.stock),
        inventoryCount: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        isActive: formData.isActive,
        aiMatchTag: formData.aiMatchTag,
        hairType: formData.hairType,
        porosity: formData.porosity,
        scalpCondition: formData.scalpCondition,
      };

      await axios.post("/api/admin/products", payload);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message: "Product Synthesized & Added to Inventory" },
          })
        );
      }

      router.push("/admin/inventory");
    } catch (error) {
      console.error("Failed to create product:", error);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message: "Failed to create product. Please try again." },
          })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "0.4rem",
          }}
        >
          Product Synthesis Laboratory
        </h1>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: B.bodyText }}>
          Configure a new clinical-grade formulation for the Follicia catalogue.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1.25rem", maxWidth: "1200px" }}>
          {/* Module A: Basic Identification */}
          <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: B.teal,
                  marginBottom: "0.25rem",
                }}
              >
                Module A: Basic Identification
              </h2>
              <p style={{ fontSize: "0.75rem", color: B.midGray }}>General product information and pricing</p>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Name */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Biotin Density Serum"
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                />
              </div>

              {/* Tagline */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange("tagline", e.target.value)}
                  placeholder="e.g., Clinical-grade follicle fortification"
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed product description..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter), sans-serif",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Price and Category */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="2490"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      border: `1px solid ${B.lightGray}`,
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="e.g., Serum, Shampoo, Conditioner"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      border: `1px solid ${B.lightGray}`,
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                  Image URL *
                </label>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="url"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/product-image.jpg"
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        border: `1px solid ${B.lightGray}`,
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        fontFamily: "var(--font-inter), sans-serif",
                      }}
                    />
                    <p style={{ fontSize: "0.7rem", color: B.midGray, marginTop: "0.4rem" }}>
                      Paste a direct image URL. Google Images links will be auto-converted.
                    </p>
                  </div>
                  {formData.imageUrl && (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        background: `url(${formData.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: `1px solid ${B.lightGray}`,
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Module B: Formulation & Inventory */}
          <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: B.teal,
                  marginBottom: "0.25rem",
                }}
              >
                Module B: Formulation & Inventory
              </h2>
              <p style={{ fontSize: "0.75rem", color: B.midGray }}>Ingredients and stock management</p>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* Ingredients */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                  Ingredients
                </label>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIngredient())}
                    placeholder="e.g., Biotin, Keratin, Argan Oil"
                    style={{
                      flex: 1,
                      padding: "0.65rem 0.85rem",
                      border: `1px solid ${B.lightGray}`,
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    style={{
                      padding: "0.65rem 1rem",
                      background: B.seafoam,
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {formData.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.4rem 0.75rem",
                        background: B.cream,
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        color: B.darkText,
                      }}
                    >
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <X size={14} color={B.midGray} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock and Threshold */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="100"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      border: `1px solid ${B.lightGray}`,
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => handleInputChange("lowStockThreshold", e.target.value)}
                    placeholder="5"
                    style={{
                      width: "100%",
                      padding: "0.65rem 0.85rem",
                      border: `1px solid ${B.lightGray}`,
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* Active Status */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                  <div
                    onClick={() => handleInputChange("isActive", !formData.isActive)}
                    style={{
                      width: "48px",
                      height: "26px",
                      borderRadius: "13px",
                      background: formData.isActive ? B.seafoam : B.lightGray,
                      position: "relative",
                      transition: "background 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "white",
                        position: "absolute",
                        top: "3px",
                        left: formData.isActive ? "25px" : "3px",
                        transition: "left 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: B.bodyText }}>
                    Product Active {formData.isActive && <Check size={14} color={B.seafoam} style={{ display: "inline", marginLeft: "4px" }} />}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Module C: AI & Bio-Matching Metadata */}
          <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", border: `1px solid ${B.lightGray}` }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: B.teal,
                  marginBottom: "0.25rem",
                }}
              >
                Module C: AI & Bio-Matching Metadata
              </h2>
              <p style={{ fontSize: "0.75rem", color: B.midGray }}>Follicia AI recommendation engine parameters</p>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* AI Match Tag */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.4rem" }}>
                  AI Match Tag
                </label>
                <input
                  type="text"
                  value={formData.aiMatchTag}
                  onChange={(e) => handleInputChange("aiMatchTag", e.target.value)}
                  placeholder="e.g., dry-scalp, frizz-control, growth"
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    border: `1px solid ${B.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-inter), sans-serif",
                  }}
                />
              </div>

              {/* Hair Type Compatibility */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.6rem" }}>
                  Hair Type Compatibility
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                  {HAIR_TYPES.map((type) => (
                    <label
                      key={type}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.6rem 0.85rem",
                        border: `1px solid ${formData.hairType.includes(type) ? B.seafoam : B.lightGray}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        background: formData.hairType.includes(type) ? `${B.seafoam}15` : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.hairType.includes(type)}
                        onChange={() => toggleArrayField("hairType", type)}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "0.8rem", color: B.darkText, textTransform: "capitalize" }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Porosity Targeting */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.6rem" }}>
                  Porosity Targeting
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  {POROSITY_LEVELS.map((level) => (
                    <label
                      key={level}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.6rem 0.85rem",
                        border: `1px solid ${formData.porosity.includes(level) ? B.seafoam : B.lightGray}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        background: formData.porosity.includes(level) ? `${B.seafoam}15` : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.porosity.includes(level)}
                        onChange={() => toggleArrayField("porosity", level)}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "0.8rem", color: B.darkText, textTransform: "capitalize" }}>{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Scalp Condition */}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: B.bodyText, marginBottom: "0.6rem" }}>
                  Scalp Condition Targeting
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                  {SCALP_CONDITIONS.map((condition) => (
                    <label
                      key={condition}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.6rem 0.85rem",
                        border: `1px solid ${formData.scalpCondition.includes(condition) ? B.seafoam : B.lightGray}`,
                        borderRadius: "6px",
                        cursor: "pointer",
                        background: formData.scalpCondition.includes(condition) ? `${B.seafoam}15` : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.scalpCondition.includes(condition)}
                        onChange={() => toggleArrayField("scalpCondition", condition)}
                        style={{ cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "0.8rem", color: B.darkText, textTransform: "capitalize" }}>{condition}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => router.back()}
              style={{
                padding: "0.75rem 1.5rem",
                background: "white",
                color: B.bodyText,
                border: `1px solid ${B.lightGray}`,
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 2rem",
                background: loading ? B.midGray : B.teal,
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                fontFamily: "var(--font-inter), sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: "2px solid white",
                      borderTopColor: "transparent",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Synthesizing...
                </>
              ) : (
                "Publish Product"
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
