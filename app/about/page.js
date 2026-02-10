"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Handshake,
  ShieldCheck,
  UsersThree,
  Target,
  ChartLineUp,
  SealCheckIcon,
  MoneyIcon,
  MapPinLineIcon,
  IdentificationCard,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

import { MissionParallax } from "./MissionParallax";


// 1. ANIMATION VARIANTS
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutPageTemplate() {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* SECTION 1: HERO - THE BRIDGE */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000"
            alt="Automotive Professional"
            fill
            className="object-cover opacity-40 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div {...fadeIn} className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                The Parto Network
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
              <span className="text-blue-500">Spare Parts,</span> <br /> Direct
              from the Dealer.
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
              PARTO connects you directly to a verified network of professional
              suppliers, ensuring every part is authentic and every deal is
              transparent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: TRUST STATS BAR */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-6">
        <div className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Verified Sellers", value: "50+", icon: ShieldCheck },
            { label: "Active Cities", value: "12", icon: Target },
            { label: "Parts Cataloged", value: "500+", icon: ChartLineUp },
            { label: "Direct Inquiries", value: "5k+", icon: Handshake },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center space-y-1"
            >
              <stat.icon
                size={24}
                weight="duotone"
                className="text-blue-600 mb-2"
              />
              <span className="text-3xl font-bold tracking-tighter">
                {stat.value}
              </span>
              <span className="text-[12px] font-bold text-slate-500  tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. THE FIX: PAIN VS PROGRESS GRID */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-16 space-y-4">
          <h2 className="text-4xl font-black italic uppercase tracking-tight">
            The market is broken. <br />
            <span className="text-blue-600">We’re the fix.</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Finding a part shouldn't be a full-time job. We removed the heat,
            the traffic, and the guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPinLineIcon,
              title: "The Hunt",
              problem:
                "Driving for hours and walking through crowded markets just to hear 'no stock.'",
              solution:
                "Search every shop in the city from your phone in 5 seconds.",
              color: "text-blue-600",
            },
            {
              icon: MoneyIcon,
              title: "The Tax",
              problem:
                "Middlemen and brokers hide the real price and take a cut of your money.",
              solution:
                "Deal directly with the shop owner. No hidden fees, just the real price.",
              color: "text-slate-900",
            },
            {
              icon: SealCheckIcon,
              title: "The Risk",
              problem:
                "Not knowing if a seller is real or if the part is actually on the shelf.",
              solution:
                "We visit and verify every shop in person so you don't have to.",
              color: "text-blue-600",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              {...fadeIn}
              className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all"
            >
              <div className="space-y-8">
                <item.icon size={40} weight="duotone" className={item.color} />
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500">
                        The Pain
                      </span>
                      <p className="text-sm text-slate-500 font-medium italic mt-1 leading-relaxed">
                        "{item.problem}"
                      </p>
                    </div>
                    <div className="h-px w-full bg-slate-200" />
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                        The Parto Way
                      </span>
                      <p className="text-sm text-slate-900 font-bold mt-1 leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <MissionParallax />

      {/* SECTION 4: THE PROCESS (Steps) */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-black italic uppercase tracking-tight">
              How Parto Operates
            </h2>
            <p className="text-slate-400 text-sm uppercase tracking-[0.1em] font-bold">
              A three-stage connection layer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Demand Creation",
                desc: "Buyers submit high-intent requests through our optimized search and lead forms.",
              },
              {
                step: "02",
                title: "Network Pulse",
                desc: "Verified suppliers are instantly alerted, creating a real-time response ecosystem.",
              },
              {
                step: "03",
                title: "Direct Connect",
                desc: "Parties negotiate directly via WhatsApp, removing the friction of middlemen.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group"
              >
                <span className="absolute -top-4 -right-4 text-9xl font-black text-slate-50 group-hover:text-blue-50 transition-colors">
                  {item.step}
                </span>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-32 text-center max-w-5xl mx-auto px-6">
        <motion.div {...fadeIn} className="space-y-10">
          <div>
            <h2 className="text-4xl font-black italic uppercase mb-2 tracking-tight leading-tight">
              India’s Premier <span className="text-blue-600">Automotive Network</span>
            </h2>
            <p className="text-[16px] "> 
              Skip the middlemen. Connect directly with verified dealers and
              find the parts you need without the market fatigue.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase text-[13px] tracking-[0.1em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
              Explore the Market
            </button>
            <button className="px-12 py-5 bg-white border border-slate-200 text-slate-900 rounded-full font-black uppercase text-[13px] tracking-[0.1em] hover:bg-slate-50 transition-all">
              Register as a Dealer
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
