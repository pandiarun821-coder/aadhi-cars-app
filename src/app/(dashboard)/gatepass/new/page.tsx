import { createGatepass } from "@/app/actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { prisma } from "@/../lib/prisma";

export default async function NewGatepassPage() {
  const vehicles = await prisma.demoVehicle.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/gatepass"
          className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">New Gatepass</h1>
          <p className="text-sm text-zinc-400">AADHI CARS PVT LTD</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
        <form action={createGatepass} className="space-y-6">
          <datalist id="demo-vehicles">
            {vehicles.map(v => (
              <option key={v.id} value={v.vehicleNo}>{v.model}</option>
            ))}
          </datalist>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">RM Name</label>
              <input
                type="text"
                name="rmName"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Reporting Manager Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Customer Name</label>
              <input
                type="text"
                name="customerName"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Customer Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Contact No</label>
              <input
                type="text"
                name="customerContact"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Phone Number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Vehicle No</label>
              <input
                type="text"
                list="demo-vehicles"
                name="vehicleNo"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Vehicle No"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-zinc-300">Purpose</label>
              <input
                type="text"
                name="purpose"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. Test Drive, Delivery, Service"
              />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium text-zinc-300">Opening KM</label>
              <input
                type="text"
                name="openingKm"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Opening KM (Optional)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium text-zinc-300">Place</label>
              <input
                type="text"
                name="place"
                required
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Destination Place"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-emerald-500 active:scale-[0.98]"
            >
              <Save className="h-5 w-5" />
              Save Gatepass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
