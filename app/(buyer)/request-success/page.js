import React from "react";
import Link from "next/link";
import { 
  MessageCircle, 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Store,
  ShieldCheck 
} from "lucide-react";

import { getSuppliersByBrand } from "@/lib/inventory";

export default async function RequestSuccessPage({ searchParams }) {
    const resolvedParams = await searchParams;
  // 1. Extract data from the URL
  const { make, model, year, parts, location, leadId } = resolvedParams;

  // 2. Fetch suppliers matching this Brand (Make)
  const suppliers = await getSuppliersByBrand(make);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. STICKY ACTION HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-slate-900">
            <div className="p-2 rounded-xl group-hover:bg-slate-100 transition-all">
              <ArrowLeft size={20} />
            </div>
            <span className="font-black italic uppercase text-xs tracking-widest hidden sm:block">
              Back to Home
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Request ID:
            </span>
            <span className="text-[10px] font-black text-slate-900 uppercase">
              {leadId || "PART-SYNC"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        
        {/* 2. SUCCESS HERO (BLUE THEME) */}
        <section className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-900/10">
          <div className="relative z-10 max-w-2xl">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20">
              <CheckCircle2 size={32} strokeWidth={3} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none mb-6">
              Request <span className="text-blue-500">Confirmed.</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm md:text-base leading-relaxed">
              We've logged your requirement for {year} {make} {model}. 
              <br/>
              Below are verified {make} experts you can contact immediately.
            </p>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
        </section>

        {/* 3. SUPPLIER LIST SECTION */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-slate-900">
                Verified {make} <span className="text-blue-600">Specialists</span>
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Found {suppliers.length} active suppliers handling your vehicle brand
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <SupplierCard 
                key={supplier.id} 
                supplier={supplier} 
                context={{ make, model, year, parts, location }} 
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/**
 * Robust Supplier Card Component
 */
function SupplierCard({ supplier, context }) {
  const { make, model, year, parts, location } = context;

  // Senior implementation of WhatsApp message formatting
  const message = encodeURIComponent(
    `Hi ${supplier.shopName}, I found you on PARTO. \n\nI am looking for: ${parts}\nVehicle: ${year} ${make} ${model}\nLocation: ${location}\n\nDo you have these in stock?`
  );

  return (
    <div className="group bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 flex flex-col transition-all duration-300 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-50">
      <div className="flex items-start gap-5 mb-8">
        <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
          {supplier.shopImageUrl ? (
            <img src={supplier.shopImageUrl} alt={supplier.shopName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <Store size={32} className="text-slate-200" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-black italic uppercase text-lg text-slate-900 truncate tracking-tight">
              {supplier.shopName}
            </h4>
            <ShieldCheck size={16} className="text-blue-500 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <MapPin size={12} className="text-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest truncate">
              {supplier.locationText}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-50">
        <a
          href={`https://wa.me/${supplier.whatsAppNumber}?text=${message}`}
          target="_blank"
          className="w-full py-5 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-center gap-3 font-black italic uppercase text-xs tracking-widest transition-all shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:bg-slate-900 hover:text-white hover:shadow-none active:translate-y-1 active:shadow-none"
        >
          <MessageCircle size={18} />
          Contact Supplier
        </a>
      </div>
    </div>
  );
}