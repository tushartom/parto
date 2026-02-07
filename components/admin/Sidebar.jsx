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
  BarChart3,
  Bell,
  LayoutGrid,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ isOpen, onClose }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const admin = session?.user;

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
    {
      label: "Supplier Leads",
      href: "/admin/supplier-leads",
      icon: PackageSearch,
    },
    { label: "Active Suppliers", href: "/admin/suppliers", icon: Users },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white pt-18 border-r border-slate-100 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
      )}
    >
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 transition-colors"
      >
        <X size={20} />
      </button>


      {/* 2. NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto ">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose()} // Auto-close on mobile selection
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all duration-300",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600",
              )}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 3. FOOTER SECTION */}
      <div className="p-6 mt-auto">
        {/* Profile Card */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-[2rem] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 p-[2px] shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-white border border-white">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.email || "admin"}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase text-slate-900">
                {admin?.name || "Administrator"}
              </p>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-full">
                {admin?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Log Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center justify-center gap-2 w-full py-3 text-slate-400 hover:text-red-500 font-bold uppercase text-[12px] tracking-widest transition-all"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
