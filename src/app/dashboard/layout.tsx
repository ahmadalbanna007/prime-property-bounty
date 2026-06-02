import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] w-full"
      style={{ backgroundColor: "var(--color-prime-gray)" }}
    >
      <DashboardSidebar />
      <div className="min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
