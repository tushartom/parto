"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteAssets } from "@/lib/cloudinary";
import { requireSupplier } from "@/lib/supplier-auth";

/**
 * Soft deletes a Part Advertisement and cleans up storage.
 * @param {string} adId - The ID of the ad to delete
 */
export async function deleteAd(adId) {
  try {
    // 1. Ownership & Existence Check
    // Replace with your real session/auth check
   const supplier = await requireSupplier();
   const currentSupplierId = supplier.id;

    const ad = await prisma.partAd.findUnique({
      where: { id: adId },
      select: {
        supplierId: true,
        images: true, // We need the public_ids to clean up Cloudinary
      },
    });

    if (!ad) {
      return { success: false, error: "Advertisement not found." };
    }

    if (ad.supplierId !== currentSupplierId) {
      return { success: false, error: "Unauthorized: Access denied." };
    }

    // 2. Database Soft Delete
    // Using update instead of delete to preserve the record for analytics
    await prisma.partAd.update({
      where: { id: adId },
      data: {
        status: "EXPIRED", // Or a specific "DELETED" status if you prefer
        deletedAt: new Date(),
      },
    });

    // 3. Cloudinary Cleanup (The "Sweep")
    // We physically delete the images since the ad is no longer active
    const imageArray = ad.images; // This is the JSON [{public_id, url}]
    if (imageArray && Array.isArray(imageArray)) {
      const publicIds = imageArray.map((img) => img.public_id);
      await deleteAssets(publicIds);
    }

    // 4. Cache Management
    revalidatePath("/supplier/my-ads");
 

    return { success: true };
  } catch (error) {
    console.error("DELETE_AD_ERROR:", error);
    return { success: false, error: "Failed to delete the advertisement." };
  }
}
