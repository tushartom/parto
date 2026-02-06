import { signIn } from "@/auth";
import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      {/* Subtlest background texture for a premium feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="w-full max-w-[400px] relative z-10">
        {/* Branding/Logo Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Lock className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Parto <span className="text-slate-400 font-medium">Admin</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Please sign in to access the terminal
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-xl shadow-slate-200/50">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin/supplier-leads" });
            }}
            className="space-y-4"
          >
            <button
              type="submit"
              className="group w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <img
                src="/google-logo.svg"
                alt=""
                className="w-5 h-5 object-contain opacity-90"
              />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Verification Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-50/50 rounded-full border border-indigo-100/50 w-fit mx-auto">
            <ShieldCheck className="text-indigo-600 w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Secure Access
            </span>
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-8 text-center space-y-1">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">
            &copy; 2026 Parto Technologies
          </p>
        
        </div>
      </div>
    </div>
  );
}
