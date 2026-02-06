import Link from "next/link";
import { Lock, UserX, MessageSquare } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-red-50 p-6">
      <div className="max-w-md w-full bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Deactivated Icon */}
        <div className="inline-block p-4 bg-red-100 border-2 border-black rounded-2xl mb-6">
          <UserX className="w-10 h-10 text-red-600" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-slate-900 leading-none">
          Account <br /> Deactivated
        </h1>

        <p className="font-bold text-slate-600 mb-8 uppercase text-[11px] leading-relaxed tracking-widest">
          Your administrative access has been suspended. You can no longer
          manage leads or view supplier data for the PARTO marketplace.
        </p>

        <div className="space-y-4">
          {/* Help Action: Opens a mailto or support link */}
          <a
            href="mailto:admin-support@parto.com"
            className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white font-black uppercase italic text-sm hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
          >
            <MessageSquare size={18} strokeWidth={3} />
            Contact Super Admin
          </a>

          {/* Secondary Action: Return to Login */}
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-3 w-full py-4 border-2 border-black bg-white text-black font-black uppercase italic text-sm hover:bg-slate-50 transition-all"
          >
            <Lock size={18} strokeWidth={3} />
            Try Different Login
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t-2 border-dashed border-red-200">
          <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">
            Security Status: ID Locked
          </p>
        </div>
      </div>
    </div>
  );
}
