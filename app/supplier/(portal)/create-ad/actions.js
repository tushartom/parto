"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireSupplier } from "@/lib/supplier-auth";
import cloudinary from "@/lib/cloudinary"; // Your Cloudinary config
export const dynamic = "force-dynamic";
export async function getModelsByBrand(brandId) {
  if (!brandId) return [];

  try {
    const models = await prisma.vehicleModel.findMany({
      where: { 
        brandId,
        isActive: true 
      },
      orderBy: { name: 'asc' }
    });
    return models;
  } catch (error) {
    console.error("Failed to fetch models:", error);
    return [];
  }
}

export async function getPartsByCategory(categoryId) {
  // 1. Validation: Prevent unnecessary DB hits
  if (!categoryId) {
    return [];
  }

  try {
    // 2. Fetch active parts ordered alphabetically for better UX
    const parts = await prisma.part.findMany({
      where: {
        categoryId: categoryId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      // 3. Optimization: Only select what the frontend needs
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return parts;
  } catch (error) {
    // 4. Error Handling: Log internally, return safe empty array to UI
    console.error("Error fetching parts by category:", error);
    return [];
  }
}


export async function publishAd(data) {
  try {
    const supplier = await requireSupplier();
    const supplierId = supplier.id;
    //logging for debugging
    console.log("Supplier : ", supplier);

    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    const newAd = await prisma.partAd.create({
      data: {
        title: data.title,
        slug: finalSlug,
        images: data.images,
        oemNumber: data.oemNumber?.toUpperCase() || null,
        condition: data.condition,
        price: data.askForPrice ? null : parseFloat(data.price),
        askForPrice: data.askForPrice,
        deliveryOption: data.deliveryOption,
        supplierNote: data.supplierNote,
        year: data.year,
        customPartName: data.customPartName || null,
        status: "PENDING",

        // 3. Connect Relations
        supplier: { connect: { id: supplierId } },
        brand: { connect: { id: data.brand.id } },
        model: { connect: { id: data.model.id } },
        category: { connect: { id: data.category.id } },
        part: data.part?.id ? { connect: { id: data.part.id } } : undefined,
      },
    });

    //logging for debugging
    console.log(newAd);
    
    const permanentImages = await Promise.all(
      data.images.map(async (img, index) => {
        try {
          const newPublicId = `parto/ads/supplier_${supplierId}/ad_${newAd.id}/img_${index}`;

          const moveResult = await cloudinary.uploader.rename(
            img.public_id,
            newPublicId,
            { overwrite: true },
          );

          return {
            public_id: moveResult.public_id,
            url: moveResult.secure_url,
          };
        } catch (err) {
          console.error(
            `Cloudinary move failed for ${img.public_id}:`,
            err.message,
          );
          // Fallback: Return original image so the ad still has a picture
          return img;
        }
      }),
    );

    // 5. Update Ad with Permanent Image URLs
    const updatedAd = await prisma.partAd.update({
      where: { id: newAd.id },
      data: { images: permanentImages },
    });

    // 6. SAFE LOGGING
    // We use updatedAd (not newAd) and optional chaining to prevent crashes
    updatedAd.images?.forEach((img, i) => {
      console.log(`Final Image ${i} URL:`, img.url);
    });
    revalidatePath("/supplier/my-ads");
    return { success: true, adId: newAd.id, slug: finalSlug };
  } catch (error) {
    console.error("PUBLISH ERROR:", error);
    return { success: false, error: "Failed to finalize your ad." };
  }
}