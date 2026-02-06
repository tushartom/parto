import prisma from "@/lib/prisma";
import { requireSupplier } from "@/lib/supplier-auth";
import SupplierProfile from "@/components/supplier/SupplierProfile";

export default async function ProfilePage() {
  // 1. Get the authenticated supplier's ID
  const session = await requireSupplier();

  // 2. Fetch data in parallel for speed
  const [supplier, allBrands] = await Promise.all([
    prisma.supplier.findUnique({
      where: { id: session.id },
      include: {
        brands: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!supplier) {
    return <div>Supplier not found</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* 3. Pass the fetched data as props */}
      <SupplierProfile
        supplier={supplier}
        allBrands={allBrands}
      />
    </main>
  );
}
