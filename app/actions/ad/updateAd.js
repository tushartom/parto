"use server";

import prisma from "@/lib/prisma";
import { adSchema } from "@/lib/validations/ad";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { deleteAssets } from "@/lib/cloudinary";
import { requireSupplier } from "@/lib/supplier-auth";
import { makeImagesPermanent } from "@/lib/cloudinary";

/**
 * Update an existing Part Advertisement
 * @param {string} adId - The ID of the ad to update
 * @param {object} formData - The new data from the form
 * @param {string[]} imagesToDelete - Array of Cloudinary public_ids to remove
 */
export async function updateAd(adId, formData, imagesToDelete = []) {
    
  try {
    // 1. Authentication & Ownership Check (Crucial for Security)
const supplier = await requireSupplier();
const currentSupplierId = supplier.id;

    const existingAd = await prisma.partAd.findUnique({
      where: { id: adId },
      select: { supplierId: true, slug: true },
    });

    if (!existingAd || existingAd.supplierId !== currentSupplierId) {
      return {
        success: false,
        error: "Unauthorized: You do not own this listing.",
      };
    }

    // 2. Server-side Validation
    const validatedData = adSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data provided." };
    }

    const data = validatedData.data;

    // 3. Re-fetch Reference Data (In case they changed Brand/Model/Year)
    const [brand, model, category, part] = await Promise.all([
      prisma.brand.findUnique({ where: { id: data.brandId } }),
      prisma.vehicleModel.findUnique({ where: { id: data.modelId } }),
      prisma.partCategory.findUnique({ where: { id: data.categoryId } }),
      data.partId
        ? prisma.part.findUnique({ where: { id: data.partId } })
        : null,
    ]);

    // 4. Regenerate Title (Slugs usually stay the same to preserve SEO/Links)
    const partName = data.customPartName || part?.name || category?.name;
    const updatedTitle = `${brand?.name} ${model?.name} ${partName} (${data.year})`;

    // 5. Database Update
    await prisma.partAd.update({
      where: { id: adId },
      data: {
        brandId: data.brandId,
        modelId: data.modelId,
        categoryId: data.categoryId,
        partId: data.partId === "other" ? null : data.partId,
        customPartName: data.customPartName,
        oemNumber: data.oemNumber,
        year: data.year,
        condition: data.condition,
        price: data.price,
        askForPrice: data.askForPrice,
        deliveryOption: data.deliveryOption,
        supplierNote: data.supplierNote,
        images: data.images,
        title: updatedTitle,
        // slug: uniqueSlug, // Tip: Don't change slugs on update; it breaks old shared links
      },
    });

    // 6. Finalize Cloudinary "Tag & Sweep"
    // A) Delete images that were removed during editing
    if (imagesToDelete.length > 0) {
        await deleteAssets(imagesToDelete);
      // deleteFromCloudinary(imagesToDelete); // Trigger your Cloudinary delete utility
      console.log("Cleaning up storage for public_ids:", imagesToDelete);
    }
revalidatePath("/supplier/my-ads");
    // B) Ensure any new images uploaded are marked as 'live'
    // finalizeCloudinaryImages(data.images.map(img => img.public_id));
    const currentPublicIds = data.images.map((img) => img.public_id);
    await makeImagesPermanent(currentPublicIds);

    // revalidatePath("/supplier/my-ads");
    revalidatePath(`/ad/${existingAd.slug}`); // Update the specific ad page
revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("UPDATE_AD_ERROR:", error);
    return { success: false, error: "Failed to update advertisement." };
  }
}
