import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user not found for security reasons
      return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." }, { status: 200 });
    }

    // Generate token
    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token
    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // Send email asynchronously so the user doesn't have to wait
    sendPasswordResetEmail(email, token).catch((e) => {
      console.error("Failed to send background email:", e);
    });

    return NextResponse.json({ message: "Reset link sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 });
  }
}
