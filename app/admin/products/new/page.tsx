"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
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

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tagline: "",
    price: "",
    priceDisplay: "",
    imageUrl: "",
    category: "",
    stock: "",
    badge: "",
    aiMatchTag: "",
    ingredients: "",
    hairType: "",
    porosity: "",
    scalpCondition: "",
  });

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, imageUrl: base64String }));
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setUploadingImage(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          tagline: formData.tagline || null,
          price: parseFloat(formData.price),
          priceDisplay: formData.priceDisplay || null,
          imageUrl: formData.imageUrl || null,
          category: formData.category || null,
          stock: parseInt(formData.stock) || 0,
          badge: formData.badge || null,
          aiMatchTag: formData.aiMatchTag || null,
          ingredients: formData.ingredients ? formData.ingredients.split(",").map((i) => i.trim()) : [],
          hairType: formData.hairType ? formData.hairType.split(",").map((i) => i.trim()) : [],
          porosity: formData.porosity ? formData.porosity.split(",").map((i) => i.trim()) : [],
          scalpCondition: formData.scalpCondition ? formData.scalpCondition.split(",").map((i) => i.trim()) : [],
          isActive: true,
        }),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        alert("Failed to create product");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: "2rem 3rem", maxWidth: "1200px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/products"
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
          Back to Products
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: B.teal,
          }}
        >
          Create New Product
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <ProductFormSection title="Basic Information">
              <FormField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
              <FormField label="Tagline" name="tagline" value={formData.tagline} onChange={handleChange} />
              <FormTextArea label="Description" name="description" value={formData.description} onChange={handleChange} />
              <FormField label="Ingredients (comma-separated)" name="ingredients" value={formData.ingredients} onChange={handleChange} />
            </ProductFormSection>

            <ProductFormSection title="Hair Profiling">
              <FormField label="Hair Type" name="hairType" value={formData.hairType} onChange={handleChange} />
              <FormField label="Porosity" name="porosity" value={formData.porosity} onChange={handleChange} />
              <FormField label="Scalp Condition" name="scalpCondition" value={formData.scalpCondition} onChange={handleChange} />
              <FormField label="AI Match Tag" name="aiMatchTag" value={formData.aiMatchTag} onChange={handleChange} />
            </ProductFormSection>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <ProductFormSection title="Pricing & Stock">
              <FormField label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              <FormField label="Price Display" name="priceDisplay" value={formData.priceDisplay} onChange={handleChange} />
              <FormField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
              <FormField label="Category" name="category" value={formData.category} onChange={handleChange} />
            </ProductFormSection>

            <ProductFormSection title="Media & Display">
              {!imagePreview ? (
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
                    Product Image
                  </label>
                  <label
                    htmlFor="image-upload-new"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2rem",
                      border: `2px dashed ${B.lightGray}`,
                      borderRadius: "12px",
                      cursor: uploadingImage ? "not-allowed" : "pointer",
                      background: B.cream,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!uploadingImage) {
                        e.currentTarget.style.borderColor = B.seafoam;
                        e.currentTarget.style.background = `${B.seafoam}10`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = B.lightGray;
                      e.currentTarget.style.background = B.cream;
                    }}
                  >
                    <input
                      id="image-upload-new"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      style={{ display: "none" }}
                    />
                    {uploadingImage ? (
                      <>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: `3px solid ${B.lightGray}`,
                            borderTopColor: B.seafoam,
                            animation: "spin 0.8s linear infinite",
                            marginBottom: "1rem",
                          }}
                        />
                        <p style={{ fontSize: "0.85rem", color: B.bodyText, fontWeight: 600 }}>
                          Uploading...
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload size={40} color={B.seafoam} style={{ marginBottom: "1rem" }} />
                        <p style={{ fontSize: "0.85rem", color: B.bodyText, fontWeight: 600, marginBottom: "0.25rem" }}>
                          Click to upload
                        </p>
                        <p style={{ fontSize: "0.7rem", color: B.midGray }}>
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </>
                    )}
                  </label>
                </div>
              ) : (
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
                    Product Image
                  </label>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        borderRadius: "12px",
                        background: `url(${imagePreview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: `2px solid ${B.lightGray}`,
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(239, 68, 68, 0.9)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 1)";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <X size={18} color="white" />
                    </button>
                  </div>
                </div>
              )}
              <FormField label="Badge" name="badge" value={formData.badge} onChange={handleChange} />
            </ProductFormSection>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                background: saving ? B.midGray : B.teal,
                border: "none",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: B.offWhite,
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Save size={18} />
              {saving ? "Creating..." : "Create Product"}
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

function ProductFormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>{children}</div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
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
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          borderRadius: "12px",
          border: `2px solid ${B.lightGray}`,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.9rem",
          outline: "none",
        }}
      />
    </div>
  );
}

function FormTextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}) {
  return (
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
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          borderRadius: "12px",
          border: `2px solid ${B.lightGray}`,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.9rem",
          outline: "none",
          resize: "vertical",
        }}
      />
    </div>
  );
}
