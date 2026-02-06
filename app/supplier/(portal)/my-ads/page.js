import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, LayoutGrid } from "lucide-react";
import MyAdsList from "@/components/supplier/MyAdsList";
import { requireSupplier } from "@/lib/supplier-auth";

export const dynamic = "force-dynamic";
async function getSupplierAds() {
  // In a real app, get this ID from your auth session (e.g., Kinde/NextAuth)
  const supplier = await requireSupplier();
  const currentSupplierId = supplier.id;

  try {
    const [ads, brands, categories] = await Promise.all([
      prisma.partAd.findMany({
        where: { supplierId: currentSupplierId, deletedAt: null },
        include: {
          brand: { select: { id: true, name: true } },
          model: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          part: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.brand.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.partCategory.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
     return {
      ads: JSON.parse(JSON.stringify(ads)), // Handle Decimal/Date serialization
      metadata: { brands, categories }
    };
  } catch (error) {
    console.error("DASHBOARD_FETCH_ERROR:", error);
    return { ads: [], metadata: { brands: [], categories: [] } };
  }
}

export default async function MyAdsPage() {
  const {ads, metadata} = await getSupplierAds();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 2. Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {ads.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-500 mb-4">
              <LayoutGrid size={40} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">No ads found</h2>
            <p className="text-sm text-gray-500 max-w-[240px] mt-1">
              You haven't listed any spare parts yet. Start selling now!
            </p>
            
          </div>
        ) : (
          /* Active Listings List (Client Component) */
          <MyAdsList initialAds={JSON.parse(JSON.stringify(ads))} metadata={metadata} />
        )}
      </main>
    </div>
  );
}
