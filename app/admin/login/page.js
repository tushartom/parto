import { signIn } from "@/auth";
import { Lock, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-6 font-sans">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white border-[4px] border-slate-900 rounded-[2.5rem] p-10 shadow-[20px_20px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Animated Icon Badge */}
          <div className="relative">
            <div className="w-20 h-20 bg-blue-500 border-4 border-slate-900 rounded-3xl flex items-center justify-center rotate-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
              <Lock className="text-white w-10 h-10" strokeWidth={3} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-400 border-2 border-slate-900 rounded-full flex items-center justify-center -rotate-12">
              <ShieldCheck className="text-slate-900 w-5 h-5" strokeWidth={3} />
            </div>
          </div>

          {/* Header Section */}
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Parto Admin
            </h1>
            <div className="mt-3 inline-block bg-slate-900 px-3 py-1 rounded-lg">
              <p className="text-[10px] font-bold uppercase text-white tracking-[0.2em]">
                Restricted Access
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin/supplier-leads" });
            }}
            className="w-full pt-4"
          >
            <button
              type="submit"
              className="w-full py-4 px-6 bg-white cursor-pointer text-slate-900 border-4 border-slate-900 rounded-2xl font-black italic uppercase text-sm shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              {/* Only show the image if it exists, otherwise use a fallback icon */}
              <div className="w-6 h-6 flex-shrink-0">
                <img
                  src="/google-logo.svg"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Footer Info */}
          <div className="pt-4 border-t-2 border-slate-100 w-full">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              System: PARTO-CORE-v2026
              <br />
              Network: Encrypted Auth.js Edge
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="fixed top-10 left-10 -z-10 opacity-10 select-none pointer-events-none">
        <h2 className="text-[15vw] font-black leading-none italic uppercase">
          PARTO
        </h2>
      </div>
    </div>
  );
}
