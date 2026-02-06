import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-yellow-50 p-6">
      <div className="max-w-md w-full bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Warning Icon */}
        <div className="inline-block p-4 bg-yellow-100 border-2 border-black rounded-2xl mb-6">
          <ShieldAlert className="w-10 h-10 text-slate-900" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-slate-900">
          Access Restricted
        </h1>

        <p className="font-bold text-slate-600 mb-8 uppercase text-[11px] leading-relaxed tracking-widest">
          This email address is not authorized to access the PARTO Admin Portal.
          If you believe this is an error, please contact the system
          administrator.
        </p>

        <div className="space-y-4">
          {/* Primary Action: Try again (clears the current bad session) */}
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white font-black uppercase italic text-sm hover:bg-blue-600 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <LogOut size={18} strokeWidth={3} />
            Try Different Account
          </Link>

          {/* Secondary Action: Go back to public shop */}
          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full py-4 border-2 border-black bg-white text-black font-black uppercase italic text-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={3} />
            Back to Marketplace
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-slate-200">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Security Protocol: Login attempt logged.
          </p>
        </div>
      </div>
    </div>
  );
}
