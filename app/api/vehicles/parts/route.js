import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/vehicles/parts?categoryId=XYZ
 * Fetches active parts for a specific category
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    // 1. Validation: Ensure categoryId is provided
    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 },
      );
    }

    // 2. Query Database: Fetch only active parts in this category
    const parts = await prisma.part.findMany({
      where: {
        categoryId: categoryId,
        isActive: true, // Only show parts verified by admin
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc", // Alphabetical order for better supplier UX
      },
    });

    // 3. Return JSON response
    return NextResponse.json(parts);
  } catch (error) {
    console.error("API_PARTS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
