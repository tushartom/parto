"use client";

import React from "react";
import { Bell, RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRefreshStore } from "@/lib/store/useRefreshStore";
import SignOutButton from "./SignOutButton";

export default function SupplierHeader() {
  const pathname = usePathname();
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);
  const isLeadsSection = pathname?.includes("/supplier/leads");

  return (
    <div className="h-16 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-50">
      {/* LOGO SECTION */}
      <div className="flex gap-2 items-center">
        <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
          PARTO<span className="text-blue-600">.</span>
        </span>
        <div className="px-2 py-0.5 bg-blue-50 text-[10px] font-bold uppercase text-blue-600 rounded-md border border-blue-100 ">
          Supplier
        </div>
      </div>

      {/* ACTION SECTION */}
      <div className="flex items-center gap-2 sm:gap-4">
        {isLeadsSection && (
          <button
            onClick={triggerRefresh}
            className="p-2.5 text-slate-400 hover:text-blue-600 active:rotate-180 transition-all duration-500 rounded-full hover:bg-blue-50"
          >
            <RefreshCcw size={18} strokeWidth={2.5} />
          </button>
        )}

        <button className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative">
          <Bell size={18} strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <SignOutButton />
      </div>
    </div>
  );
}
