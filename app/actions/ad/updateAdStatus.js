// app/actions/ad/updateAdStatus.js
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireSupplier } from "@/lib/supplier-auth";
export const dynamic = "force-dynamic";
export async function updateAdStatus(adId, newStatus) {
  try {
    const supplier = await requireSupplier();
    const currentSupplierId = supplier.id;

    // Verify ownership
    const existingAd = await prisma.partAd.findUnique({
      where: { id: adId },
      select: { supplierId: true },
    });

    if (!existingAd || existingAd.supplierId !== currentSupplierId) {
      return { success: false, error: "Unauthorized" };
    }

    // Update the ad
    await prisma.partAd.update({
      where: { id: adId },
      data: { 
        status: newStatus,
        // If relisting an expired ad, we reset the timer
        ...(newStatus === "ACTIVE" ? { createdAt: new Date() } : {})
      },
    });

    revalidatePath("/supplier/my-ads");
    return { success: true };
  } catch (error) {
    console.error("STATUS_UPDATE_ERROR:", error);
    return { success: false, error: "Failed to update status" };
  }
}