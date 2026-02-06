// components/buyer/templates/RootLandingPage.jsx
import React from "react";
import { LeadForm } from "@/components/buyer/LeadForm";
import TrustMetrics from "../brand/TrustMetrics";
import { HowItWorks } from "@/components/buyer/brand/HowItWorks";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight, Car, MapPin, ShieldCheck } from "lucide-react";
import PartoGuarantee from "../PartoGuarantee";
import { BrandGrid } from "../BrandGrid";
import { getActiveInventory } from "@/lib/inventory";
import { getCities } from "@/lib/inventory";
import { CityGrid } from "../CityGrid";

export default async function RootLandingPage() {
  const { brands, partsWithCategoryName } = await getActiveInventory();
  // console.log(partsWithCategoryName);
  const cities = await getCities();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* 1. HERO SECTION: Balanced Neo-Brutalist Header */}
      <section className="relative pt-24 pb-18 overflow-hidden bg-slate-50 border-b-2 border-slate-100">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">
              India's #1 Spare Parts Hub
            </span>
          </div>

          <h1 className="md:text-5xl text-2xl max-w-[800px] text-center mx-auto font-black italic uppercase tracking-tighter leading-6 md:leading-[0.85] mb-8">
            Car <span className="text-blue-600">Spare Parts</span> Online, Get{" "}
            <span className="text-blue-600">Prices</span> for Second Hand &
            New Parts Now
          </h1>

          <p className="max-w-xl mx-auto text-slate-500 font-medium text-md leading-relaxed mb-12">
            Connecting you with verified sellers for genuine new and certified
            used car parts across India.
          </p>

          {/* LeadForm: The high-contrast focal point */}
          <div className="flex justify-center relative z-20">
            <LeadForm
              inventoryData={{ brands: brands, parts: partsWithCategoryName }}
              initialValues={{
                brand: "",
                model: "",
                city: "",
              }}
            />
          </div>
        </div>
      </section>

      <HowItWorks />
      <BrandGrid brands={brands} />
      <CityGrid cities={cities} />
      <TrustMetrics />
      <PartoGuarantee />
    </main>
  );
}
