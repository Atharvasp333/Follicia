"use client";

const B = {
  teal: "#0D3B44",
  seafoam: "#2A9D8F",
  cream: "#F4F7F5",
  offWhite: "#FAFCFB",
  lightGray: "#E8EDEB",
  midGray: "#9AABA5",
  bodyText: "#4A6B63",
};

export default function CustomersPage() {
  return (
    <div style={{ padding: "2rem 3rem", maxWidth: "1600px" }}>
      <h1
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: B.teal,
          marginBottom: "0.5rem",
        }}
      >
        Customer Management
      </h1>
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "0.9rem",
          color: B.bodyText,
        }}
      >
        Coming soon...
      </p>
    </div>
  );
}
