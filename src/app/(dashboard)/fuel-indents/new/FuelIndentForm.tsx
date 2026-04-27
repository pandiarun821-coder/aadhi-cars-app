"use client";

import { useState } from "react";
import { createFuelIndent, getPreviousVehicleKm } from "@/app/actions";
import { Save } from "lucide-react";

type DemoVehicle = {
  id: string;
  vehicleNo: string;
  model: string;
};

export default function FuelIndentForm({ vehicles }: { vehicles: DemoVehicle[] }) {
  const [previousKm, setPreviousKm] = useState("");
  const [isFetchingKm, setIsFetchingKm] = useState(false);

  const handleVehicleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const vehicleNo = e.target.value;
    if (!vehicleNo) {
      setPreviousKm("");
      return;
    }

    setIsFetchingKm(true);
    try {
      const km = await getPreviousVehicleKm(vehicleNo);
      setPreviousKm(km);
    } catch (error) {
      console.error("Error fetching previous KM:", error);
    } finally {
      setIsFetchingKm(false);
    }
  };

  return (
    <form action={createFuelIndent} className="space-y-6">
      <datalist id="demo-vehicles">
        {vehicles.map(v => (
          <option key={v.id} value={v.vehicleNo}>{v.model}</option>
        ))}
      </datalist>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Vehicle No</label>
          <input
            type="text"
            list="demo-vehicles"
            name="vehicleNo"
            required
            onChange={handleVehicleChange}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. TN 01 AB 1234"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Model</label>
          <input
            type="text"
            name="model"
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Vehicle Model"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            Previous KM {isFetchingKm && <span className="text-xs text-blue-400 ml-2 animate-pulse">Fetching...</span>}
          </label>
          <input
            type="text"
            name="previousKm"
            value={previousKm}
            onChange={(e) => setPreviousKm(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Auto-filled from last indent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Current KM</label>
          <input
            type="text"
            name="km"
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Current KM"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">DSE / TL</label>
          <input
            type="text"
            name="dseTl"
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Name of DSE/TL"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Fuel Type</label>
          <select
            name="fuelType"
            required
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Location</label>
          <input
            type="text"
            name="location"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Fuel Station Location"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Petrol Agent Name</label>
          <input
            type="text"
            name="petrolAgent"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Name of Petrol Agent"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium text-zinc-300">Remarks / Needed Things</label>
          <textarea
            name="remarks"
            rows={3}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="Any other needed things related to fuel indent..."
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98]"
        >
          <Save className="h-5 w-5" />
          Save Indent
        </button>
      </div>
    </form>
  );
}
