"use client";

import { Zap, MessageSquare, ShieldCheck, Truck } from "lucide-react";

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

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div
                className={`${step.color} rounded-full p-4 mb-4 text-white shadow-lg`}
              >
                {step.icon}
              </div>

              {/* Step Number */}
              <span className="text-sm font-semibold text-blue-600 mb-2">
                Step {index + 1}
              </span>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600">{step.description}</p>

              {/* Arrow Connector (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-full top-1/2 transform translate-x-4 -translate-y-1/2">
                  <svg
                    className="w-8 h-8 text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        
      </div>
    </section>
  );
}
