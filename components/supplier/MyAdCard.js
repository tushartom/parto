"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MoreVertical,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import { addDays, isAfter, differenceInDays } from "date-fns";

export default function MyAdCard({ ad, onEdit, onDelete, onStatusChange }) {
  const [showMenu, setShowMenu] = useState(false);

  // 1. EXPIRY & STATUS LOGIC
  const expiryDate = addDays(new Date(ad.createdAt), 7);
  const isActuallyExpired = isAfter(new Date(), expiryDate);
  const isExpired = ad.status === "EXPIRED" || isActuallyExpired;
  const daysLeft = Math.max(0, differenceInDays(expiryDate, new Date()));

  // 2. CLASS GENERATORS (No 'cn' utility needed)
  const getContainerClass = () => {
    const base =
      "relative px-5 py-6 transition-all border-2 rounded-[2rem] mb-2 ";
    if (ad.status === "SOLD") {
      return (
        base +
        "bg-green-50/80 border-green-200 shadow-[4px_4px_0px_0px_rgba(34,197,94,0.1)]"
      );
    }
    if (isExpired) {
      return base + "bg-slate-100 border-slate-200 opacity-80";
    }
    return base + "bg-white border-transparent shadow-sm";
  };

  const getTitleClass = () => {
    const base =
      "text-[14px] font-semibold  ";
    return base + (ad.status === "SOLD" ? "text-green-800" : "text-slate-900");
  };

  const getPriceClass = () => {
    const base = "text-[15px] font-semibold  ";
    return base + (ad.status === "SOLD" ? "text-green-600" : "text-blue-600");
  };

  return (
    <div className={getContainerClass()}>
      <div className="flex gap-5">
        {/* 1. THUMBNAIL SECTION */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border-2 border-white shadow-sm">
          <Image
            src={ad.images?.[0]?.url || "/placeholder-part.jpg"}
            alt={ad.title}
            fill
            className={`object-cover ${ad.status === "SOLD" ? "grayscale-[0.5]" : ""}`}
          />
          {/* CONDITION TAG */}
          <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-semibold px-2 py-0.5 rounded-lg uppercase tracking-widest">
            {ad.condition}
          </div>
        </div>

        {/* 2. CORE CONTENT SECTION */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="pr-10">
            {/* PART TITLE (Neo-Brutalist Style) */}
            <h4 className={getTitleClass()}>
              {ad.customPartName || ad.part?.name || "Spare Part"}
            </h4>

            {/* METADATA LINE */}
            <p className="text-[12px] text-slate-500 font-semibold mt-1 tracking-wider">
              {ad.brand?.name} • {ad.model?.name} • {ad.year}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            {/* PRICE */}
            <span className={getPriceClass()}>
              {ad.askForPrice
                ? "Negotiable"
                : `₹${Number(ad.price).toLocaleString("en-IN")}`}
            </span>

            {/* STATUS-SPECIFIC BADGES */}
            {ad.status === "ACTIVE" && !isActuallyExpired && (
              <span className="text-[10px] font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-md uppercase tracking-tighter flex items-center gap-1 border border-orange-100">
                <Clock size={12} strokeWidth={3} />
                {daysLeft}D LEFT
              </span>
            )}

            {ad.status === "SOLD" && (
              <span className="text-[10px] font-black text-green-700 bg-white/50 px-2 py-1 rounded-md uppercase tracking-widest border border-green-200">
                SOLD OUT
              </span>
            )}

            {isExpired && ad.status !== "SOLD" && (
              <span className="text-[10px] font-black text-slate-500 bg-white/50 px-2 py-1 rounded-md uppercase tracking-widest border border-slate-200">
                EXPIRED
              </span>
            )}
          </div>
        </div>

        {/* 3. MENU TRIGGER */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute top-6 right-4 p-2 text-slate-300 hover:text-slate-900 transition-colors bg-white/50 rounded-full"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* 4. BOTTOM ANALYTICS (Only visible for Active Ads) */}
      {ad.status === "ACTIVE" && (
        <div className="mt-5 flex items-center justify-end gap-5 border-t border-slate-50 pt-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Eye size={14} strokeWidth={3} />
            <span className="text-[12px] font-normal ">
              {ad.views || 0} Views
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <MessageSquare size={14} strokeWidth={3} />
            <span className="text-[12px] font-normal ">
              {ad.inquiries || 0} Chats
            </span>
          </div>
        </div>
      )}

      {/* 5. ACTION MENU OVERLAY */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-4 top-16 w-40 bg-white border-2 border-slate-400 rounded-[1rem] overflow-hidden shadow-xl z-40 animate-in fade-in slide-in-from-top-2">
            {ad.status === "ACTIVE" && !isActuallyExpired && (
              <>
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-3 text-[12px] font-semibold  text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Edit2 size={14} strokeWidth={3} /> Edit Listing
                </button>
                <button
                  onClick={() => {
                    onStatusChange(ad.id, "SOLD");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-3 text-[12px] font-semibold text-green-600 hover:bg-green-50 flex items-center gap-3"
                >
                  <CheckCircle2 size={14} strokeWidth={3} /> Mark as Sold
                </button>
              </>
            )}

            {(ad.status === "SOLD" || isExpired) && (
              <button
                onClick={() => {
                  onStatusChange(ad.id, "ACTIVE");
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-3 text-[12px] font-semibold  text-blue-600 hover:bg-blue-50 flex items-center gap-3"
              >
                <RefreshCw size={14} strokeWidth={3} />{" "}
                {isExpired ? "Relist Now" : "Re-activate"}
              </button>
            )}

            

            <button
              onClick={() => {
                onDelete();
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-3 text-[12px] font-semibold text-red-500 hover:bg-red-50 flex items-center gap-3"
            >
              <Trash2 size={14} strokeWidth={3} /> Delete Permanent
            </button>
          </div>
        </>
      )}
    </div>
  );
}
