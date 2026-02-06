"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Users,
  UserPlus,
  LogOut,
  ShieldCheck,
  PackageSearch,
  Settings,
  BarChart3,
  Bell,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const admin = session?.user;

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutGrid },
    {
      label: "Supplier Leads",
      href: "/admin/supplier-leads",
      icon: PackageSearch,
    },
    { label: "Active Suppliers", href: "/admin/suppliers", icon: Users },
    { label: "Market Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Alerts", href: "/admin/alerts", icon: Bell },
  ];

  return (
    <aside className="w-64 border-r border-slate-100 bg-white h-screen flex flex-col z-50">
      {/* 1. BRANDING (Simplified) */}
      <div className="p-8 pb-6">
        <Link href="/admin" className="group">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 transition-colors group-hover:text-blue-600">
            PARTO
            <span className="text-blue-600 group-hover:text-slate-900">.</span>
          </h1>
        </Link>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
          Admin Portal
        </p>
      </div>

      {/* 2. NAVIGATION (Minimalist) */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all duration-200",
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon
                size={16}
                className={cn(isActive ? "text-blue-400" : "text-slate-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 3. PROFILE & ACTIONS (Clean Layout) */}
      <div className="p-4 border-t border-slate-50">
        {/* Admin Profile */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 overflow-hidden shrink-0">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.email || "admin"}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase text-slate-900 truncate">
              {admin?.name || "Administrator"}
            </p>
            <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-blue-600 tracking-wider">
              <ShieldCheck size={10} />
              {admin?.role?.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Manage Team - Super Admin Only */}
        {admin?.role === "SUPER_ADMIN" && (
          <Link
            href="/admin/manage-team"
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all mb-2",
              pathname === "/admin/manage-team"
                ? "bg-blue-50 text-blue-700 border border-blue-100"
                : "text-slate-500 hover:bg-slate-50",
            )}
          >
            <UserPlus size={16} />
            Manage Team
          </Link>
        )}

        {/* Sign Out (Ghost Style) */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="group w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-red-600 transition-all duration-300 active:scale-95"
        >
          <LogOut
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="font-bold uppercase text-[10px] tracking-[0.2em] relative">
            Logout
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
          </span>
        </button>
      </div>
    </aside>
  );
}
