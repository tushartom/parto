import { ShieldCheck } from "lucide-react";
export default function TrustMetrics() {
  const metrics = {
    leadRequestCount: 4500,
    verifiedSupplierCount: 50,
    coverageLabel: "All India",
  };

  return (
    <section className=" border-b bg-slate-50 border-slate-200">
      <div className="py-22 md:py-24 max-w-[1080px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {/* Metric 1: Request Volume */}
          <div className="flex flex-col group items-center">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-blue-600 ">
                {(metrics.leadRequestCount / 1000).toFixed(0)}K
              </span>
              <span className="text-xl font-bold text-slate-400">+</span>
            </div>
            <p className="text-slate-500 font-black uppercase italic text-xs tracking-widest">
              Part Requests Fulfilled
            </p>
          </div>

          {/* Metric 2: Supplier Trust */}
          <div className="flex flex-col group items-center">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-blue-600 ">
                {metrics.verifiedSupplierCount}
              </span>
              <span className="text-xl font-bold text-slate-400">+</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-slate-500 font-black uppercase italic text-xs tracking-widest">
                Verified Suppliers
              </p>
              <ShieldCheck className="w-4 h-4 text-blue-500" strokeWidth={3} />
            </div>
          </div>

          {/* Metric 3: Geographical Reach */}
          <div className="flex flex-col group items-center">
            <div className="mb-3">
              <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-blue-600 uppercase leading-none">
                {metrics.coverageLabel}
              </span>
            </div>
            <p className="text-slate-500 font-black uppercase italic text-xs tracking-widest">
              Market Coverage
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
