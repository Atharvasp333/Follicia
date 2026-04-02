"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/admin/auth";

  // Auth page: Full-screen, no sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Admin pages: With sidebar
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F9FA" }}>
      <AdminSidebar />
      <main
        style={{
          marginLeft: "240px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
