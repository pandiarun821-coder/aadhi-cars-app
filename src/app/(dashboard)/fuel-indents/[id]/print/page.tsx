import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";

import { notFound } from "next/navigation";
import { Printer } from "lucide-react";
import PrintButton from "@/components/PrintButton";

export default async function PrintFuelIndentPage({ params }: { params: { id: string } }) {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const indent = await prisma.fuelIndent.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!indent) return notFound();

  // Role check: sub users can only print their own
  if (session.user.role === "SUB" && indent.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans print:p-0 print:m-0 max-w-4xl mx-auto">
      <div className="mb-4 print:hidden flex justify-end">
        <PrintButton />
      </div>

      {/* Printable Area */}
      <div className="border-2 border-black p-8 max-w-3xl mx-auto print:border-none print:p-4 print:max-w-none print:w-full">
        
        <div className="text-center mb-8 border-b-2 border-black pb-6">
          <h1 className="text-3xl font-bold uppercase tracking-widest">{indent.companyName}</h1>
          <h2 className="text-xl font-semibold mt-2">FUEL INDENT SLIP</h2>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p className="font-semibold text-lg">FI NO: <span className="font-normal text-red-600">{indent.fiNo}</span></p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Date: <span className="font-normal">{indent.date}</span></p>
            <p className="font-semibold">Time: <span className="font-normal">{indent.time}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12 text-lg">
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Vehicle No:</span>
            <span>{indent.vehicleNo}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Model:</span>
            <span>{indent.model}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">KM:</span>
            <span>{indent.km}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">DSE / TL:</span>
            <span>{indent.dseTl}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1 col-span-2 max-w-md">
            <span className="font-semibold">Fuel Type:</span>
            <span className="font-bold border border-black px-4 py-1 rounded">{indent.fuelType}</span>
          </div>
        </div>

        <div className="mt-24 flex justify-between items-end pt-12">
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="font-semibold">Requested By</p>
            <p className="text-sm text-gray-600">{indent.user.username}</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="font-semibold">Authorized Signatory</p>
            <p className="text-sm text-gray-600">Approval: {indent.approvalStatus}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
