import prisma from "@/lib/prisma.js";
import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations/lead";

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Server-side Validation
    const validation = leadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 2. Transactional Upsert and Create
    const lead = await prisma.$transaction(async (tx) => {
      // Find or create buyer
      const buyer = await tx.buyer.upsert({
        where: { phoneNumber: data.phone },
        update: {},
        create: { phoneNumber: data.phone },
      });

      // Create Lead with 2-hour SLA
      return await tx.lead.create({
        data: {
          buyerId: buyer.id,
          vehicleMake: data.make,
          vehicleModel: data.model,
          vehicleYear: parseInt(data.year),
          requestedParts: data.parts,
          condition: data.condition.toUpperCase().replace(" ", "_"),
          locationText: data.location,
          slaDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // Server-side time
        },
      });
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
