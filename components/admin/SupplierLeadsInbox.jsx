"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MessageCircle,
  Eye,
  Loader2,
  Calendar, // Added for date
  Phone, // Added for WhatsApp
  Info, // Added for Admin Notes
  Users, // Added for Contact Person
  PackageSearch, // Added for Inventory
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CreateSupplierModal from "./CreateSupplierModal";
import { adminFetch } from "@/lib/client-api";

const CACHE_TTL = 60 * 1000;

export function SupplierLeadsInbox() {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [cache, setCache] = useState({
    PENDING: { data: null, timestamp: 0, totalPages: 1, page: 1 },
    VERIFIED: { data: null, timestamp: 0, totalPages: 1, page: 1 },
    REJECTED: { data: null, timestamp: 0, totalPages: 1, page: 1 },
    counts: { PENDING: 0, VERIFIED: 0, REJECTED: 0 },
  });

  const fetchLeads = useCallback(
    async (status, page, forceRefresh = false) => {
      const now = Date.now();
      const isCacheValid =
        !forceRefresh &&
        cache[status].data &&
        cache[status].page === page &&
        now - cache[status].timestamp < CACHE_TTL;
      if (isCacheValid && !forceRefresh) return;

      setLoading(true);
      try {
        const res = await adminFetch(
          `/api/admin/supplier-leads?status=${status}&page=${page}`,
        );
        const result = await res.json();

        if (res.ok) {
          setCache((prev) => ({
            ...prev,
            [status]: {
              data: result.supplierLeads,
              timestamp: now,
              totalPages: result.totalPages,
              page: page,
            },
            counts: result.counts,
          }));
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (err) {
        toast({ title: "Sync Error", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
    [cache, toast],
  );

  useEffect(() => {
    fetchLeads(currentStatus, currentPage);
  }, [currentStatus, currentPage]);

  const handleGlobalRefresh = () => {
    setCache((prev) => ({
      ...prev,
      PENDING: { ...prev.PENDING, timestamp: 0 },
      VERIFIED: { ...prev.VERIFIED, timestamp: 0 },
      REJECTED: { ...prev.REJECTED, timestamp: 0 },
    }));
    fetchLeads(currentStatus, currentPage, true); // FIXED: Refresh current page
  };

  const activeData = cache[currentStatus].data || [];
  const totalPages = cache[currentStatus].totalPages || 1;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* HEADER SECTION (Remains standard) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Supplier Onboarding
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Last updated- {lastUpdated || "Initializing..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Pagination */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 hover:bg-slate-50 disabled:opacity-30 rounded-xl transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-1 text-[12px] font-bold text-slate-600">
              {currentPage} <span className="text-slate-300">/</span>{" "}
              {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 hover:bg-slate-50 disabled:opacity-30 rounded-xl transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={handleGlobalRefresh}
            className="p-3  text-white rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <RefreshCw
              className={cn(
                "w-4 h-4 text-slate-900",
                loading && "animate-spin",
              )}
              strokeWidth={3}
            />
          </button>
        </div>
      </div>

      {/* TABS (Remains standard) */}
      <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
        {["PENDING", "VERIFIED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setCurrentStatus(s);
              setCurrentPage(1);
            }}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-[10px] tracking-wider transition-all",
              currentStatus === s
                ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
            )}
          >
            {s} ({cache.counts[s]})
          </button>
        ))}
      </div>

      {/* TABLE CONTAINER WITH FIXED CENTERED STATES */}
      <div className="bg-white border border-slate-200 rounded-[1rem] shadow-sm overflow-hidden">
        {/* Horizontal Scroll Area only for the Headers & Existing Data */}
        <div className="overflow-x-auto">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              {/* table-fixed is now used with a minimum width to prevent collapse on small screens */}
              <table className="w-full table-fixed text-left border-collapse md:min-w-[1300px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    {/* 1. Main Column - Very Wide */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500 w-[200px]">
                      Shop & Owner
                    </th>

                    {/* 2. WhatsApp - Fixed Width */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500 w-[150px]">
                      WhatsApp
                    </th>

                    {/* 3. Location - Flexible */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500 w-[150px]">
                      Location
                    </th>

                    {/* 4. Condition - Fixed Width */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500 w-[100px]">
                      Condition
                    </th>

                    {/* 5. Submitted - Date needs space */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500 w-[100px]">
                      Submitted
                    </th>

                    {/* 6. Admin Notes - Flexible */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500 w-[200px]">
                      Admin Notes
                    </th>

                    {/* 7. Actions - Fixed */}
                    <th className="px-6 py-4 text-[12px] font-bold  tracking-wider text-slate-500  w-[100px]">
                      Actions
                    </th>
                  </tr>
                </thead>

                {activeData.length > 0 && (
                  <tbody className="divide-y divide-slate-100">
                    {activeData.map((lead) => (
                      <tr
                        key={lead.id}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        {/* 1. Shop & Owner */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-900 leading-tight mb-1 capitalize truncate">
                              {lead.shopName}
                            </span>
                            <span className="text-xs text-slate-500 truncate">
                              {lead.contactName}
                            </span>
                          </div>
                        </td>

                        {/* 2. WhatsApp */}
                        <td className="px-6 py-5">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                            {lead.whatsAppNumber}
                          </span>
                        </td>

                        {/* 3. Location */}
                        <td className="px-6 py-5">
                          <p className="text-xs font-semibold text-slate-600 truncate">
                            {lead.locationText}
                          </p>
                        </td>

                        {/* 4. Condition */}
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter">
                            {lead.partsCondition}
                          </span>
                        </td>

                        {/* 5. Submitted */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            <span>
                              {new Date(lead.submittedAt).toLocaleDateString(
                                "en-GB",
                              )}
                            </span>
                            <span className="text-slate-400 font-medium italic">
                              {new Date(lead.submittedAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                        </td>

                        {/* 6. Admin Notes */}
                        <td className="px-6 py-5">
                          <p className="truncate text-[11px] font-medium text-slate-400 italic">
                            {lead.adminNotes || "—"}
                          </p>
                        </td>

                        {/* 7. Actions */}
                        <td className="px-6 py-5 ">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-slate-900 hover:text-slate-900 transition-all"
                            >
                              <Eye size={16} strokeWidth={2} />
                            </button>
                            <a
                              href={`https://wa.me/${lead.whatsAppNumber}`}
                              className="p-2 text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                            >
                              <MessageCircle size={16} strokeWidth={2} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* CENTERED STATES OUTSIDE HORIZONTAL SCROLL */}
        {loading && !activeData.length && (
          <div className="py-32 flex flex-col items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="mt-4 font-black italic text-xs uppercase text-slate-400 tracking-widest">
              Loading Leads...
            </p>
          </div>
        )}

        {!loading && activeData.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white px-6">
            <div className="mb-6 p-6 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2rem]">
              {currentStatus === "PENDING" && (
                <Check className="w-12 h-12 text-green-500" strokeWidth={3} />
              )}
              {currentStatus === "VERIFIED" && (
                <Eye className="w-12 h-12 text-blue-500" strokeWidth={3} />
              )}
              {currentStatus === "REJECTED" && (
                <X className="w-12 h-12 text-slate-300" strokeWidth={3} />
              )}
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
              {currentStatus === "PENDING"
                ? "No Pending Reviews"
                : currentStatus === "VERIFIED"
                  ? "No Staging Leads"
                  : "No Rejected Leads"}
            </h3>
            <p className="mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] max-w-sm leading-relaxed">
              {currentStatus === "VERIFIED"
                ? "Every verified lead has already been converted into an active supplier account."
                : "There is no data to display in this category at the moment."}
            </p>
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => {
            setSelectedLead(null);
            handleGlobalRefresh();
          }}
          setCache={setCache}
          onCreateAccount={() => setShowCreateAccount(true)} // Transition to Account Creation
        />
      )}

      {/* CREATE SUPPLIER MODAL */}
      {showCreateAccount && selectedLead && (
        <CreateSupplierModal
          lead={selectedLead}
          onClose={() => {
            setShowCreateAccount(false);
            setSelectedLead(null);
          }}
          onUpdateSuccess={() => {
            setShowCreateAccount(false);
            setSelectedLead(null);
            handleGlobalRefresh();
          }}
          setCache={setCache}
        />
      )}
    </div>
  );
}

// ... LeadDetailsModal component (Remains same with setCache for instant sync) ...

// --- 3. UPDATED MODAL (Instant Notes Sync) ---
function LeadDetailsModal({
  lead,
  onClose,
  onUpdate,
  setCache,
  onCreateAccount,
}) {
  const [notes, setNotes] = useState(lead.adminNotes || "");
  const [saveStatus, setSaveStatus] = useState("idle");
  const timerRef = useRef(null);
  const { toast } = useToast();

  const handleAction = async (newStatus) => {
    try {
      const res = await fetch("/api/admin/supplier-leads", {
        method: "PATCH",
        body: JSON.stringify({ id: lead.id, status: newStatus }),
      });
      if (res.ok) {
        toast({ title: "Updated", description: `Lead marked as ${newStatus}` });
        onUpdate();
      }
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const saveNotes = async (val) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/admin/supplier-leads", {
        method: "PATCH",
        body: JSON.stringify({ id: lead.id, adminNotes: val }),
      });

      if (res.ok) {
        setSaveStatus("saved");
        // FIXED: Manually update the local cache so the table row updates instantly
        setCache((prev) => {
          const tabData = prev[lead.status];
          if (!tabData.data) return prev;
          const updatedRows = tabData.data.map((item) =>
            item.id === lead.id ? { ...item, adminNotes: val } : item,
          );
          return { ...prev, [lead.status]: { ...tabData, data: updatedRows } };
        });
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => saveNotes(val), 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] w-full max-w-2xl shadow-2xl shadow-slate-900/20 overflow-hidden ring-1 ring-black/5">
        <div className="p-8 lg:p-12 space-y-10">
          {/* 1. ELEGANT HEADER */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                {lead.shopName}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    lead.status === "PENDING"
                      ? "bg-amber-400"
                      : lead.status === "VERIFIED"
                        ? "bg-blue-500"
                        : "bg-slate-300",
                  )}
                />
                <p className="text-[11px] font-semibold  uppercase text-slate-400 tracking-widest">
                  {lead.status.replace("_", " ")} Lead Profile
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* 2. INFORMATION GRID (Refined Card) */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] px-8 py-5 lg:p-10">
            {[
              { label: "Contact Person", value: lead.contactName, icon: Users },
              {
                label: "WhatsApp",
                value: `+${lead.whatsAppNumber}`,
                icon: Phone,
              },
              {
                label: "Location",
                value: lead.locationText,
              },
              {
                label: "Inventory Type",
                value: lead.partsCondition,
                icon: PackageSearch,
              },
              {
                label: "Recorded On",
                value: new Date(lead.submittedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                icon: Calendar,
              },
            ].map((i) => (
              <div key={i.label} className="space-y-1.5">
                <p className="text-[12px] font-semibold text-slate-500 tracking-wide flex items-center gap-2">
                  {i.label}
                </p>
                <p className="text-[13px] font-semibold text-slate-700">
                  {i.value}
                </p>
              </div>
            ))}
          </div>

          {/* 3. CONTACT ACTION */}
          <a
            href={`https://wa.me/${lead.whatsAppNumber}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            <MessageCircle size={18} strokeWidth={2.5} /> Open WhatsApp Chat
          </a>

          {/* 4. CONTEXT NOTES (Sleek Textarea) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
                <Info size={14} className="text-blue-500" /> Administrative
                Context
              </label>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize  border",
                  saveStatus === "saved"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-blue-50 text-blue-600 border-blue-100 animate-pulse",
                )}
              >
                {saveStatus}
              </span>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              className="w-full h-28 p-4 bg-white border border-slate-200 rounded-[1.5rem] font-medium text-[13px] text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none resize-none transition-all shadow-sm placeholder:text-slate-300"
              placeholder="Add internal notes about this supplier..."
            />
          </div>

          {/* 5. ACTION FOOTER (Dynamic Colors) */}
          <div className="flex gap-4 pt-2">
            {lead.status === "PENDING" && (
              <>
                <button
                  onClick={() => handleAction("VERIFIED")}
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.25rem] font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  Approve Lead
                </button>
                <button
                  onClick={() => handleAction("REJECTED")}
                  className="flex-1 py-4 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-[1.25rem] font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Reject
                </button>
              </>
            )}
            {lead.status === "VERIFIED" && (
              <>
                <button
                  onClick={onCreateAccount}
                  className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all"
                >
                  Create Account
                </button>
                <button
                  onClick={() => handleAction("PENDING")}
                  className="px-8 py-4 text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors"
                >
                  Move back
                </button>
              </>
            )}
            {lead.status === "REJECTED" && (
              <button
                onClick={() => handleAction("PENDING")}
                className="flex-1 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-900 rounded-[1.25rem] font-bold text-xs uppercase tracking-widest transition-all"
              >
                Restore to Pending
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
