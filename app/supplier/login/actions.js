"use server";

import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function verifySupplierExists(fullPhoneNumber) {
  // Format check: Ensure we handle numbers correctly for Prisma
  const dbFormattedNumber = fullPhoneNumber
    .replace("+91", "")
    .replace(/\D/g, "");
  // Usually stored as +919876543210
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { whatsAppNumber: dbFormattedNumber },
      select: { isActive: true },
    });

    if (!supplier) {
      return { exists: false, error: "Number not authorized." };
    }

    if (!supplier.isActive) {
      return { exists: false, error: "Account deactivated." };
    }
    console.log("Supplier exists with active status", supplier.isActive);
    return { exists: true };
  } catch (error) {
    return { exists: false, error: "Verification failed." };
  }
}
