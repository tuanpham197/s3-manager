import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import SessionGuard from "@/components/auth/SessionGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionGuard>
      <Navbar />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
      <MobileBottomNav />
    </SessionGuard>
  );
}
