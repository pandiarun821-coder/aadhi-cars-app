import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Plus, Printer, Download } from "lucide-react";


export default async function FuelIndentsPage() {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const role = session.user.role;
  const indents = await prisma.fuelIndent.findMany({
    where: role === "SUB" ? { userId: session.user.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Fuel Indents</h1>
          <p className="text-sm text-zinc-400">Manage and view fuel indent records.</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/export/fuel-indents"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-green-500"
          >
            <Download className="h-4 w-4" />
            Export
          </a>
          <Link
            href="/fuel-indents/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Create New
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">FI No</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Vehicle No</th>
                <th className="px-6 py-4 font-medium">Fuel Type</th>
                {role === "MAIN" && <th className="px-6 py-4 font-medium">Requested By</th>}
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {indents.length === 0 ? (
                <tr>
                  <td colSpan={role === "MAIN" ? 7 : 6} className="px-6 py-8 text-center text-zinc-500">
                    No fuel indents found.
                  </td>
                </tr>
              ) : (
                indents.map((indent) => (
                  <tr key={indent.id} className="transition-colors hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium text-white">{indent.fiNo}</td>
                    <td className="px-6 py-4">
                      {indent.date} <span className="text-zinc-500">{indent.time}</span>
                    </td>
                    <td className="px-6 py-4">{indent.vehicleNo}</td>
                    <td className="px-6 py-4">{indent.fuelType}</td>
                    {role === "MAIN" && (
                      <td className="px-6 py-4 text-zinc-400">
                        {indent.user.name || indent.user.username}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        indent.approvalStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        indent.approvalStatus === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {indent.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/print/fuel-indents/${indent.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
                      >
                        <Printer className="h-3 w-3" />
                        Print
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
