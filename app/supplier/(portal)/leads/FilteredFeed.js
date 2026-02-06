"use client";

import React, { useEffect, useState, useCallback } from "react";
import { LeadCard } from "@/components/supplier/LeadCard";
import { fetchFilteredLeadsAction } from "./actions";
import { Loader2, Star, Trash2 } from "lucide-react";

export default function FilteredFeed({ type }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFilteredLeadsAction(type);
      if (result.data) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error(`Error loading ${type} feed:`, error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  if (!loading && leads.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 animate-in fade-in duration-500">
        <div className="p-5 bg-white rounded-3xl shadow-sm mb-6">
          {type === "STARRED" ? (
            <Star size={32} className="text-yellow-400" fill="currentColor" />
          ) : (
            <Trash2 size={32} className="text-red-300" />
          )}
        </div>
        <p className="text-slate-400 font-bold  text-[13px] tracking-wide text-center px-8 leading-relaxed whitespace-pre-line">
          {type === "STARRED"
            ? "Your shortlist is empty. \n Star leads to track them here."
            : "No ignored leads. \n Your feed is perfectly clean!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700">
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2
            className="animate-spin text-blue-600"
            size={32}
            strokeWidth={3}
          />
          <span className="font-black uppercase text-[9px] tracking-[0.3em] text-slate-400">
            Loading {type === "STARRED" ? "Shortlist" : "Archive"}...
          </span>
        </div>
      ) : (
        leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            variant={type} // Pass STARRED or IGNORED as variant
          />
        ))
      )}
    </div>
  );
}
