"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteVehicle } from "@/app/actions";

interface Vehicle {
  id: string;
  vehicleNo: string;
  model: string;
  fleet: string | null;
}

export default function VehicleTableClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [filterNo, setFilterNo] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterFleet, setFilterFleet] = useState("");

  const filtered = vehicles.filter((v) => 
    v.vehicleNo.toLowerCase().includes(filterNo.toLowerCase()) &&
    v.model.toLowerCase().includes(filterModel.toLowerCase()) &&
    (v.fleet || "").toLowerCase().includes(filterFleet.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input 
          type="text" 
          placeholder="Filter by Vehicle No..." 
          value={filterNo} 
          onChange={(e) => setFilterNo(e.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <input 
          type="text" 
          placeholder="Filter by Model..." 
          value={filterModel} 
          onChange={(e) => setFilterModel(e.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
        <input 
          type="text" 
          placeholder="Filter by Fleet..." 
          value={filterFleet} 
          onChange={(e) => setFilterFleet(e.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
      </div>
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                  No demo vehicles found matching filters.
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
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
  );
}
