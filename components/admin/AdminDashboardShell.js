"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, Bell, X } from "lucide-react";
import Link from "next/link";

export function AdminDashboardShell({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans antialiased overflow-hidden">
      {/* Sidebar - Persistent on LG+, Slide-in on Mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 z-30">
          {/* Left: Mobile Menu Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
          >
            <Menu size={20} />
          </button>

          {/* Middle: Brand Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
              PARTO<span className="text-blue-600">.</span>
            </h1>
          </Link>

          {/* Right: Notifications */}
          <button className="relative p-2 hover:bg-blue-50 rounded-xl transition-all group">
            <Bell
              size={20}
              className="text-slate-500 group-hover:text-blue-600 transition-colors"
            />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
