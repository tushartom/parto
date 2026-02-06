import  prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { adminApiError } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";


export async function POST(request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const {
      leadId,
      shopName,
      contactName,
      whatsAppNumber,
      locationText,
      partsCondition,
      selectedBrands,
      shopImageUrl,
      shopImagePublicId,
    } = body;

    // 1. Duplicate Check: Block if WhatsApp already exists in Supplier table
    const existingSupplier = await prisma.supplier.findUnique({
      where: { whatsAppNumber },
    });

    if (existingSupplier) {
      return NextResponse.json(
        { error: "This number already exists as an active Supplier." },
        { status: 400 },
      );
    }

    // 2. Atomic Transaction: Create Supplier + Update Lead Status
    const result = await prisma.$transaction(async (tx) => {
      const supplier = await tx.supplier.create({
        data: {
          shopName,
          contactName,
          whatsAppNumber,
          locationText,
          partsCondition,
          shopImageUrl,
          shopImagePublicId,
          verifiedAt: new Date(),
          // Relation: Connect to existing Brands by name
          brands: {
            connect: selectedBrands.map((name) => ({ name })),
          },
        },
      });

      // Update lead to 'CONVERTED' so it leaves the Staging/Verified list
      await tx.supplierLead.update({
        where: { id: leadId },
        data: { status: "CONVERTED" },
      });

      return supplier;
    });

    // 3. Image Promotion: Remove 'temp' tag so Cron won't delete it
    if (shopImagePublicId) {
      try {
        await cloudinary.uploader.remove_tag("temp", [shopImagePublicId]);
      } catch (err) {
        // Log failure but don't stop success; Cron will reconcile later
        console.error("Cloudinary Tag Promotion Failed:", err);
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return adminApiError(error);
  }
}
