import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";

import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";

export default async function PrintGatepassPage({ params }: { params: { id: string } }) {
  const { authOptions } = await import("@/../lib/auth");
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const gp = await prisma.gatepass.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!gp) return notFound();

  // Role check: sub users can only print their own
  if (session.user.role === "SUB" && gp.userId !== session.user.id) {
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
          <h1 className="text-3xl font-bold uppercase tracking-widest">{gp.companyName}</h1>
          <h2 className="text-xl font-semibold mt-2">IN/OUT GATEPASS</h2>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <p className="font-semibold text-lg">GP NO: <span className="font-normal text-blue-600">{gp.gpNo}</span></p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Date: <span className="font-normal">{gp.date}</span></p>
            <p className="font-semibold">Time: <span className="font-normal">{gp.time}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12 text-lg">
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">RM Name:</span>
            <span>{gp.rmName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Vehicle No:</span>
            <span>{gp.vehicleNo}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Customer:</span>
            <span>{gp.customerName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Contact No:</span>
            <span>{gp.customerContact}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1 col-span-2">
            <span className="font-semibold">Purpose:</span>
            <span>{gp.purpose}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Place:</span>
            <span>{gp.place}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-1">
            <span className="font-semibold">Opening KM:</span>
            <span>{gp.openingKm || "-"}</span>
          </div>
        </div>

        <div className="mt-24 flex justify-between items-end pt-12">
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="font-semibold">Created By</p>
            <p className="text-sm text-gray-600">{gp.user.username}</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="font-semibold">Security Sign</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="font-semibold">Authorized Signatory</p>
            <p className="text-sm text-gray-600">Approval: {gp.approvalStatus}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
