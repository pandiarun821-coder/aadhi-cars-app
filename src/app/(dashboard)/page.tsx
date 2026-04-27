import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/../lib/prisma";
import Link from "next/link";
import { FileText, CarFront } from "lucide-react";

export default async function DashboardPage() {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect("/login");
  }

  const role = session.user.role;
  const indentsCount = await prisma.fuelIndent.count({
    where: role === "SUB" ? { userId: session.user.id } : undefined,
  });
  
  const gatepassCount = await prisma.gatepass.count({
    where: role === "SUB" ? { userId: session.user.id } : undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-zinc-400">Welcome back, {session.user.username}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fuel Indents Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl flex flex-col justify-between transition-all hover:bg-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Fuel Indents</p>
              <h2 className="text-3xl font-bold text-white">{indentsCount}</h2>
            </div>
          </div>
          <Link href="/fuel-indents" className="mt-6 text-sm font-medium text-blue-500 hover:underline flex justify-between items-center">
            View Fuel Indents <span>&rarr;</span>
          </Link>
        </div>

        {/* Gatepasses Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl flex flex-col justify-between transition-all hover:bg-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CarFront className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Total Gatepasses</p>
              <h2 className="text-3xl font-bold text-white">{gatepassCount}</h2>
            </div>
          </div>
          <Link href="/gatepass" className="mt-6 text-sm font-medium text-emerald-500 hover:underline flex justify-between items-center">
            View Gatepasses <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
