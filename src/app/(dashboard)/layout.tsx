import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 print:h-auto print:overflow-visible print:bg-white print:text-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 relative print:overflow-visible print:p-0">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03)_0%,transparent_50%)] print:hidden" />
        <div className="relative z-10 print:static">{children}</div>
      </main>
    </div>
  );
}
