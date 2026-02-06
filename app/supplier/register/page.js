"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link"; // Senior Note: Use Next.js Link for client-side navigation
import {
  Check,
  Loader2,
  ArrowRight,
  Store,
  User,
  MapPin,
  PackageCheck,
  AlertCircle,
  LogIn,
} from "lucide-react";

const registerSchema = z.object({
  shopName: z.string().min(3, "Shop name must be at least 3 characters"),
  ownerName: z.string().min(2, "Owner name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  city: z.string().min(2, "City is required"),
  condition: z.string().min(1, "Please select one condition"),
});

export default function SupplierRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null); // Track specific BE errors

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { condition: "NEW" }, // Senior Tip: Defaulting to NEW reduces user friction
  });

  const selectedCondition = watch("condition");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await fetch("/api/supplier/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle the specific codes we built in the backend
        if (
          result.error === "IDENTIFIED_SUPPLIER" ||
          result.error === "PENDING_REVIEW"
        ) {
          setServerError(result);
          return;
        }
        throw new Error(result.message || "Registration failed");
      }

      setIsSubmitted(true);
    } catch (err) {
      setServerError({
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) return <SuccessState />;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 pb-24">
      <div className="w-full max-w-xl bg-white border-4 border-slate-900 rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        <header className="bg-slate-900 p-8 text-white">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            Become a <span className="text-blue-500">Verified Seller</span>
          </h1>
          <div className="flex justify-between items-center mt-4">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              Join India's premium spare parts network
            </p>
            {/* Direct path for existing users */}
            <Link
              href="/supplier/login"
              className="text-blue-400 text-xs font-black uppercase flex items-center gap-1 hover:underline"
            >
              Already a seller? <LogIn size={14} />
            </Link>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Specific Error Notice */}
          {serverError && (
            <div className="bg-orange-50 border-2 border-orange-600 p-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-3">
                <AlertCircle className="text-orange-600 shrink-0" />
                <div>
                  <p className="font-black text-slate-900 uppercase italic leading-tight">
                    {serverError.message}
                  </p>
                  {serverError.error === "IDENTIFIED_SUPPLIER" && (
                    <Link
                      href="/supplier/login"
                      className="inline-flex items-center gap-2 mt-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors"
                    >
                      Go to Login <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Store size={12} /> Shop Name
              </label>
              <input
                {...register("shopName")}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none font-bold"
                placeholder="E.g. Karol Bagh Spares"
              />
              {errors.shopName && (
                <p className="text-[10px] text-red-500 font-bold uppercase">
                  {errors.shopName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={12} /> Owner Name
              </label>
              <input
                {...register("ownerName")}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none font-bold"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                WhatsApp Number
              </label>
              <div className="flex">
                <span className="p-4 bg-slate-50 border-2 border-r-0 border-slate-100 rounded-l-2xl font-black text-slate-400">
                  +91
                </span>
                <input
                  {...register("phone")}
                  className="w-full p-4 rounded-r-2xl border-2 border-slate-100 focus:border-blue-600 outline-none font-bold"
                  placeholder="99999XXXXX"
                />
              </div>
              {errors.phone && (
                <p className="text-[10px] text-red-500 font-bold uppercase">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin size={12} /> City
              </label>
              <input
                {...register("city")}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 outline-none font-bold"
                placeholder="E.g. Delhi"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <PackageCheck size={12} /> Parts You Offer
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["NEW", "USED", "BOTH"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setValue("condition", opt)}
                  className={`py-4 rounded-2xl border-2 font-black transition-all text-xs ${
                    selectedCondition === opt
                      ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]"
                      : "bg-white border-slate-100 text-slate-400 hover:border-blue-600"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.condition && (
              <p className="text-[10px] text-red-500 font-bold uppercase">
                {errors.condition.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black uppercase italic text-xl flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Apply to Sell <ArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ... (SuccessState remains the same)

function SuccessState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border-4 border-slate-900 rounded-[3rem] p-12 text-center shadow-[20px_20px_0px_0px_rgba(34,197,94,1)]">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <Check size={48} className="text-green-600" strokeWidth={3} />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-4">
          Application <span className="text-green-600">Received!</span>
        </h2>
        <p className="text-slate-500 font-bold text-sm leading-relaxed">
          Our admin team will verify your shop details and GST. You will receive
          an access link on WhatsApp within 24 hours.
        </p>
      </div>
    </div>
  );
}
