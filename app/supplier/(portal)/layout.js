// app/supplier/layout.tsx
import React from "react";
import SupplierHeader from "@/components/supplier/SupplierHeader";
import SupplierFooter from "@/components/supplier/SupplierFooter";
// import PageTransition from "@/components/supplier/PageTransition";

export default function SupplierLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      {/* HEADER: Sticky keeps it in flow but always visible */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <SupplierHeader />
      </header>

      {/* MAIN: PageTransition handles the swap */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-6 pb-32">
        {children}
      </main>

      <SupplierFooter />
    </div>
  );
}
