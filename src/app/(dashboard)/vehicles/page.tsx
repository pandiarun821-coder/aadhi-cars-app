import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Trash2, Car } from "lucide-react";
import { addVehicle, deleteVehicle } from "@/app/actions";

export default async function VehiclesPage() {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "MAIN") {
    return redirect("/");
  }

  const vehicles = await prisma.demoVehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Demo Vehicles</h1>
        <p className="text-sm text-zinc-400">Manage vehicles available for quick selection in indents and gatepasses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Vehicles List */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900/80 text-xs uppercase text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Vehicle No</th>
              <th className="px-6 py-4 font-medium">Model</th>
                  <th className="px-6 py-4 font-medium">Fleet</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                      No demo vehicles fed yet.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v.id} className="transition-colors hover:bg-zinc-800/50">
                      <td className="px-6 py-4 font-medium text-white">{v.vehicleNo}</td>
                      <td className="px-6 py-4">{v.model}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                          {v.fleet || "None"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={deleteVehicle.bind(null, v.id)}>
                          <button type="submit" className="inline-flex items-center gap-1 rounded bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Vehicle Form */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl sticky top-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" />
              Feed New Vehicle
            </h2>
            <form action={addVehicle} className="space-y-4">
              <datalist id="fleet-options">
                <option value="ALL-CBE" />
                <option value="ARENA-CBE" />
                <option value="NEXA-CBE" />
                <option value="SERVICE-CBE" />
                <option value="PARTS-ETC" />
              </datalist>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Vehicle No</label>
                <input
                  type="text"
                  name="vehicleNo"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="TN 01 AB 1234"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Model Name</label>
                <input
                  type="text"
                  name="model"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tata Nexon"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Fleet (Optional)</label>
                <input
                  type="text"
                  name="fleet"
                  list="fleet-options"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. NEXA-CBE"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
              >
                Feed Vehicle
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
