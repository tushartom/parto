  import prisma from "@/lib/prisma";
  import { NextResponse } from "next/server";
  import { z } from "zod";

  /**
   * Senior Architect Note:
   * We now use the exact same schema structure as the frontend
   */
  const supplierRegistrationSchema = z.object({
    shopName: z.string().min(3),
    ownerName: z.string().min(2),
    phone: z.string().regex(/^[0-9]{10}$/),
    city: z.string().min(2),
    condition: z.enum(["NEW", "USED", "BOTH"]),
  });

  export async function POST(request) {
    try {
      const body = await request.json();

      // 1. Validate using the aligned Frontend structure
      const validated = supplierRegistrationSchema.parse(body);

      // 2. Proactive Identity Check: Is this already a verified supplier?
      const existingSupplier = await prisma.supplier.findUnique({
        where: { whatsAppNumber: validated.phone },
      });

      if (existingSupplier && existingSupplier.isActive) {
        return NextResponse.json(
          {
            error: "IDENTIFIED_SUPPLIER",
            message:
              "You are already a verified supplier. Please go to the Login page.",
          },
          { status: 400 }
        );
      }

      // 3. Pending Application Check: Avoid duplicate submissions
      const pendingLead = await prisma.supplierLead.findFirst({
        where: {
          whatsAppNumber: validated.phone,
          status: "PENDING",
        },
      });

      if (pendingLead) {
        return NextResponse.json(
          {
            error: "PENDING_REVIEW",
            message: "Your application is currently being reviewed by our team.",
          },
          { status: 409 }
        );
      }

      // 4. Map Frontend keys to Backend database columns
      const newLead = await prisma.supplierLead.create({
        data: {
          shopName: validated.shopName,
          contactName: validated.ownerName, // Mapped from ownerName
          whatsAppNumber: validated.phone, // Mapped from phone
          locationText: validated.city, // Mapped from city
          partsCondition: validated.condition, // Mapped from condition
        },
      });

      return NextResponse.json(
        { success: true, leadId: newLead.id },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "VALIDATION_ERROR", details: error.errors },
          { status: 400 }
        );
      }
      console.log(error.message);
      console.error("[SUPPLIER_REG_CRASH]:", error);
      return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
    }
  }
