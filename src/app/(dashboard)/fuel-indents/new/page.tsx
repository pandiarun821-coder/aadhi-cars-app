import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/../lib/prisma";
import FuelIndentForm from "./FuelIndentForm";

export default async function NewFuelIndentPage() {
  const vehicles = await prisma.demoVehicle.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/fuel-indents"
          className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">New Fuel Indent</h1>
          <p className="text-sm text-zinc-400">AADHI CARS PVT LTD</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-xl">
        <FuelIndentForm vehicles={vehicles} />
      </div>
    </div>
  );
}
