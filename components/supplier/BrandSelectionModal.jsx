"use client";

import { useState, useMemo } from "react";
import { X, Search, CheckCircle2 } from "lucide-react";
// import { BRANDS, TOP_BRANDS } from "@/lib/constants";

export function BrandSelectionModal({ onClose, onAddBrands, alreadySelected }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingSelection, setPendingSelection] = useState([]);

  const filteredBrands = useMemo(() => {
    return BRANDS.filter(
      (brand) =>
        brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !alreadySelected.includes(brand)
    ).sort();
  }, [searchQuery, alreadySelected]);

  const toggleBrand = (brand) => {
    setPendingSelection((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleConfirm = () => {
    onAddBrands(pendingSelection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          Manage Brands
        </h2>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="SEARCH BRANDS (E.G. MARUTI, TOYOTA)..."
            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-600/20 text-xs font-bold uppercase tracking-wider placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {!searchQuery && (
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Popular Brands
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {TOP_BRANDS.filter((b) => !alreadySelected.includes(b)).map(
                (brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-[11px] font-black uppercase tracking-tight ${
                      pendingSelection.includes(brand)
                        ? "bg-orange-50 border-orange-200 text-orange-700 shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {brand}
                    {pendingSelection.includes(brand) && (
                      <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            {searchQuery ? "Search Results" : "All Brands"}
          </h3>
          <div className="space-y-1">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    pendingSelection.includes(brand)
                      ? "bg-orange-50/50"
                      : "active:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      pendingSelection.includes(brand)
                        ? "text-orange-700"
                        : "text-slate-700"
                    }`}
                  >
                    {brand}
                  </span>
                  {pendingSelection.includes(brand) ? (
                    <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-full"></div>
                  )}
                </button>
              ))
            ) : (
              <p className="text-center text-slate-400 py-16 text-[10px] font-bold uppercase tracking-widest italic">
                No matching brands found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {pendingSelection.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-300">
          <button
            onClick={handleConfirm}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 transition-transform"
          >
            Add {pendingSelection.length}{" "}
            {pendingSelection.length === 1 ? "Brand" : "Brands"}
          </button>
        </div>
      )}
    </div>
  );
}
