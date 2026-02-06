"use server";

import prisma from "@/lib/prisma";
import { adSchema } from "@/lib/validations/ad";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { requireSupplier } from "@/lib/supplier-auth";
import { makeImagesPermanent } from "@/lib/cloudinary";

export async function publishAd(formData) {
  try {
    const supplier = await requireSupplier();
    const supplierId = supplier.id;
    // 1. Server-side Validation
    const validatedData = adSchema.safeParse(formData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data provided." };
    }

    const data = validatedData.data;

    // 2. Fetch Reference Data for Title/Slug generation
    // We do this in parallel to keep the action fast
    const [brand, model, category, part] = await Promise.all([
      prisma.brand.findUnique({ where: { id: data.brandId } }),
      prisma.vehicleModel.findUnique({ where: { id: data.modelId } }),
      prisma.partCategory.findUnique({ where: { id: data.categoryId } }),
      data.partId
        ? prisma.part.findUnique({ where: { id: data.partId } })
        : null,
    ]);

    // 3. Generate SEO-Friendly Title
    // Format: "Used [Brand] [Model] [Part Name/Category] ([Year])"
    const partName = data.customPartName || part?.name || category?.name;
    const generatedTitle = `${brand?.name} ${model?.name} ${partName} (${data.year})`;

    // Create unique slug: brand-model-part-year-randomId
    const baseSlug = slugify(
      `${brand?.name}-${model?.name}-${partName}-${data.year}`,
      { lower: true },
    );
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // 4. Database Insertion
    const newAd = await prisma.partAd.create({
      data: {
        supplierId: supplierId, // Replace with your auth session ID
        brandId: data.brandId,
        modelId: data.modelId,
        categoryId: data.categoryId,
        partId: data.partId === "other" ? null : data.partId,
        customPartName: data.customPartName || null,
        oemNumber: data.oemNumber,
        year: data.year,
        condition: data.condition,
        price: data.price,
        askForPrice: data.askForPrice,
        deliveryOption: data.deliveryOption,
        supplierNote: data.supplierNote,
        images: data.images, // JSON array [{public_id, url}]
        title: generatedTitle,
        slug: uniqueSlug,
        status: "ACTIVE", // Instant-live model
      },
    });

    // 5. Cloudinary "Tag & Sweep" (Async - don't await if you want max speed)
    // Here you would trigger a function to change tags from 'temp' to 'live'
    // finalizeCloudinaryImages(data.images.map(img => img.public_id));
const publicIds = data.images.map((img) => img.public_id);
await makeImagesPermanent(publicIds);
    revalidatePath("/supplier/my-ads");

    return { success: true, adId: newAd.id };
  } catch (error) {
    console.error("PUBLISH_AD_ERROR:", error);
    return { success: false, error: "Failed to publish advertisement." };
  }
}
