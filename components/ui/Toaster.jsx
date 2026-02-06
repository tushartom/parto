"use client";

import React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/Toast";
import { useToast } from "@/hooks/use-toast";

/**
 * Toaster Component
 * Renders the active notification stack using the useToast hook.
 * Optimized for Neubrutalist design with bold 4px borders and hard shadows.
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-sm font-black italic uppercase tracking-tighter text-slate-900">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="absolute right-4 top-4 rounded-md p-1 text-slate-300 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none group-hover:opacity-100" />
          </Toast>
        );
      })}
      {/* ToastViewport determines where on the screen the notifications appear */}
      <ToastViewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col p-8 md:max-w-[420px]" />
    </ToastProvider>
  );
}
