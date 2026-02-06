import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cache } from "react";

// Template Imports
import RootLandingPage from "@/components/buyer/templates/RootLandingPage";
import CityBroadTemplate from "@/components/buyer/templates/CityBroadTemplate";
import BrandCityTemplate from "@/components/buyer/templates/BrandCityTemplate";
import ModelCityTemplate from "@/components/buyer/templates/ModelCityTemplate";

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
