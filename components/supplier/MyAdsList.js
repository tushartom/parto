"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import MyAdCard from "./MyAdCard";
import { AdSubmissionDrawer } from "./AdDrawer";
import { deleteAd } from "@/app/actions/ad/delete-ad";
import { updateAdStatus } from "@/app/actions/ad/updateAdStatus";
export default function MyAdsList({ initialAds, metadata }) {
  const [ads, setAds] = useState(initialAds);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [activeTab, setActiveTab] = useState("ACTIVE"); 

  // 1. Filter Logic
  // Filters based on Part Name, Brand, or Model
  

 const handleDelete = async (adId) => {
   // 1. Save the current state in case we need to rollback
   const previousAds = [...ads];

   // 2. Optimistic Update: Remove from UI immediately
   setAds((prev) => prev.filter((ad) => ad.id !== adId));
//    toast.success("Ad removed");

   // 3. Trigger Server Action
   const result = await deleteAd(adId);

   if (!result.success) {
     // 4. Rollback: If server fails, bring the ad back and notify user
     setAds(previousAds);
     toast.error(result.error || "Failed to delete ad. Try again.");
   }
 };

 const filteredAds = ads.filter((ad) => {
    const matchesTab = ad.status === activeTab;
   const matchesSearch = `${ad.title} ${ad.brand.name} ${ad.model.name}`
     .toLowerCase()
     .includes(searchQuery.toLowerCase());

   return matchesTab && matchesSearch;
 });

 const tabs = [
   {
     label: "Active",
     value: "ACTIVE",
     count: ads.filter((a) => a.status === "ACTIVE").length,
   },
   {
     label: "Sold",
     value: "SOLD",
     count: ads.filter((a) => a.status === "SOLD").length,
   },
   {
     label: "Expired",
     value: "EXPIRED",
     count: ads.filter((a) => a.status === "EXPIRED").length,
   },
 ];

const handleStatusChange = async (adId, newStatus) => {
  const previousAds = [...ads];

  // 1. Optimistic Update: Change status locally so it moves tabs immediately
  setAds((prevAds) =>
    prevAds.map((ad) =>
      ad.id === adId 
        ? { ...ad, status: newStatus, createdAt: newStatus === "ACTIVE" ? new Date().toISOString() : ad.createdAt } 
        : ad
    )
  );

  // 2. Database Sync
  const result = await updateAdStatus(adId, newStatus);

  if (!result.success) {
    // 3. Rollback if server fails
    setAds(previousAds);
    // toast.error(result.error || "Failed to sync status. Try again.");
  }
};

 const handleUpdateLocal = (updatedAd) => {
   setAds((prevAds) =>
     prevAds.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)),
   );
 };
  return (
    <div className="space-y-6">
      {/* FILTER CHIPS */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-bold transition-all ${
              activeTab === tab.value
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                : "bg-white border border-gray-100 text-gray-500"
            }`}
          >
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                activeTab === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      {/* 1. SEARCH & FILTER BAR */}
      <div className="flex gap-2 sticky top-[73px] z-10 bg-gray-50/95 backdrop-blur-sm py-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by part or car..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* 2. THE LISTING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAds.map((ad) => (
          <MyAdCard
            key={ad.id}
            ad={ad}
            onEdit={() => setEditingAd(ad)}
            onDelete={() => handleDelete(ad.id)}
            onStatusChange={handleStatusChange}
          />
        ))}

        {filteredAds.length === 0 && searchQuery && (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 font-medium">
              No ads match "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* 3. EDIT DRAWER (Triggered when editingAd is set) */}
      {editingAd && (
        <AdSubmissionDrawer
          open={!!editingAd}
          setOpen={() => setEditingAd(null)}
          mode="edit"
          initialData={editingAd}
          metadata={metadata}
          onSuccess={handleUpdateLocal}
        />
      )}
    </div>
  );
}
