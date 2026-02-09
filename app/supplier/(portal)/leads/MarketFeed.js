"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { LeadCard } from "@/components/supplier/LeadCard";
import { fetchMarketLeadsAction } from "./actions";
import { Loader2, SearchX } from "lucide-react";

export default function MarketFeed() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const initialFetchDone = useRef(false);
  const observerTarget = useRef(null);

  const loadLeads = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchMarketLeadsAction(page);
      if (result.data) {
        setLeads((prev) =>
          page === 1 ? result.data : [...prev, ...result.data],
        );

        if (result.data.length < 10) setHasMore(false);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Feed Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      loadLeads();
    }
  }, [loadLeads]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadLeads();
        }
      },
      { rootMargin: "400px" },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadLeads, hasMore, loading]);

  if (leads.length === 0 && !loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
        <SearchX size={32} className="text-slate-200 mb-4" />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] text-center">
          Market is quiet right now. <br /> Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} variant="all" /> // Updated variant
      ))}

      <div
        ref={observerTarget}
        className="h-40 flex justify-center items-center"
      >
        {loading && (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
              Scanning Market...
            </span>
          </div>
        )}
        {!hasMore && leads.length > 0 && (
          <p className="text-slate-400 text-[13px] font-semibold tracking-[0.1em]">
            End of Live Requests
          </p>
        )}
      </div>
    </div>
  );
}
