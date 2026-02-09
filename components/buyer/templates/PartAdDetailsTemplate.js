"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PartAdCard } from "../PartAdCard";
import {
  MapPin,
  ShieldCheck,
  MessageCircle,
  Share2,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Truck,
  Phone,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PartAdDetailsTemplate({ ad, relatedAds = [] }) {
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = ad.images || [];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* 1. MINIMAL NAV/BREADCRUMB */}
      {/* 1. FLOATING BACK NAVIGATION */}
      <div className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-slate-600 hover:text-blue-600 transition-colors group"
          >
            <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            Back
          </button>

          <div className="hidden md:flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
            <span>Marketplace</span>
            <ChevronRight size={10} />
            <span className="text-blue-500/60">{ad.brand.name}</span>
            <ChevronRight size={10} />
            <span className="text-slate-900">{ad.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-square bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <Image
              src={images[activeImageIndex]?.url || "/placeholder-part.jpg"}
              alt={ad.title}
              fill
              className="object-contain p-8"
              priority
            />
            {/* Overlay Condition */}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                {ad.condition} CONDITION
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={cn(
                  "relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white",
                  activeImageIndex === idx
                    ? "border-blue-600 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Info & Actions */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              {ad.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                <ShieldCheck size={14} className="text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                  Verified Listing
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-[12px] font-semibold tracking-wide">
                <MapPin size={14} />
                {ad.supplier.city}, {ad.supplier.state}
              </div>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                  Price
                </p>
                {ad.askForPrice ? (
                  <span className="text-xl font-bold text-blue-600   ">
                    Ask for Quote
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-400">₹</span>
                    <span className="text-2xl font-bold  text-slate-900">
                      {Number(ad.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
              <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* Direct Action */}
            <a
              href={`https://wa.me/${ad.supplier.whatsAppNumber}?text=Hi, I am interested in your listing: ${ad.title}`}
              target="_blank"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
            >
              <MessageCircle size={20} strokeWidth={2.5} />
              Contact via WhatsApp
            </a>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-bold uppercase text-slate-500 tracking-[0.1em] px-2">
              Technical Details
            </h4>
            <div className="bg-white border border-slate-100 rounded-[2rem] divide-y divide-slate-50 overflow-hidden">
              {[
                {
                  label: "Compatible Vehicle",
                  value: `${ad.brand.name} ${ad.model.name}`,
                  icon: PackageSearch,
                },
                { label: "Production Year", value: ad.year, icon: Calendar },
                {
                  label: "OEM / Part Number",
                  value: ad.oemNumber || "N/A",
                  icon: Info,
                },
                {
                  label: "Shipping",
                  value:
                    ad.deliveryOption?.replace("_", " ") || "In-store Pickup",
                  icon: Truck,
                },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="flex items-center justify-between p-5"
                >
                  <div className="flex items-center gap-3">
                    <spec.icon size={18} className="text-slate-500" />
                    <span className="text-[13px] font-bold text-slate-500  tracking-wide">
                      {spec.label}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-800">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Note */}
          {ad.supplierNote && (
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem]">
              <p className="text-[13px] font-bold text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Info size={12} /> Note from Supplier
              </p>
              <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                "{ad.supplierNote}"
              </p>
            </div>
          )}

          {/* Supplier Profile Card */}
          <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-[2rem]">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 font-black italic">
              {ad.supplier.shopName.charAt(0)}
            </div>
            <div>
              <p className="text-[15px] font-bold  text-slate-900">
                {ad.supplier.shopName}
              </p>
              <div className="flex items-center gap-1 text-[13px] font-bold text-slate-500 mt-0.5">
                <ShieldCheck size={14} className="text-emerald-500" /> Verified
                Supplier
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* 3. RELATED PARTS SECTION */}
      {/* 3. RELATED PARTS SECTION - Carefully Designed Background */}
      {relatedAds.length > 0 && (
        <section className="mt-24 relative w-screen left-1/2 -translate-x-1/2 bg-gradient-to-b from-blue-50/80 via-white to-white border-t border-slate-100/50 pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            {/* Refined Section Header */}
            <div className="flex flex-col items-center text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/40 border border-blue-100 rounded-full">
                <PackageSearch size={12} className="text-blue-600" />
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">
                  Recommendations
                </span>
              </div>
              <h2 className="text-3xl font-bold   text-slate-900 leading-none">
                Similar <span className="text-blue-600">Parts</span>
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
            </div>

            {/* Grid with improved spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {relatedAds.map((relatedAd) => (
                <div
                  key={relatedAd.id}
                  className="transition-transform duration-300 hover:-translate-y-2"
                >
                  <PartAdCard ad={relatedAd} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
