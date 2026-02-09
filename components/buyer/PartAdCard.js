"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  BadgeIndianRupee,
  Zap,
  CameraOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PartAdCard({ ad }) {
  // 1. Robust Image Handling: Fallback to a placeholder if JSON is empty or malformed
  const primaryImage =
    ad.images && Array.isArray(ad.images) && ad.images.length > 0
      ? ad.images[0].url
      : null;

  return (
    <Link
      href={`/${ad.slug}`}
      className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full active:scale-[0.98]"
    >
      {/* Visual Header: Image & Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 border-b border-slate-50 cursor-pointer">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={ad.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-200">
            <CameraOff size={40} strokeWidth={1} />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-2">
              No Image
            </span>
          </div>
        )}

        {/* Floating Condition Badge: High Contrast */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border shadow-sm backdrop-blur-md",
              ad.condition === "NEW"
                ? "bg-blue-600 text-white border-blue-500"
                : "bg-white/90 text-slate-900 border-slate-200",
            )}
          >
            {ad.condition}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-[17px] leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h3>
        </div>

        {/* Pricing Logic: Robust Decimal handling */}
        <div className="pt-4 mt-auto border-t border-slate-50 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide leading-none">
              Price
            </p>
            {ad.askForPrice ? (
              <span className="text-[15px] font-bold text-blue-600  ">
                Ask for Quote
              </span>
            ) : (
              <div className="flex items-baseline gap-0.5 text-slate-900">
                <span className="text-[15px] font-bold text-slate-400">₹</span>
                <span className="text-[16px] font-bold ">
                  {Number(ad.price).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Location & Trust Signals */}
          <div className="flex flex-col items-end">
            <p className=" text-[12px] font-bold text-slate-400">
              Ships From <span className="italic text-slate-600">{ad.supplier.city}, {ad.supplier.state}</span>
            </p>
            <div className="mt-1 flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full">
              <ShieldCheck size={10} className="text-emerald-500" />
              <span className="text-[12px] font-bold text-slate-500  ">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
