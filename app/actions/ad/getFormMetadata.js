"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getFormMetadata = cache(async () => {
  try {
    // Fetch brands and categories in parallel for maximum speed
    const [brands, categories] = await Promise.all([
      prisma.brand.findMany({
        where: { isActive: true },
        select: { id: true, name: true }, // Only fetch what we need
        orderBy: { name: "asc" },
      }),
      prisma.partCategory.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      brands,
      categories,
      success: true,
    };
  } catch (error) {
    console.error("Failed to fetch form metadata:", error);
    return {
      brands: [],
      categories: [],
      success: false,
    };
  }
});
