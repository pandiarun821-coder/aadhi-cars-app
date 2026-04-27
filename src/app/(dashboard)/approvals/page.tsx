import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { updateRequestStatus } from "@/app/actions";

export default async function ApprovalsPage() {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "MAIN") {
    return redirect("/");
  }

  const pendingIndents = await prisma.fuelIndent.findMany({
    where: { approvalStatus: "Pending" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const pendingGatepasses = await prisma.gatepass.findMany({
    where: { approvalStatus: "Pending" },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Pending Approvals</h1>
        <p className="text-sm text-zinc-400">Review and manage pending Fuel Indents and Gatepasses.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Fuel Indents ({pendingIndents.length})</h2>
        {pendingIndents.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-zinc-500">
            No pending fuel indents.
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">FI No</th>
                  <th className="px-6 py-4 font-medium">Requested By</th>
                  <th className="px-6 py-4 font-medium">Vehicle / Fuel</th>
                  <th className="px-6 py-4 font-medium">Date & Time</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {pendingIndents.map((indent) => (
                  <tr key={indent.id} className="transition-colors hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium text-white">{indent.fiNo}</td>
                    <td className="px-6 py-4">{indent.user.username}</td>
                    <td className="px-6 py-4">
                      {indent.vehicleNo} <br />
                      <span className="text-xs text-zinc-500">{indent.fuelType}</span>
                    </td>
                    <td className="px-6 py-4">
                      {indent.date} <br />
                      <span className="text-xs text-zinc-500">{indent.time}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={updateRequestStatus.bind(null, "fuel", indent.id, "Approved")}>
                          <button type="submit" className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                        </form>
                        <form action={updateRequestStatus.bind(null, "fuel", indent.id, "Rejected")}>
                          <button type="submit" className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Gatepasses ({pendingGatepasses.length})</h2>
        {pendingGatepasses.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-zinc-500">
            No pending gatepasses.
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">GP No</th>
                  <th className="px-6 py-4 font-medium">Created By</th>
                  <th className="px-6 py-4 font-medium">Customer / Vehicle</th>
                  <th className="px-6 py-4 font-medium">Purpose</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {pendingGatepasses.map((gp) => (
                  <tr key={gp.id} className="transition-colors hover:bg-zinc-800/50">
                    <td className="px-6 py-4 font-medium text-white">{gp.gpNo}</td>
                    <td className="px-6 py-4">{gp.user.username}</td>
                    <td className="px-6 py-4">
                      {gp.customerName} <br />
                      <span className="text-xs text-zinc-500">{gp.vehicleNo}</span>
                    </td>
                    <td className="px-6 py-4">{gp.purpose}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <form action={updateRequestStatus.bind(null, "gatepass", gp.id, "Approved")}>
                          <button type="submit" className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                        </form>
                        <form action={updateRequestStatus.bind(null, "gatepass", gp.id, "Rejected")}>
                          <button type="submit" className="flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
