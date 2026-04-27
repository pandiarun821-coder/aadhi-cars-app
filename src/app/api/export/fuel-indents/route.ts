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
  const indents = await prisma.fuelIndent.findMany({
    where: role === "SUB" ? { userId: session.user.id } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const exportData = indents.map((indent) => ({
    "FI No": indent.fiNo,
    "Date": indent.date,
    "Time": indent.time,
    "Company Name": indent.companyName,
    "Vehicle No": indent.vehicleNo,
    "Model": indent.model,
    "KM": indent.km,
    "DSE/TL": indent.dseTl,
    "Fuel Type": indent.fuelType,
    "Requested By": indent.user.username,
    "Approval Status": indent.approvalStatus,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fuel Indents");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const fileName = `Fuel_Indents_Export_${format(new Date(), "yyyy-MM-dd")}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
