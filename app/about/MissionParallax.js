"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function MissionParallax() {
  const containerRef = useRef(null);

  // 1. Track scroll progress specifically for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 2. Transform values for the background and text parallax
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-slate-900"
    >
      {/* Background with Parallax Movement - Next.js Optimized */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2000"
          alt="Abstract Automotive Engineering"
          fill // Replaces w-full h-full
          className="object-cover opacity-30 grayscale"
          sizes="100vw" // Helps Next.js choose the right size
          priority={false} // Parallax usually appears mid-page, so lazy load is fine
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-20 bg-blue-500" />
          <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">
            The Mission
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight text-white leading-[1.1]">
          The market, <br /> without the walk.
        </h2>

        <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Stop driving from shop to shop. We’ve put the best dealers on your
          screen so you can find the right part and get back to the road.
        </p>
      </motion.div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-transparent animate-bounce" />
      </div>
    </section>
  );
}
