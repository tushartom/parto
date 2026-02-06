import {
  Car,
  Truck,
  ChevronRight,
  hardDrive,
  Settings2,
  ShieldCheck,
} from "lucide-react";

export function ModelMatrix({ brand, models }) {
  // Map car types to professional icons
  const getIcon = (type) => {
    switch (type) {
      case "suv":
        return <Car className="w-6 h-6" />;
      case "pickup":
        return <Truck className="w-6 h-6" />;
      default:
        return <Car className="w-6 h-6" />;
    }
  };

  return (
    <section className="px-6 py-20 max-w-6xl mx-auto border-t border-slate-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Settings2 className="text-orange-600 w-8 h-8" />
            SELECT YOUR {brand.name.toUpperCase()} MODEL
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Genuine spare parts organized by vehicle model.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          100% Fitment Guaranteed
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {models.map((model) => (
          <a
            key={model.id}
            href={`/spare-parts/${brand.slug}/${model.slug}`}
            className="group relative overflow-hidden bg-white border border-slate-200 rounded-xl p-5 hover:border-orange-600 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
          >
            {/* Subtle Background Icon */}
            <div className="absolute -right-2 -bottom-2 text-slate-50 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.07] transition-all duration-500">
              {getIcon(model.type)}
            </div>

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 flex items-center justify-center mb-4 transition-colors">
                {getIcon(model.type)}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold group-hover:text-orange-400 transition-colors">
                    {brand.name}
                  </span>
                  <h3 className="font-bold text-base text-slate-800 group-hover:text-slate-950 transition-colors">
                    {model.name}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-white" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
