"use client";

import React, { useState, useMemo } from "react";
import {
  LayoutGrid,
  Settings, // Good for Engine/Transmission
  CarFront,
  Zap,
  Disc,
  X,
  ArrowRight,
  Gauge,
  Search,
  Settings2,
  PackageSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PartAdCard } from "./PartAdCard";

const CATEGORIES = [
  { id: "all", label: "All Ads", icon: LayoutGrid },
  { id: "body-exteriors", label: "Body", icon: CarFront },
  { id: "engine-transmission", label: "Engine", icon: Settings }, // Updated icon
  { id: "braking-system", label: "Braking", icon: Disc },
  { id: "suspension-steering", label: "Suspension", icon: Settings2 },
  { id: "electricals-ac", label: "Electrical", icon: Zap },
];

export function PartAdsSection({ initialAds }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [displayCount, setDisplayCount] = useState(8);

  // 1. COMBINED SEARCH & FILTER LOGIC
const filteredAds = useMemo(() => {
  return initialAds.filter((ad) => {
    // 1. Category Match (using slug)
    const matchesCategory =
      activeCategory === "all" || ad.category?.slug === activeCategory; // Matching the slug from your DB

    // 2. Keyword Match
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.model.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}, [activeCategory, searchQuery, initialAds]);

  const visibleAds = filteredAds.slice(0, displayCount);
  const hasMore = displayCount < filteredAds.length;

  return (
    <section className="relative w-full bg-gradient-to-b from-blue-50/50 via-white to-white pt-20 pb-22 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-6 space-y-6">
          <h2 className="text-3xl font-bold    text-slate-900">
            Part <span className="text-blue-600">Ads</span>
          </h2>

          {/* 2. INTEGRATED SEARCH BAR */}
          <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Search by part name, brand or model (e.g. 'Swift Bumper')..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(8); // Reset pagination on search
              }}
              className="w-full pl-14 pr-12 py-5 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY PILLS */}
        {/* CATEGORY PILLS - Mobile Optimized */}
        <div className="relative w-full mb-6">
          {/* Right Fade Mask (Visual Cue for scrolling) */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />

          <div className="flex overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 gap-3 md:flex-wrap md:justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setDisplayCount(8);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-[13px]  tracking-wide transition-all border flex-shrink-0",
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                    : "bg-white text-slate-500 border-slate-100 hover:border-blue-200",
                )}
              >
                <cat.icon
                  size={14}
                  className={
                    activeCategory === cat.id
                      ? "text-blue-400"
                      : "text-slate-400"
                  }
                />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS GRID */}
        {visibleAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleAds.map((ad) => (
              <PartAdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              No parts found
            </p>
          </div>
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-20 flex justify-center">
            <button
              onClick={() => setDisplayCount((prev) => prev + 8)}
              className="group flex items-center gap-3 px-12 py-5 bg-white border-2 border-slate-900 rounded-[2rem] font-black italic uppercase text-xs tracking-widest shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Explore More
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
