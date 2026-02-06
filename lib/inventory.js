import prisma from "@/lib/prisma";
import { cache } from "react";

export const getActiveInventory = cache(async () => {
  try {
    const [brands, categories] = await Promise.all([
      // 1. Fetch Brands with their Nested Models
      prisma.brand.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          models: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              slug: true,
            },
            orderBy: { name: "asc" },
          },
        },
        orderBy: { name: "asc" },
      }),

      // 2. Fetch Categories with their Nested Parts
      prisma.partCategory.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          parts: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              slug: true,
            },
            orderBy: { name: "asc" },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      brands,
      categories,
      // Helper for a flat list of all parts (great for searchable autocomplete)
      partsWithCategoryName: categories.flatMap((cat) =>
        cat.parts.map((part) => ({
          ...part,
          categoryName: cat.name,
        })),
      ),
    };
  } catch (error) {
    console.error("Critical: Failed to fetch active inventory", error);
    return { brands: [], categories: [], partsWithCategoryName: [] };
  }
});

/**
 * Lightweight City Fetcher
 * Returns only essential fields for top-level navigation and grids.
 * No localities are fetched to keep the JSON payload minimal.
 */
export const getCities = cache(async () => {
  try {
    const cities = await prisma.city.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return cities;
  } catch (error) {
    console.error("Critical: Failed to fetch active cities", error);
    return [];
  }
});



/**
 * Fetches verified suppliers that handle a specific car brand.
 * Optimized for the "Request Success" supplier discovery page.
 * * @param {string} brandName - The name of the brand (e.g., "Toyota")
 */
export async function getSuppliersByBrand(brandName) {
  if (!brandName) return [];

  try {
    const suppliers = await prisma.supplier.findMany({
      where: {
        isActive: true,
        // Using 'some' to filter within the many-to-many relation
        brands: {
          some: {
            name: {
              equals: brandName,
              mode: "insensitive", // Robustness: Handles casing mismatches
            },
          },
        },
      },
      select: {
        id: true,
        shopName: true,
        contactName: true,
        whatsAppNumber: true,
        locationText: true,
        partsCondition: true,
        shopImageUrl: true,
        verifiedAt: true,
      },
      orderBy: [
        { verifiedAt: "desc" }, // Most recently verified first
        { createdAt: "desc" },
      ],
      take: 10, // Limit results for mobile-first performance
    });

    return suppliers;
  } catch (error) {
    console.error("DATABASE_ERROR [getSuppliersByBrand]:", error);
    return []; // Fail gracefully to prevent page crashes
  }
}