"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw, LayoutGrid, Star, Trash2 } from "lucide-react";
import MarketFeed from "./MarketFeed";
import FilteredFeed from "./FilteredFeed";
import { useRefreshStore } from "@/lib/store/useRefreshStore";

export default function LeadsPage() {
  // Listen to the global refresh state
  const refreshKey = useRefreshStore((state) => state.refreshKey);
  const triggerRefresh = useRefreshStore((state) => state.triggerRefresh);

  return (
    <div className="space-y-6 pb-32 max-w-2xl mx-auto px-4">
      {/* 2. TABBED CONTENT */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1.5 rounded-[2rem] h-16 border border-slate-100">
          <TabsTrigger
            value="all"
            className="rounded-[1.6rem] font-semibold text-[14px] tracking-wide transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid size={14} strokeWidth={2} />
              All
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="starred"
            className="rounded-[1.6rem] font-semibold text-[14px] tracking-wide transition-all data-[state=active]:bg-white data-[state=active]:text-yellow-500 data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Star size={14} strokeWidth={2} />
              Starred
            </div>
          </TabsTrigger>

          <TabsTrigger
            value="ignored"
            className="rounded-[1.6rem] font-semibold text-[14px] tracking-wide transition-all data-[state=active]:bg-white data-[state=active]:text-red-500 data-[state=active]:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Trash2 size={14} strokeWidth={2} />
              Ignored
            </div>
          </TabsTrigger>
        </TabsList>

        {/* 3. FEEDS (Re-render when refreshKey changes) */}
        <TabsContent value="all" className="mt-6 outline-none">
          <MarketFeed key={`market-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="starred" className="mt-6 outline-none">
          <FilteredFeed type="STARRED" key={`starred-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="ignored" className="mt-6 outline-none">
          <FilteredFeed type="IGNORED" key={`ignored-${refreshKey}`} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
