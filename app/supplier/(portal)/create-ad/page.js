import AdFormController from "@/components/supplier/AdFormController";
import { getFormMetadata } from "@/app/actions/ad/getFormMetadata";

export default async function CreateAdPage() {
  // Fetch metadata on the server before rendering
  const { brands, categories } = await getFormMetadata();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Mobile-friendly Header */}
      <div className="bg-white border-b px-4 py-6 mb-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Post a Part</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to list your spare part on the marketplace.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Injecting metadata as a prop ensures the dropdowns 
            are populated instantly when the page loads.
          */}
          <AdFormController mode="create" metadata={{ brands, categories }} />
        </div>
      </div>
    </div>
  );
}

// import prisma from "@/lib/prisma";
// import CreateAdForm from "@/components/supplier/CreateAdForm";

// export default async function CreateAdPage() {
//   // Fetch initial data in parallel for speed
//   const [brands, categories] = await Promise.all([
//     prisma.brand.findMany({
//       where: { isActive: true },
//       orderBy: { name: "asc" },
//     }),
//     prisma.partCategory.findMany({
//       where: { isActive: true },
//       orderBy: { name: "asc" },
//     }),
//   ]);

//   return (
//     <div className="max-w-2xl mx-auto pb-20">
//       <CreateAdForm initialBrands={brands} initialCategories={categories} />
//     </div>
//   );
// }
