"use client";

import { LayoutDashboard, Package, Star, User, Plus } from "lucide-react";

export function Navigation({ currentView, onViewChange, onCreateClick }) {
  // Define the navigation tabs
  const tabs = [
    { id: "LEADS", label: "Leads", icon: LayoutDashboard },
    { id: "STOCK", label: "My Stock", icon: Package },
    { id: "CREATE", label: "Create", icon: null }, // Central Action Button
    { id: "STARRED", label: "Starred", icon: Star },
    { id: "PROFILE", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-4 pt-2 flex justify-between items-center">
      {tabs.map((tab) => {
        // Special rendering for the central "CREATE" action
        if (tab.id === "CREATE") {
          return (
            <button
              key={tab.id}
              onClick={onCreateClick}
              className="relative -top-8 flex flex-col items-center group"
            >
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-300 group-active:scale-90 transition-all border-4 border-white">
                <Plus
                  className="w-8 h-8 group-hover:text-orange-600 transition-colors"
                  strokeWidth={3}
                />
              </div>
              <span className="text-[10px] font-black text-slate-900 mt-1 uppercase tracking-widest">
                Post
              </span>
            </button>
          );
        }

        const isActive = currentView === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex flex-col items-center gap-1.5 min-w-[64px] transition-all active:scale-95 ${
              isActive ? "text-orange-600" : "text-slate-400"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${isActive ? "stroke-[3]" : "stroke-[2]"}`}
            />
            <span
              className={`text-[9px] font-black uppercase tracking-tight ${
                isActive ? "text-orange-600" : "text-slate-400"
              }`}
            >
              {tab.label}
            </span>
            {/* Active Indicator Dot */}
            {isActive && (
              <div className="w-1 h-1 bg-orange-600 rounded-full animate-in zoom-in duration-300"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
}
