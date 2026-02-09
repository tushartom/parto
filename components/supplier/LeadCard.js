"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageSquare,
  Star,
  Ban,
  CheckCheck,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { updateLeadInteractionAction } from "../../app/supplier/(portal)/leads/actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function LeadCard({ lead, variant = "all" }) {
  // 1. LOCAL STATE FOR OPTIMISTIC UI
  // This ensures the card vanishes instantly before the server even responds
  const [isVisible, setIsVisible] = useState(true);
  const [interacted, setInteracted] = useState(lead.interaction.hasInteracted);
  const [starred, setStarred] = useState(lead.interaction.isStarred);

  if (!isVisible) return null;

  const handleAction = async (type, value) => {
    // ---- BUSINESS LOGIC FOR TABS ----

    // In ALL tab: If ignored, vanish permanently
    if (variant === "all" && type === "isIgnored" && value === true) {
      setIsVisible(false);
    }

    if (variant === "STARRED" && type === "isIgnored" && value === true) {
      setIsVisible(false);
    }

    if (variant === "STARRED" && type === "isStarred" && value === false) {
      setIsVisible(false);
    }

    if (variant === "IGNORED" && type === "isIgnored" && value === false) {
      setIsVisible(false);
    }

    // Update internal toggles for immediate visual feedback
    if (type === "isStarred") setStarred(value);
    if (type === "hasInteracted") setInteracted(true);

    // BACKGROUND SYNC: Quietly update the database
    await updateLeadInteractionAction(lead.id, { [type]: value });
  };

  const openWhatsApp = () => {
    handleAction("hasInteracted", true);
    const partsList = lead.requestedParts.join(", ");
    const msg = encodeURIComponent(
      `Hi, I'm a supplier on PARTO. Regarding your ${lead.vehicleMake} ${lead.vehicleModel} request (${partsList}): could you please send a photo of the part you need? It will help me check the exact match in my stock.`,
    );
    window.open(
      `https://wa.me/${lead.buyer.phoneNumber}?text=${msg}`,
      "_blank",
    );
  };

  return (
    <div
      className={cn(
        "bg-white border-2 border-slate-300 p-6 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] transition-all animate-in fade-in zoom-in-95 duration-300",
        variant === "IGNORED" && "opacity-60 grayscale-[0.5]", // Faded look for trash bin
      )}
    >
      {/* HEADER: Model & Double Tick */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[16px] font-semibold text-slate-900 leading-tight">
            {lead.vehicleMake} {lead.vehicleModel} {lead.vehicleYear}
          </h3>
          <p className="text-[13px] font-semibold text-blue-600  mt-1">
            {lead.requestedParts.join(" • ")}
          </p>
          <p className="text-[12px] tracking-wide mt-3 font-semibold text-slate-400">
            Condition:{" "}
            <span className="text-[12px] text-slate-600">{lead.condition}</span>
          </p>
        </div>
        {interacted && (
          <div className="bg-blue-50 p-1.5 rounded-full border border-blue-100">
            <CheckCheck size={18} className="text-blue-500" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* METADATA: Condition, Location, Time */}
      <div className="grid grid-cols-2 items-center gap-y-4 mb-6 pt-3  border-t border-slate-50">
        {/* LEFT SIDE: Identification & Timing */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 mt-1">
            <MapPin size={14} className="text-red-500" />
            <span className="text-[13px] font-semibold text-slate-600 tracking-wide">
              {lead.locationText}
            </span>
          </div>
          <p className="text-[13px] font-semibold text-slate-600 ">
            {format(new Date(lead.createdAt), "dd MMM, hh:mm a")}
          </p>
          <p className="text-[13px] font-semibold text-slate-400  ">
            Ref No:{" "}
            <span className="text-slate-600 uppercase">
              #{lead.id.slice(-8)}
            </span>
          </p>
        </div>

        {/* RIGHT SIDE: Action Buttons */}
        <div className="flex justify-end gap-2">
          {/* BAN / RESTORE BUTTON */}
          <button
            onClick={() => handleAction("isIgnored", variant !== "IGNORED")}
            className={cn(
              "p-3.5 rounded-2xl transition-all active:scale-90",
              variant === "IGNORED"
                ? "bg-blue-600 text-white"
                : "bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50",
            )}
          >
            {variant === "IGNORED" ? (
              <RotateCcw size={18} strokeWidth={3} />
            ) : (
              <Ban size={18} strokeWidth={3} />
            )}
          </button>

          {/* STAR BUTTON */}
          <button
            onClick={() => handleAction("isStarred", !starred)}
            className={cn(
              "p-3.5 rounded-2xl transition-all active:scale-90",
              starred
                ? "bg-yellow-50 text-yellow-500 border border-yellow-100"
                : "bg-slate-50 text-slate-300",
            )}
          >
            <Star
              size={18}
              fill={starred ? "currentColor" : "none"}
              strokeWidth={3}
            />
          </button>
        </div>
      </div>

      {/* INTERACTION BAR */}
      <div className="flex items-center justify-between pt-5 border-t-2 border-dashed border-slate-100">
        {/* LEFT SIDE: Contextual Label */}
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic"></div>

        {/* PRIMARY CONTACT ACTIONS: Scaled Down */}
        <div className="flex gap-2.5">
          <button
            onClick={() => {
              handleAction("hasInteracted", true);
              window.location.href = `tel:${lead.buyer.phoneNumber}`;
            }}
            className="p-3 rounded-xl bg-slate-950 text-white hover:bg-blue-600 transition-all shadow-md active:scale-95"
          >
            <Phone size={18} fill="white" strokeWidth={2.5} />
          </button>
          <button
            onClick={openWhatsApp}
            className="p-3 rounded-xl bg-[#25D366] text-white hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <MessageSquare size={18} fill="white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
