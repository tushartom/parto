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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 px-4">
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
            <span className="px-4 text-[12px] font-bold text-slate-600">
              Page {currentPage} <span className="text-slate-300 mx-1">/</span>{" "}
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
              "px-6 py-2.5 rounded-xl font-bold text-[11px] tracking-wider transition-all",
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
          <table className="w-full text-left border-collapse min-w-[1400px]">
            <thead className="border-b-2 border-slate-200 bg-slate-50/50">
              <tr>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600">
                  Shop
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600">
                  WhatsApp
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600">
                  Location
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600 text-center">
                  Condition
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600">
                  Submitted
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600">
                  Admin Notes
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-slate-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            {activeData.length > 0 && (
              <tbody className="divide-y-2 divide-slate-100">
                {activeData.map((lead) => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-6 font-black text-slate-900 uppercase italic text-sm">
                      {lead.shopName}
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600">
                      {lead.contactName}
                    </td>
                    <td className="px-8 py-6 text-xs font-mono font-bold text-blue-600">
                      {lead.whatsAppNumber}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 border-2 border-slate-900 rounded-lg bg-white text-[9px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {lead.partsCondition}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase italic">
                      {new Date(lead.submittedAt).toLocaleDateString()},{" "}
                      {new Date(lead.submittedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-8 py-6 max-w-[180px] truncate text-[11px] font-medium text-slate-400">
                      {lead.adminNotes || "—"}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2.5 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <Eye size={16} strokeWidth={3} />
                        </button>
                        <a
                          href={`https://wa.me/${lead.whatsAppNumber}`}
                          target="_blank"
                          className="p-2.5 border-2 border-green-600 text-green-600 rounded-xl"
                        >
                          <MessageCircle size={16} strokeWidth={3} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
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
function LeadDetailsModal({ lead, onClose, onUpdate, setCache, onCreateAccount }) {
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in">
      <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                {lead.shopName}
              </h3>
              <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">
                {lead.status} Lead Details
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 border-2 border-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 bg-slate-50 border-2 border-slate-900 rounded-[1.5rem] p-8">
            {[
              { label: "Contact Person", value: lead.contactName },
              { label: "WhatsApp Contact", value: `+${lead.whatsAppNumber}` },
              { label: "Parts Condition", value: lead.partsCondition },
              {
                label: "Submitted On",
                value: new Date(lead.submittedAt).toLocaleString("en-IN"),
              },
            ].map((i) => (
              <div key={i.label}>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  {i.label}
                </p>
                <p className="text-[13px] font-bold text-slate-800 mt-1">
                  {i.value}
                </p>
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/${lead.whatsAppNumber}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-green-600 text-green-600 rounded-xl font-black italic uppercase text-[11px] shadow-[4px_4px_0px_0px_rgba(22,163,74,0.1)]"
          >
            <MessageCircle size={16} strokeWidth={3} /> Contact on WhatsApp
          </a>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <label>Administrator Context Notes</label>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md border text-[9px]",
                  saveStatus === "saved"
                    ? "text-green-600"
                    : "text-blue-600 animate-pulse",
                )}
              >
                {saveStatus.toUpperCase()}
              </span>
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              className="w-full h-32 p-5 bg-slate-50 border-2 border-slate-900 rounded-[1.2rem] font-bold text-xs focus:bg-white outline-none resize-none transition-all shadow-inner"
              placeholder="Start typing context for this supplier..."
            />
          </div>

          <div className="flex gap-4">
            {lead.status === "PENDING" && (
              <>
                <button
                  onClick={() => handleAction("VERIFIED")}
                  className="flex-1 py-4 bg-green-500 text-white border-2 border-slate-900 rounded-2xl font-black italic uppercase text-[11px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                >
                  Verify Supplier
                </button>
                <button
                  onClick={() => handleAction("REJECTED")}
                  className="flex-1 py-4 bg-red-50 text-red-600 border-2 border-red-200 rounded-2xl font-black italic uppercase text-[11px] hover:bg-red-500 hover:text-white transition-all"
                >
                  Reject Lead
                </button>
              </>
            )}
            {lead.status === "VERIFIED" && (
              <>
                {/* Trigger the secondary modal flow */}
                <button
                  onClick={onCreateAccount}
                  className="flex-1 py-4 bg-blue-600 text-white border-2 border-slate-900 rounded-2xl font-black italic uppercase text-[11px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                  Create Account
                </button>
                <button
                  onClick={() => handleAction("PENDING")}
                  className="px-10 py-4 border-2 border-slate-200 text-slate-400 rounded-2xl font-black italic uppercase text-[11px] hover:border-slate-900"
                >
                  Revert
                </button>
              </>
            )}
            {lead.status === "REJECTED" && (
              <button
                onClick={() => handleAction("PENDING")}
                className="flex-1 py-4 border-2 border-slate-900 rounded-2xl font-black italic uppercase text-[11px] hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                Revert to Pending
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
