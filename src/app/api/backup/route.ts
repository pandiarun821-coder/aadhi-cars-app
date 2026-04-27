import { getServerSession } from "next-auth";
import { authOptions } from "@/../lib/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "MAIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "dev.db");
  
  if (!fs.existsSync(dbPath)) {
    return new NextResponse("Database not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(dbPath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="aadhi_cars_backup_${new Date().toISOString().split('T')[0]}.db"`,
    },
  });
}
