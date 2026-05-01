"use server";

import { prisma } from "@/../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/../lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export async function createFuelIndent(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const date = format(new Date(), "dd/MM/yyyy");
  const time = format(new Date(), "HH:mm");
  
  const count = await prisma.fuelIndent.count();
  const fiNo = `FI-${1000 + count + 1}`;

  await prisma.fuelIndent.create({
    data: {
      fiNo,
      date,
      time,
      vehicleNo: formData.get("vehicleNo") as string,
      model: formData.get("model") as string,
      km: formData.get("km") as string,
      dseTl: formData.get("dseTl") as string,
      fuelType: formData.get("fuelType") as string,
      previousKm: formData.get("previousKm") as string | null,
      location: formData.get("location") as string | null,
      petrolAgent: formData.get("petrolAgent") as string | null,
      remarks: formData.get("remarks") as string | null,
      userId: session.user.id,
    },
  });

  revalidatePath("/fuel-indents");
  redirect("/fuel-indents");
}

export async function getPreviousVehicleKm(vehicleNo: string) {
  const lastIndent = await prisma.fuelIndent.findFirst({
    where: { vehicleNo },
    orderBy: { createdAt: "desc" },
    select: { km: true },
  });
  return lastIndent?.km || "";
}

export async function createGatepass(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const date = format(new Date(), "dd/MM/yyyy");
  const time = format(new Date(), "HH:mm");
  
  const count = await prisma.gatepass.count();
  const gpNo = `GP-${1000 + count + 1}`;

  await prisma.gatepass.create({
    data: {
      gpNo,
      date,
      time,
      rmName: formData.get("rmName") as string,
      customerName: formData.get("customerName") as string,
      customerContact: formData.get("customerContact") as string,
      vehicleNo: formData.get("vehicleNo") as string,
      purpose: formData.get("purpose") as string,
      place: formData.get("place") as string,
      openingKm: formData.get("openingKm") as string | null,
      userId: session.user.id,
    },
  });

  revalidatePath("/gatepass");
  redirect("/gatepass");
}

export async function updateRequestStatus(type: "fuel" | "gatepass", id: string, status: "Approved" | "Rejected") {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  if (type === "fuel") {
    await prisma.fuelIndent.update({ where: { id }, data: { approvalStatus: status } });
  } else {
    await prisma.gatepass.update({ where: { id }, data: { approvalStatus: status } });
  }
  
  revalidatePath("/approvals");
  revalidatePath("/fuel-indents");
  revalidatePath("/gatepass");
}

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const formRole = formData.get("role") as string;
  
  if (!username || !password) throw new Error("Missing fields");

  const role = formRole === "MAIN" ? "MAIN" : "SUB";

  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      email: email || null,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath("/users");
  redirect("/users");
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  // Prevent admin from deleting themselves
  if (session.user.id === id) {
    throw new Error("Cannot delete your own account");
  }

  // Delete associated indents and gatepasses first to avoid constraint issues
  await prisma.fuelIndent.deleteMany({ where: { userId: id } });
  await prisma.gatepass.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  revalidatePath("/users");
}

export async function addVehicle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  const vehicleNo = formData.get("vehicleNo") as string;
  const model = formData.get("model") as string;
  const fleetStr = formData.get("fleet") as string;
  const fleet = fleetStr ? fleetStr : null;
  
  if (!vehicleNo || !model) throw new Error("Missing fields");

  await prisma.demoVehicle.create({
    data: { vehicleNo, model, fleet },
  });

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function deleteVehicle(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  await prisma.demoVehicle.delete({ where: { id } });
  revalidatePath("/vehicles");
}

export async function updateUserPassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  const id = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!id || !newPassword) throw new Error("Missing fields");

  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  revalidatePath("/users");
}

export async function updateUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MAIN") throw new Error("Unauthorized");

  const id = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const formRole = formData.get("role") as string;

  if (!id || !username) throw new Error("Missing fields");

  const role = formRole === "MAIN" ? "MAIN" : "SUB";

  await prisma.user.update({
    where: { id },
    data: {
      name,
      username,
      email: email || null,
      role,
    },
  });

  revalidatePath("/users");
}
