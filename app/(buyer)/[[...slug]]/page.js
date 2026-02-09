import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";

// Template Imports
import RootLandingPage from "@/components/buyer/templates/RootLandingPage";
import CityBroadTemplate from "@/components/buyer/templates/CityBroadTemplate";
import BrandCityTemplate from "@/components/buyer/templates/BrandCityTemplate";
import ModelCityTemplate from "@/components/buyer/templates/ModelCityTemplate";
import PartAdDetailsTemplate from "@/components/buyer/templates/PartAdDetailsTemplate";


/**
 * 1. AD RESOLVER (New)
 * Checks if the slug belongs to a specific supplier listing.
 */
const resolveFullAdData = cache(async (slug) => {
  // 1. Fetch the main Ad
  const ad = await prisma.partAd.findUnique({
    where: {
      slug: slug,
      status: "ACTIVE",
      deletedAt: null,
    },
    include: {
      supplier: true,
      brand: true,
      model: true,
      category: true,
    },
  });

  if (!ad) return null;

  // 2. Fetch Related Ads in the same category
  const relatedAds = await prisma.partAd.findMany({
    where: {
      categoryId: ad.categoryId,
      status: "ACTIVE",
      deletedAt: null,
      NOT: { id: ad.id }, // Exclude current ad
    },
    take: 4, // Grid of 4 looks best on desktop
    orderBy: { createdAt: "desc" },
    include: {
      supplier: true,
      brand: true,
      model: true,
    },
  });

  return { ad, relatedAds };
});
/**
 * CACHED RESOLVER: Remains the same, but now called with the resolved slug string.
 */
const resolveMarketData = cache(async (urlPath) => {
  if (!urlPath.includes("-parts-in-")) return null;

  const [vehicleSlug, citySlug] = urlPath.split("-parts-in-");

  const city = await prisma.city.findUnique({
    where: { slug: citySlug },
    include: { localities: true },
  });
  if (!city) return null;

  const allBrands = await prisma.brand.findMany({
    select: { id: true, name: true, slug: true },
  });

  const brand = allBrands.find(
    (b) => vehicleSlug === b.slug || vehicleSlug.startsWith(b.slug + "-"),
  );

  if (!brand) return null;

  if (vehicleSlug === brand.slug) {
    return { type: "BRAND", brand, city };
  }

  const modelSlug = vehicleSlug.replace(brand.slug + "-", "");
  const model = await prisma.vehicleModel.findFirst({
    where: { slug: modelSlug, brandId: brand.id },
  });

  if (model) {
    return { type: "MODEL", brand, model, city };
  }

  return null;
});

/**
 * 1. DYNAMIC METADATA (Async Params Fix)
 */
export async function generateMetadata({ params }) {
  // UNWRAP PARAMS FIRST
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  if (slug.length === 0) {
    return {
      title: "PARTO | India's Verified Car Spare Parts Marketplace",
      description:
        "Find genuine new and used car spare parts from verified suppliers.",
    };
  }

  const urlPath = slug[0];

  if (urlPath.startsWith("spare-parts-in-")) {
    const citySlug = urlPath.replace("spare-parts-in-", "");
    const city = await prisma.city.findUnique({ where: { slug: citySlug } });
    return {
      title: `Genuine Car Spare Parts in ${city?.name || citySlug} | PARTO`,
    };
  }
  // 2. Check if it's a Specific Part Ad
const adData = await resolveFullAdData(urlPath);

if (adData?.ad) {
  const { ad } = adData; // Destructure the ad from the returned object

  return {
    title: `${ad.title} for ${ad.brand.name} ${ad.model.name} (${ad.year}) | PARTO`,
    description: ad.supplierNote
      ? ad.supplierNote.substring(0, 160) // Limit for SEO best practices
      : `Get the best price for ${ad.title} from ${ad.supplier.shopName} in ${ad.supplier.city}. Verified suppliers only.`,
    openGraph: {
      images: ad.images?.[0]?.url ? [ad.images[0].url] : [], // Premium social sharing
    },
  };
}
  const data = await resolveMarketData(urlPath);
  if (!data) return { title: "PARTO Marketplace" };

  if (data.type === "BRAND") {
    return {
      title: `Original ${data.brand.name} Parts in ${data.city.name} | Verified Suppliers`,
    };
  }

  return {
    title: `Best ${data.brand.name} ${data.model.name} Spare Parts in ${data.city.name} | PARTO`,
  };
}

/**
 * 2. PAGE DISPATCHER (Async Params Fix)
 */
export default async function CatchAllPage({ params }) {
  // UNWRAP PARAMS FIRST
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  if (slug.length === 0) {
    return <RootLandingPage />;
  }

  const urlPath = slug[0];

  if (urlPath.startsWith("spare-parts-in-")) {
    const citySlug = urlPath.replace("spare-parts-in-", "");
    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
      include: { localities: true },
    });
    if (!city) return notFound();
    return <CityBroadTemplate city={city} />;
  }

  // 2. NEW: Handle Specific Part Ads
  // 2. Handle Individual Ad & Related Data
  const fullData = await resolveFullAdData(urlPath);
  if (fullData) {
    return (
      <PartAdDetailsTemplate
        ad={fullData.ad}
        relatedAds={fullData.relatedAds}
      />
    );
  }
  const data = await resolveMarketData(urlPath);
  if (!data) return notFound();

  if (data.type === "BRAND") {
    return <BrandCityTemplate brand={data.brand} city={data.city} />;
  }

  if (data.type === "MODEL") {
    return (
      <ModelCityTemplate
        brand={data.brand}
        model={data.model}
        city={data.city}
      />
    );
  }

  return notFound();
}
