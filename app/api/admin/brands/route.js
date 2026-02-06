import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const brands = await prisma.brand.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { name: "asc" },
      select: { id: true, name: true }, // Only send what the dropdown needs
    });

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("[BRANDS_GET_ERR]:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 },
    );
  }
}
