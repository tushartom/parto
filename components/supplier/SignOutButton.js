"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const handleSignOut = () => {
    // Redirects to the supplier login page after clearing the session
    signOut({ callbackUrl: "/supplier/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="p-2 bg-red-50 text-red-600 border-2 text-[12px] flex items-center gap-1 border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95"
    >
      <LogOut size={14} strokeWidth={3} /> Sign Out
    </button>
  );
}
