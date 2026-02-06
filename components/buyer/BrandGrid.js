"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Car, ChevronDown, ChevronUp } from "lucide-react";

export function BrandGrid({ brands = [], citySlug = "delhi" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show only the first 12 brands initially (2 rows on desktop)
  const visibleBrands = isExpanded ? brands : brands.slice(0, 4);
  console.log(brands);
  return (
    <section className="  bg-slate-50">
      <div className="py-22 md:py-24 max-w-[1080px] mx-auto px-4">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 text-center leading-none mb-12">
          Shop by <span className="text-blue-600">Brand</span>
        </h2>

        {/* The Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visibleBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/${brand.slug}-parts-in-${citySlug}`}
              className="group p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-600 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 flex flex-col items-center justify-center text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-600  transition-all duration-300">
                <Car className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <span className="font-black uppercase italic text-sm tracking-tighter text-slate-600 group-hover:text-slate-900">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Toggle Button: "Simple and Beautiful" Strategy */}
        {brands.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-2 py-2 px-6 border-2 border-slate-900 rounded-full transition-all hover:bg-slate-900 hover:text-white active:scale-95 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:shadow-none"
            >
              <span className="font-black uppercase italic text-[11px] tracking-widest">
                {isExpanded ? "Show Less" : "See All Brands"}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-blue-600 group-hover:text-white" />
              ) : (
                <ChevronDown className="w-4 h-4 text-blue-600 group-hover:text-white" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
