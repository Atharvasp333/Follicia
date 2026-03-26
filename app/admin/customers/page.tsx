"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, Mail, X } from "lucide-react";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  hoverCream: "#F9FBFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
  darkText: "#2C4A42",
};

type Tier = "GOLD" | "SILVER" | "BRONZE";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  tier: Tier;
  totalSpend: number;
  totalOrders: number;
  lastOrderDate: string | null;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<Tier | "ALL">("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, tierFilter]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (tierFilter !== "ALL") {
      filtered = filtered.filter((u) => u.tier === tierFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const getTierBadgeStyle = (tier: Tier) => {
    const styles = {
      GOLD: {
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
        color: "#4A3000",
      },
      SILVER: {
        background: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
        color: "#3A3A3A",
      },
      BRONZE: {
        background: "linear-gradient(135deg, #CD7F32 0%, #B8733A 100%)",
        color: "#3A2010",
      },
    };
    return styles[tier];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <div style={{ padding: "2rem 3rem", textAlign: "center" }}>
        <p style={{ color: B.bodyText }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", background: B.offWhite, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: B.darkText,
            marginBottom: "0.4rem",
          }}
        >
          User Management
        </h1>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.8rem", color: B.bodyText }}>
          Manage customer accounts, view purchase history, and track user engagement.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ display: "flex", gap: "0.85rem", marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
          <Search
            size={16}
            style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: B.midGray }}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.85rem 0.6rem 2.5rem",
              border: `1px solid ${B.lightGray}`,
              borderRadius: "6px",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              outline: "none",
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as Tier | "ALL")}
            style={{
              padding: "0.6rem 2.25rem 0.6rem 0.85rem",
              border: `1px solid ${B.lightGray}`,
              borderRadius: "6px",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              cursor: "pointer",
              appearance: "none",
              background: "white",
            }}
          >
            <option value="ALL">All Tiers</option>
            <option value="GOLD">Gold</option>
            <option value="SILVER">Silver</option>
            <option value="BRONZE">Bronze</option>
          </select>
          <ChevronDown
            size={14}
            style={{ position: "absolute", right: "0.85rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: B.midGray }}
          />
        </div>
      </div>

      {/* User Table */}
      <div style={{ background: "white", borderRadius: "8px", overflow: "hidden", marginBottom: "1.25rem" }}>
        {/* Table Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.5fr 2fr 1fr 1fr",
            padding: "0.75rem 1rem",
            background: B.cream,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.65rem",
            fontWeight: 600,
            color: B.bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <div>User</div>
          <div>Contact</div>
          <div>Tier Status</div>
          <div>Total Orders</div>
        </div>

        {/* Table Rows */}
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                display: "grid",
                gridTemplateColumns: "2.5fr 2fr 1fr 1fr",
                padding: "0.85rem 1rem",
                borderBottom: `1px solid ${B.lightGray}`,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = B.hoverCream)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
            >
              {/* User Entity */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: user.imageUrl ? `url(${user.imageUrl})` : B.lightGray,
                    backgroundSize: "cover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: B.bodyText,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                  }}
                >
                  {!user.imageUrl && user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 600, color: B.darkText, fontSize: "0.85rem" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: B.midGray, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Mail size={14} color={B.midGray} />
                <span style={{ fontSize: "0.8rem", color: B.bodyText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
              </div>

              {/* Tier */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    ...getTierBadgeStyle(user.tier),
                    padding: "0.3rem 0.75rem",
                    borderRadius: "14px",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {user.tier}
                </div>
              </div>

              {/* Total Orders */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: B.darkText }}>
                  {user.totalOrders}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "2.5rem", textAlign: "center", color: B.midGray, fontSize: "0.85rem" }}>
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.8rem", color: B.bodyText, marginRight: "0.85rem" }}>
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
          </span>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "none",
                background: page === currentPage ? B.teal : "transparent",
                color: page === currentPage ? "white" : B.bodyText,
                cursor: "pointer",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.8rem",
                fontWeight: page === currentPage ? 600 : 400,
              }}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          onClick={() => setSelectedUser(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "0",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "85vh",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            {/* Modal Header */}
            <div style={{ 
              padding: "2rem 2rem 1.5rem", 
              borderBottom: `1px solid ${B.lightGray}`,
              position: "relative"
            }}>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  right: "1.5rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = B.cream)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X size={20} color={B.midGray} />
              </button>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: selectedUser.imageUrl ? `url(${selectedUser.imageUrl})` : B.lightGray,
                    backgroundSize: "cover",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: B.bodyText,
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {!selectedUser.imageUrl && selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "1.75rem",
                      fontWeight: 400,
                      color: B.darkText,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {selectedUser.name}
                  </h2>
                  <div
                    style={{
                      ...getTierBadgeStyle(selectedUser.tier),
                      padding: "0.3rem 0.8rem",
                      borderRadius: "14px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      display: "inline-block",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {selectedUser.tier}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "2rem", maxHeight: "calc(85vh - 200px)", overflowY: "auto" }}>
              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
                <div style={{ 
                  background: B.cream, 
                  borderRadius: "10px", 
                  padding: "1.25rem",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                    Total Spend
                  </div>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.teal }}>
                    ₹{selectedUser.totalSpend.toLocaleString("en-IN")}
                  </div>
                </div>

                <div style={{ 
                  background: B.cream, 
                  borderRadius: "10px", 
                  padding: "1.25rem",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                    Order Count
                  </div>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", fontWeight: 600, color: B.seafoam }}>
                    {selectedUser.totalOrders}
                  </div>
                </div>

                <div style={{ 
                  background: B.cream, 
                  borderRadius: "10px", 
                  padding: "1.25rem",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: B.bodyText, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                    Last Activity
                  </div>
                  <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.1rem", fontWeight: 600, color: B.darkText }}>
                    {formatDate(selectedUser.lastOrderDate)}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: 600, 
                  color: B.bodyText, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px",
                  marginBottom: "1rem" 
                }}>
                  Account Information
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: B.offWhite, borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: B.midGray }}>Email</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: B.darkText }}>{selectedUser.email}</span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: B.offWhite, borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: B.midGray }}>Account Created</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: B.darkText }}>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: B.offWhite, borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: B.midGray }}>User ID</span>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: B.darkText }}>{selectedUser.id.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: B.teal,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = B.seafoam)}
                onMouseLeave={(e) => (e.currentTarget.style.background = B.teal)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
