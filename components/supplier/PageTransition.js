"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    /* mode="wait" is the key to stopping the double UI */
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        /* This ensures the div doesn't add extra layout spacing during swap */
        className="w-full flex flex-col items-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
