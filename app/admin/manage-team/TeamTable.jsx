"use client";

import React, { useState, useTransition } from "react";
import { useSession } from "next-auth/react"; // Import useSession
import { Loader2, AlertTriangle, Shield, ShieldAlert } from "lucide-react";
import { toggleAdminStatus } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function TeamTable({ initialAdmins }) {
  const { data: session } = useSession(); // Get current session
  const currentUser = session?.user;

  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  // Store the entire admin object intended for toggling
  const [adminToToggle, setAdminToToggle] = useState(null);

  const handleToggle = (admin) => {
    startTransition(async () => {
      const result = await toggleAdminStatus(admin.id, admin.isActive);

      if (result.success) {
        toast({
          title: admin.isActive ? "Access Revoked" : "Access Restored",
          description: `${admin.name}'s status has been updated.`,
          variant: admin.isActive ? "destructive" : "default",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
      setAdminToToggle(null); // Close modal on completion
    });
  };

  return (
    <>
      {/* LIGHTER TABLE CONTAINER */}
      <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden rounded-[1.5rem]">
        <table className="w-full text-left">
          {/* CLEANER HEADER */}
          <thead className="bg-slate-50/50 border-b-2 border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Administrator
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Role
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialAdmins.map((admin) => {
              // Check if this row belongs to the current user
              const isCuurentUser =
                currentUser?.id === admin.id ||
                currentUser?.email === admin.email;

              return (
                <tr
                  key={admin.id}
                  className="group hover:bg-slate-50/40 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.email}`}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          {admin.name}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        admin.role === "SUPER_ADMIN"
                          ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                          : "bg-slate-50 text-slate-600 border-slate-200",
                      )}
                    >
                      {admin.role === "SUPER_ADMIN" ? (
                        <ShieldAlert size={12} />
                      ) : (
                        <Shield size={12} />
                      )}
                      {admin.role.replace("_", " ")}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        admin.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700",
                      )}
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          admin.isActive ? "bg-green-600" : "bg-red-600",
                        )}
                      />
                      {admin.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {isCuurentUser ? (
                      // DISABLED BUTTON FOR CURRENT USER
                      <span className="inline-block py-2 px-4 bg-slate-100 text-slate-400 font-black uppercase italic text-[10px] rounded-lg border border-slate-200 cursor-not-allowed opacity-70">
                        Current User
                      </span>
                    ) : (
                      // TEXT-BASED TOGGLE BUTTON FOR OTHERS
                      <button
                        onClick={() => setAdminToToggle(admin)}
                        className={cn(
                          "py-2 px-4 font-black uppercase italic text-[10px] rounded-lg border transition-all active:scale-95",
                          admin.isActive
                            ? "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            : "bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300",
                        )}
                      >
                        {admin.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FIXED POSITION CONFIRMATION MODAL */}
      {adminToToggle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border-4 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] w-full max-w-sm rounded-2xl zoom-in-95 animate-in">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="p-2 bg-red-50 rounded-full border-2 border-red-100">
                <AlertTriangle size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">
                Confirm Action
              </h3>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
              Are you sure you want to{" "}
              {adminToToggle.isActive ? "deactivate" : "activate"}{" "}
              <span className="text-slate-900 font-bold">
                "{adminToToggle.name}"
              </span>
              ?{adminToToggle.isActive && " They will lose access immediately."}
            </p>
            <div className="flex gap-3">
              <button
                disabled={isPending}
                onClick={() => handleToggle(adminToToggle)}
                className={cn(
                  "flex-1 flex items-center justify-center py-3 px-4 text-white font-black uppercase italic text-xs rounded-xl transition-all active:scale-95",
                  adminToToggle.isActive
                    ? "bg-red-600 hover:bg-red-700 shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                    : "bg-green-600 hover:bg-green-700 shadow-[2px_2px_0px_0px_rgba(22,163,74,1)]",
                )}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : adminToToggle.isActive ? (
                  "Yes, Deactivate"
                ) : (
                  "Yes, Activate"
                )}
              </button>
              <button
                disabled={isPending}
                onClick={() => setAdminToToggle(null)}
                className="flex-1 py-3 px-4 bg-white border-2 border-slate-200 text-slate-900 font-black uppercase italic text-xs rounded-xl hover:bg-slate-50 hover:border-slate-900 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
