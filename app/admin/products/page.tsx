"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Edit, Trash2 } from "lucide-react";
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

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, isActive: !currentStatus } : p
        ));
      }
    } catch (error) {
      console.error("Failed to update product visibility:", error);
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const getStockColor = (stock: number) => {
    if (stock < 10) return "#EF4444";
    if (stock < 50) return "#F59E0B";
    return "#10B981";
  };

  const getStockPercentage = (stock: number) => {
    const maxStock = 500;
    return Math.min((stock / maxStock) * 100, 100);
  };

  return (
    <div style={{ padding: "2rem 3rem", maxWidth: "1600px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: B.teal,
          }}
        >
          Inventory
        </h1>

        <Link
          href="/admin/products/new"
          style={{
            padding: "0.75rem 1.5rem",
            borderRadius: "12px",
            background: B.teal,
            border: "none",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: B.offWhite,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "16px",
          border: `1px solid ${B.lightGray}`,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: B.midGray }}>Loading products...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: B.cream }}>
                {["THUMBNAIL", "PRODUCT NAME", "CATEGORY", "STOCK LEVEL", "PRICE", "VISIBILITY", "ACTIONS"].map((header) => (
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
              {products.map((product) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: `1px solid ${B.lightGray}`,
                  }}
                >
                  {/* Thumbnail */}
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background: "#FEF3C7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Package size={24} color="#D97706" />
                      )}
                    </div>
                  </td>

                  {/* Product Name */}
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: B.teal,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {product.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.75rem",
                          color: B.midGray,
                        }}
                      >
                        SKU: FOL-{product.id.slice(0, 6).toUpperCase()}
                      </p>
                    </div>
                  </td>

                  {/* Category */}
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.85rem",
                      color: B.bodyText,
                    }}
                  >
                    {product.category || "—"}
                  </td>

                  {/* Stock Level */}
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ minWidth: "150px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: B.lightGray,
                          borderRadius: "3px",
                          overflow: "hidden",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: `${getStockPercentage(product.stock)}%`,
                            height: "100%",
                            background: getStockColor(product.stock),
                            borderRadius: "3px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-inter), sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: getStockColor(product.stock),
                        }}
                      >
                        {product.stock} In Stock
                      </p>
                    </div>
                  </td>

                  {/* Price */}
                  <td
                    style={{
                      padding: "1.25rem 1.5rem",
                      fontFamily: "var(--font-montserrat), sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: B.teal,
                    }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>

                  {/* Visibility Toggle */}
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <button
                      onClick={() => toggleVisibility(product.id, product.isActive)}
                      style={{
                        width: "44px",
                        height: "24px",
                        borderRadius: "12px",
                        background: product.isActive ? B.teal : B.midGray,
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          position: "absolute",
                          top: "3px",
                          left: product.isActive ? "23px" : "3px",
                          transition: "left 0.2s ease",
                        }}
                      />
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "1.25rem 1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link
                        href={`/admin/products/${product.id}`}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: `1px solid ${B.lightGray}`,
                          background: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: B.bodyText,
                          textDecoration: "none",
                        }}
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "1px solid #FEE2E2",
                          background: "#FFFFFF",
                          color: "#DC2626",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 2rem",
              borderTop: `1px solid ${B.lightGray}`,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.85rem",
                color: B.midGray,
              }}
            >
              Showing 1 to {Math.min(4, products.length)} of {products.length} results
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  background: "#FFFFFF",
                  border: `1px solid ${B.lightGray}`,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  color: B.bodyText,
                  cursor: "pointer",
                }}
              >
                Previous
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  style={{
                    width: "36px",
                    height: "36px",
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
              <button
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  background: "#FFFFFF",
                  border: `1px solid ${B.lightGray}`,
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.85rem",
                  color: B.bodyText,
                  cursor: "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
