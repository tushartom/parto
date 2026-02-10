// app/(buyer)/layout.js
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, UserPlus, LogIn } from "lucide-react";

/**
 * 1. HEADER COMPONENT
 * Features a persistent hamburger menu for all screen sizes.
 */
// app/(buyer)/layout.js (Header Component update)
function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between relative">
        {/* LOGO */}
        <Link href="/" className="flex items-center group">
          <span className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
            PAR
            <span className="text-blue-600 group-hover:text-slate-900 transition-colors">
              TO
            </span>
          </span>
        </Link>

        <div className="flex flex-row items-center gap-4">
          <Link
            href="/about"
            className="relative group py-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 transition-colors"
          >
            About Parto
            
          </Link>
          {/* MENU TRIGGER & DROPDOWN CONTAINER */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                isOpen
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-slate-50 border-slate-100 text-slate-900 hover:border-slate-900"
              }`}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* COMPACT DROPDOWN BOX */}
            {isOpen && (
              <>
                {/* Invisible backdrop to close menu on outside click */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                <div className="absolute right-0 mt-4 w-72 bg-white border-2 border-slate-900 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 flex flex-col gap-2">
                    <p className="px-4 py-2 text-[13px] font-black uppercase tracking-[0.1em] text-slate-600">
                      Supplier Portal
                    </p>

                    <Link
                      href="/supplier/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <LogIn className="w-5 h-5 text-blue-600 group-hover:text-white" />
                      </div>
                      <span className="font-bold uppercase  text-xs tracking-wide">
                        Login
                      </span>
                    </Link>

                    <Link
                      href="/supplier/register"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <span className="font-bold uppercase  text-xs tracking-wide">
                        Register
                      </span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * 2. FOOTER COMPONENT
 * Simple, balanced, and professional for a Marketplace.
 */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
          
          {/* 1. BRAND IDENTITY */}
          <div className="space-y-2">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              PAR<span className="text-blue-600">TO</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Verified Spare Parts Marketplace
            </p>
          </div>

          {/* 2. COMPACT NAVIGATION */}
          <nav className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              { label: "Home", href: "/" },
              { label: "Supplier Portal", href: "/supplier/login" },
              { label: "About", href: "/about" },
              { label: "Support", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 hover:text-blue-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 3. LEGAL BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
            © {currentYear} PARTO • ALL RIGHTS RESERVED
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[9px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[9px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * 3. MAIN LAYOUT WRAPPER
 */
export default function BuyerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-600">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
