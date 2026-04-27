import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcryptjs from "bcryptjs";

export async function GET() {
  try {
    const hashedPassword = await bcryptjs.hash("password", 10);
    const admin = await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        id: "admin-cuid-001",
        username: "admin",
        password: hashedPassword,
        role: "MAIN",
      },
    });
    
    return NextResponse.json({ message: "Admin user seeded successfully!", user: admin.username });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed admin user", details: String(error) }, { status: 500 });
  }
}
