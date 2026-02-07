// components/buyer/templates/RootLandingPage.jsx
import React from "react";
import { LeadForm } from "@/components/buyer/LeadForm";
import TrustMetrics from "../brand/TrustMetrics";
import { HowItWorks } from "@/components/buyer/brand/HowItWorks";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image"; // ... inside your component
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

          {/* 2. MAIN HEADLINE */}
          <h1 className="md:text-4xl text-[24px] max-w-[900px] text-center mx-auto font-semibold tracking-tight  leading-[1.2] md:leading-[1.2] mb-8 text-slate-900">
            Car <span className="text-blue-600">Spare Parts</span> Online in India, <br></br> Get{" "}
            <span className="text-blue-600">Prices</span> for Second Hand & New
            Parts Now
          </h1>

          {/* 3. SUBTEXT */}
          <p className="max-w-[340px] mx-auto text-slate-500 mb-10">
            Connecting you with verified sellers for new and used car parts across India.
          </p>

          {/* 4. RESPONSIVE HERO IMAGE */}
          <div className="relative w-full max-w-[600px] mx-auto mb-12 animate-in fade-in zoom-in duration-700">
            {/* <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full -z-10" />{" "} */}
            {/* Subtle glow effect */}
            <Image
              src="/hero-image1.png" 
              alt="Parto Spare Parts Diagram"
              width={750}
              height={600}
              priority
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* 5. LEAD FORM: The Focal Point */}
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

        {/* Background Decorative Element */}
        <div className="fixed top-10 left-10 -z-10 opacity-[0.03] select-none pointer-events-none">
          <h2 className="text-[15vw] font-black leading-none italic uppercase">
            PARTO
          </h2>
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
