// components/supplier/SupplierFooter.js
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Megaphone, PlusSquare, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SupplierFooter() {
  const pathname = usePathname();

  const navItems = [
    { label: "Leads", href: "/supplier/leads", icon: LayoutGrid },
    { label: "My Ads", href: "/supplier/my-ads", icon: Megaphone },
    { label: "Create Ad", href: "/supplier/create-ad", icon: PlusSquare },
    { label: "Account", href: "/supplier/account", icon: UserCircle },
  ];

  return (
    <footer className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className="max-w-[400px] mx-auto bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 flex items-center justify-around p-2 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-2.5 px-3 sm:px-5 rounded-2xl transition-all gap-1 group",
                isActive ? "text-white" : "text-slate-500 hover:text-slate-300",
              )}
            >
              {/* SLIDING ACTIVE INDICATOR */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-600 rounded-[2rem] -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              <item.icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn("transition-transform", isActive && "scale-110")}
              />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
