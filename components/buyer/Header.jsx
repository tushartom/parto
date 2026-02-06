"use client";

import { useState } from "react";
import { Menu, X, Settings, Plus, LinkIcon } from "lucide-react";
import { Button } from "@/components//buyer/ui/button";
import Link from "next/link";
export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1.5 shrink-0">
              <span className="font-black text-2xl tracking-tighter text-slate-900 italic">
                PAR<span className="text-orange-600 not-italic">TO</span>
              </span>
            </Link>
          </div>

          <nav className="hidden gap-4 md:flex">
            <Button
              variant="ghost"
              className="text-foreground hover:text-accent"
            >
              Seller Login
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Become a Seller
            </Button>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay background */}
            <div
              className="absolute inset-0 bg-transparent"
              onClick={() => setIsOpen(false)}
            />

            {/* Compact modal in top-right corner */}
            <div className="absolute right-4 top-16 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-in fade-in zoom-in-95">
              {/* Partner Access Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Partner Access
                </h3>

                <div className="space-y-3">
                  {/* Supplier Login */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium text-sm"
                  >
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                    <span>Supplier Login</span>
                  </button>

                  {/* Become a Supplier Button */}
                  <Button className="w-full bg-accent text-white hover:bg-accent/90 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg">
                    <Plus className="h-4 w-4" />
                    Become a Supplier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
