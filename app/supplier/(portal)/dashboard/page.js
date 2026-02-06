import { LeadCard } from "@/components/supplier/LeadCard";
import { MOCK_LEADS } from "@/lib/constants";

export default function SupplierDashboard() {
  return (
    <section className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Buyer Requests
        </h1>
        <div className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-full border border-orange-200">
          LIVE FEED
        </div>
      </div>

      <div className="space-y-4">
        HELLO BROTHER!
      </div>
    </section>
  );
}
