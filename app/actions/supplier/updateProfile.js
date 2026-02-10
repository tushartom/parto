// app/actions/supplier/updateProfile.js
"use server";

import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { requireSupplier } from "@/lib/supplier-auth";

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

export async function updateSupplierProfileImage(
  supplierId,
  formData,
  oldPublicId,
) {
  const file = formData.get("file");

  if (!file) {
    return { success: false, message: "No file provided" };
  }

  try {
    // Convert file to buffer for Cloudinary upload_stream
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. UPLOAD NEW IMAGE
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            upload_preset: "parto_supplier_shop_upload_v1", // REPLACE WITH YOUR ACTUAL PRESET
            transformation: [{ width: 400, height: 400, crop: "fill" }], // Automatic square crop
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    // 3. UPDATE DATABASE
    // Update DB before deleting the old image to ensure we don't lose the old one if DB fails.
    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        shopImageUrl: uploadResponse.secure_url,
        shopImagePublicId: uploadResponse.public_id,
      },
    });

    // 4. CLEAN UP OLD IMAGE
    // Only remove the old file from Cloudinary after a successful DB update.
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (deletionError) {
        console.warn(
          "Could not delete old image, but DB was updated:",
          deletionError,
        );
      }
    }

    // 5. REFRESH UI
    revalidatePath("/account");

    return {
      success: true,
      url: updatedSupplier.shopImageUrl,
      publicId: updatedSupplier.shopImagePublicId,
    };
  } catch (error) {
    console.error("Profile update failed:", error);
    return { success: false, message: "Update failed. Please try again." };
  }
}