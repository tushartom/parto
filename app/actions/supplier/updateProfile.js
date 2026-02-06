// app/actions/supplier/updateProfile.js
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireSupplier } from "@/lib/supplier-auth";
export const dynamic = "force-dynamic";
export async function updateSupplierProfile(formData) {
  try {
    const session = await requireSupplier();
    const currentSupplierId = session.id;

    // 1. Fetch current data to compare address
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: currentSupplierId },
      select: { locationText: true, isLocationVerified: true },
    });


    // 2. Destructure brandIds separately
    const { brandIds, ...updateData } = formData;

    // 3. Logic: If address changed, mark for Admin Review
    const addressChanged =
      existingSupplier.locationText !== updateData.locationText;
    const isLocationVerified = addressChanged
      ? false
      : existingSupplier.isLocationVerified;

    // 4. Perform Atomic Update
    await prisma.supplier.update({
      where: { id: currentSupplierId },
      data: {
        shopName: updateData.shopName,
        contactName: updateData.contactName,
        locationText: updateData.locationText,
        partsCondition: updateData.partsCondition,
        isLocationVerified: isLocationVerified, // Managed field
        brands: {
          set: brandIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/supplier/profile");
    return { success: true };
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR:", error);
    return { success: false, error: "Failed to update profile details." };
  }
}
