import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F9FA" }}>
      <AdminSidebar />
      <main
        style={{
          marginLeft: "64px",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}
