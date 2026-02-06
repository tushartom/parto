import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
/**
 * GET /api/vehicles/models?brandId=XYZ
 * Fetches active vehicle models for a specific brand
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    // 1. Validation
    if (!brandId) {
      return NextResponse.json(
        { error: "brandId is required" },
        { status: 400 },
      );
    }

    // 2. Query Database
    const models = await prisma.vehicleModel.findMany({
      where: {
        brandId: brandId,
        isActive: true, // Only show models currently in production/service
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // 3. Return response
    return NextResponse.json(models);
  } catch (error) {
    console.error("API_MODELS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
