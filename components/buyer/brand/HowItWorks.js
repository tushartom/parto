// // components/buyer/brand/how-it-works.jsx
// import React from "react";
// import { MessageSquare, ShieldCheck, Truck, Zap } from "lucide-react";

// const steps = [
//   {
//     icon: <Zap className="w-8 h-8" />,
//     title: "Post Requirement",
//     description:
//       "Tell us exactly what part you need, your car model, and your location in 30 seconds.",
//     color: "bg-orange-500",
//   },
//   {
//     icon: <MessageSquare className="w-8 h-8" />,
//     title: "Get Quotes",
//     description:
//       "Verified sellers from your area and across India will send you their best price quotes on WhatsApp.",
//     color: "bg-blue-600",
//   },
//   {
//     icon: <ShieldCheck className="w-8 h-8" />,
//     title: "Verify & Deal",
//     description:
//       "Compare prices, check part photos, and finalize the deal directly with the supplier.",
//     color: "bg-green-600",
//   },
//   {
//     icon: <Truck className="w-8 h-8" />,
//     title: "Fast Delivery",
//     description:
//       "Pick up the part locally or get it shipped to your doorstep with secure packaging.",
//     color: "bg-purple-600",
//   },
// ];

// export function HowItWorks({ brand }) {
//   const brandName = brand?.name || "your car";

//   return (
//     <section className="py-12 px-4 bg-white overflow-hidden md:px-18">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Section Header */}
//         <div className="mb-20">
//           <h2 className="text-5xl  md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
//             How it <span className="text-orange-600">Works</span>
//           </h2>
//           <p className="max-w-xl text-slate-500 font-bold text-sm uppercase tracking-[0.1em]">
//             The simplest way to source genuine parts for {brandName}.
//           </p>
//         </div>

//         {/* Steps Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
//           {/* Connector Line (Desktop Only) */}
//           <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-slate-100 -translate-y-12 -z-10" />

//           {steps.map((step, index) => (
//             <div
//               key={index}
//               className="group relative bg-white border-4 border-slate-900 rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(234,88,12,1)]"
//             >
//               {/* Step Number Badge */}
//               <div className="absolute -top-6 -right-4 w-12 h-12 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-orange-600 group-hover:text-white transition-colors">
//                 0{index + 1}
//               </div>

//               {/* Icon Container */}
//               <div
//                 className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center mb-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:rotate-6 transition-transform`}
//               >
//                 {step.icon}
//               </div>

//               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">
//                 {step.title}
//               </h3>

//               <p className="text-slate-500 font-bold text-sm leading-relaxed">
//                 {step.description}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// components/buyer/brand/how-it-works.jsx
import React from "react";
import { MessageSquare, ShieldCheck, Truck, Zap } from "lucide-react";

const steps = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Post Requirement",
    description:
      "Tell us exactly what part you need, your car model, and your location in 30 seconds.",
    color: "bg-blue-600",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Get Quotes",
    description:
      "Verified sellers from your area and across India will send you their best price quotes on WhatsApp.",
    color: "bg-blue-700",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Verify & Deal",
    description:
      "Compare prices, check part photos, and finalize the deal directly with the supplier.",
    color: "bg-blue-800",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Fast Delivery",
    description:
      "Pick up the part locally or get it shipped to your doorstep with secure packaging.",
    color: "bg-slate-900",
  },
];

export function HowItWorks({ brand }) {
  const brandName = brand?.name || "your car";

  return (
    <section className=" bg-white overflow-hidden border-b">
      <div className="max-w-[1080px] mx-auto px-4 md:py-24 py-22 ">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="text-4xl  font-black italic uppercase tracking-tighter leading-none mb-4 text-slate-900">
            How it <span className="text-blue-600">Works</span>
          </h2>
          <p className=" text-slate-400 font-bold text-xs uppercase tracking-wide ">
            The most efficient way to source genuine parts for your car
            nationwide.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative px-4 md:px-0">
          {/* Connector Line (Desktop Only) - Now using a cleaner slate tint */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-slate-100 -translate-y-12 -z-10" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white border-2 border-slate-900 rounded-[3rem] p-10 transition-all hover:-translate-y-3 hover:shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]"
            >
              {/* Step Number Badge - Blue Accent */}
              <div className="absolute -top-6 -right-4 w-14 h-14 bg-white border-2 border-slate-900 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                0{index + 1}
              </div>

              {/* Icon Container - Monochromatic Blue Scale */}
              <div
                className={`w-16 h-16 ${step.color} text-white rounded-2xl flex items-center justify-center mb-8 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] `}
              >
                {step.icon}
              </div>

              <h3 className="text-2xl font-bold italic uppercase tracking-tight mb-4 leading-6 text-slate-900">
                {step.title}
              </h3>

              <p className="text-slate-600 font-bold text-[14px] leading-relaxed ">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
