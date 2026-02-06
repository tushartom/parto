"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Eye,
  Trash2,
  Edit3,
  CheckCircle,
  RotateCcw,
  Plus,
  Tag,
} from "lucide-react";

export function StockView({
  stock,
  onEdit,
  onDelete,
  onMarkSold,
  onRelist,
  onAddNew,
}) {
  const [stockFilter, setStockFilter] = useState("ACTIVE");

  // Logic to sort and filter stock
  const filteredStock = useMemo(() => {
    let items = [...stock];
    // Sort sold items to the bottom
    items.sort((a, b) => (a.isSold === b.isSold ? 0 : a.isSold ? 1 : -1));

    if (stockFilter === "ACTIVE") return items.filter((i) => !i.isSold);
    if (stockFilter === "SOLD") return items.filter((i) => i.isSold);
    return items;
  }, [stock, stockFilter]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          My Inventory
        </h1>
        <button
          onClick={onAddNew}
          className="bg-slate-900 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-slate-200"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Stock Filter Bar */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl mb-6 border border-slate-200">
        {["ACTIVE", "SOLD", "ALL"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStockFilter(filter)}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              stockFilter === filter
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {filter}{" "}
            {filter !== "ALL" &&
              `(${
                stock.filter((s) =>
                  filter === "ACTIVE" ? !s.isSold : s.isSold
                ).length
              })`}
          </button>
        ))}
      </div>

      {filteredStock.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            No {stockFilter.toLowerCase()} inventory items found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStock.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex relative transition-opacity ${
                item.isSold ? "opacity-60 grayscale-[0.5]" : ""
              }`}
            >
              {/* Sold Badge */}
              {item.isSold && (
                <div className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded flex items-center gap-1 shadow-xl border border-white/20 uppercase tracking-tighter">
                  Sold Out
                </div>
              )}

              {/* Image Thumbnail */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.partName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-slate-900 uppercase text-sm leading-tight line-clamp-1">
                      {item.partName}
                    </h3>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-black border uppercase tracking-tighter ${
                        item.isSold
                          ? "bg-slate-50 text-slate-400 border-slate-100"
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {item.make} {item.model} ({item.year})
                  </p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p
                      className={`font-black text-base ${
                        item.isSold ? "text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {typeof item.price === "number"
                        ? `₹${item.price.toLocaleString()}`
                        : "ASK FOR PRICE"}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                      <Eye className="w-3 h-3" />
                      {item.views} Views
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    {!item.isSold ? (
                      <>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2.5 bg-slate-50 text-slate-400 rounded-lg hover:text-slate-900 border border-slate-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onMarkSold(item.id)}
                          className="px-3 py-2.5 bg-slate-900 text-white text-[9px] font-black rounded-lg hover:bg-orange-600 transition-all uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Sold
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onRelist(item.id)}
                          className="px-3 py-2.5 bg-orange-600 text-white text-[9px] font-black rounded-lg hover:bg-slate-900 transition-all uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Relist
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-lg border border-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
