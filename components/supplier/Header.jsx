"use client";

import { useState, useEffect } from "react";
import { Search, Settings, Activity } from "lucide-react";

export function Header({ totalLeads, unmaskedLeads }) {
  const [shouldBounce, setShouldBounce] = useState(false);

  // Trigger bounce animation when leads count changes
  useEffect(() => {
    setShouldBounce(true);
    const timer = setTimeout(() => setShouldBounce(false), 300);
    return () => clearTimeout(timer);
  }, [totalLeads]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Refined Industrial Logo */}
        <div className="relative flex items-center justify-center w-9 h-9">
          {/* Outer Gear Icon */}
          <Settings
            className="absolute inset-0 w-full h-full text-slate-900"
            strokeWidth={1.5}
          />
          {/* Inner Search Icon (The "Part Finder" symbol) */}
          <Search
            className="relative w-3.5 h-3.5 text-orange-600"
            strokeWidth={3}
          />
        </div>

        <div className="flex flex-col -space-y-1">
          <span className="font-black text-xl tracking-tighter text-slate-900 italic">
            PAR<span className="text-orange-600 not-italic">TO</span>
          </span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] ml-0.5">
            Supplier Portal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Requests Today Pill */}
        <div
          className={`flex items-center h-9 gap-2 bg-slate-50 px-3 rounded-xl border border-slate-200 transition-all ${
            shouldBounce ? "animate-bounce" : ""
          }`}
        >
          <div className="flex flex-col items-start">
            <span className="text-xs font-black text-slate-900 leading-none">
              {totalLeads}
            </span>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">
              Requests
            </span>
          </div>
          {/* Animated Status Dot */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
          </div>
        </div>

        {/* Viewed Leads Pill */}
        <div className="flex items-center h-9 gap-2 bg-slate-900 px-3 rounded-xl border border-slate-800 shadow-lg shadow-slate-200">
          <div className="flex flex-col items-start">
            <span className="text-xs font-black text-white leading-none">
              {unmaskedLeads}
            </span>
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">
              Viewed
            </span>
          </div>
          <Activity className="w-3 h-3 text-orange-600" strokeWidth={3} />
        </div>
      </div>
    </header>
  );
}
