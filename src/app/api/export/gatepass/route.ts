import { getServerSession } from "next-auth";
import { authOptions } from "@/../lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import * as XLSX from "xlsx";
import { format } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const role = session.user.role;
  const gatepasses = await prisma.gatepass.findMany({
    where: role === "SUB" ? { userId: session.user.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const exportData = gatepasses.map((gp) => ({
    "GP No": gp.gpNo,
    "Date": gp.date,
    "Time": gp.time,
    "Company Name": gp.companyName,
    "RM Name": gp.rmName,
    "Customer Name": gp.customerName,
    "Customer Contact": gp.customerContact,
    "Vehicle No": gp.vehicleNo,
    "Purpose": gp.purpose,
    "Place": gp.place,
    "Opening KM": gp.openingKm,
    "Created By": gp.user.username,
    "Approval Status": gp.approvalStatus,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Gatepasses");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const fileName = `Gatepasses_Export_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
