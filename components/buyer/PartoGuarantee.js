import { Section, ShieldCheck } from "lucide-react";
export default function PartoGuarantee() {
    return (
      <section className="">
        <div className="py-22 md:py-24 max-w-[1080px] mx-auto px-4">
          <div className="relative p-12 border-2 border-slate-900 rounded-[3rem] bg-blue-50 overflow-hidden">
            {/* Subtle background decoration */}
            <ShieldCheck className="absolute -right-8 -bottom-8 w-64 h-64 text-blue-100 -rotate-12" />

            <div className="relative z-10 text-center flex flex-col md:text-left md:flex items-center md:gap-12">
              <div className="shrink-0 mb-8 md:mb-0">
                <div className="w-20 h-20 bg-white border-2 border-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <ShieldCheck className="w-10 h-10 text-slate-900" />
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-bold italic text-center uppercase tracking-tighter mb-4">
                  The PARTO <span className="text-blue-600">Guarantee</span>
                </h2>
                <p className="text-slate-600 font-bold text-center leading-relaxed text-sm md:text-base">
                  Every supplier on our platform undergoes a strict verification
                  process. Whether you need a used engine or a brand new bumper,
                  we ensure you connect with the right professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}