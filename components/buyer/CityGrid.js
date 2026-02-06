"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

export function CityGrid({ cities = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show only top 8 cities initially (2 rows on desktop)
  const visibleCities = isExpanded ? cities : cities.slice(0, 2);

  return (
    <section className=" bg-slate-950 text-white  border-2 border-slate-900 shadow-2xl">
      <div className="py-22 md:py-24 max-w-[1080px] mx-auto px-4 ">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center leading-none mb-12">
          Top <span className="text-blue-600">Markets</span>
        </h2>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCities.map((city) => (
            <Link
              key={city.id}
              href={`/spare-parts-in-${city.slug}`}
              className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl hover:bg-white hover:text-slate-950 transition-all duration-300 flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-black uppercase italic tracking-widest text-xs">
                  {city.name}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </div>

        {/* See All Button Logic */}
        {cities.length > 2 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-3 py-4 px-10 border-2 border-white/10 rounded-full transition-all hover:border-blue-600 hover:bg-blue-600 active:scale-95"
            >
              <span className="font-black uppercase italic text-xs tracking-[0.2em]">
                {isExpanded ? "Show less" : `See All Cities`}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
