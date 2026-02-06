"use client";

import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronRight,
  MapPin,
  Phone,
  ArrowLeft,
  X,
  Loader2,
  Search,
} from "lucide-react";

import { leadSchema } from "@/lib/validations/lead";

const getYearRange = (start, end) => {
  const years = [];
  for (let i = end; i >= start; i--) years.push(i.toString());
  return years;
};

export function LeadForm({
  inventoryData = { brands: [], parts: [] },
  initialValues = { brand: "", model: "", city: "" },
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      make: initialValues.brand || "",
      model: initialValues.model || "",
      year: "",
      parts: [],
      condition: "Doesn't matter",
      location: initialValues.city || "",
      phone: "",
    },
  });

  // 1. WATCHING CORE FIELDS FOR PROGRESSIVE DISCLOSURE
  const [make, model, year] = watch(["make", "model", "year"]);
  const selectedParts = watch("parts");
  const selectedCondition = watch("condition");

  // Show the "Part Selection" logic only after vehicle identity is clear
  const showExtendedForm = make && model && year;

  const availableModels = useMemo(() => {
    const brandObj = inventoryData.brands.find((b) => b.name === make);
    return brandObj?.models || [];
  }, [make, inventoryData.brands]);

  const years = useMemo(() => getYearRange(2005, 2026), []);

  const filteredParts = useMemo(() => {
    if (!searchTerm) return [];
    const search = searchTerm.toLowerCase();
    return inventoryData.parts
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search) &&
          !selectedParts.includes(p.name),
      )
      .slice(0, 8);
  }, [searchTerm, selectedParts, inventoryData.parts]);

  const handleNext = async () => {
    const isStepValid = await trigger(["make", "model", "year", "parts"]);
    if (isStepValid) setStep(2);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      console.log(result);
     const params = new URLSearchParams({
          make: data.make,
          model: data.model,
          year: data.year,
          parts: data.parts.join(", "), // Convert array to string
          location: data.location,
          leadId: result.id // From your API response
        });

        // Redirect to the success page with data
        router.push(`/request-success?${params.toString()}`);
      } 
     catch (err) {
      alert("Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full max-w-2xl bg-white border-2 border-slate-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(37,99,235,1)] overflow-hidden transition-all duration-500">
      <div className="h-4 bg-slate-100 flex border-b-2 border-slate-900">
        <div
          className="bg-blue-600 transition-all duration-700 border-r-2 border-slate-900"
          style={{ width: step === 1 ? "50%" : "100%" }}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 text-left">
        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <header>
              <h2 className="md:text-5xl text-3xl font-bold text-center italic uppercase tracking-tighter leading-none">
                Check part <span className="text-blue-600">Price</span>
              </h2>
              <p className="text-slate-400 text-center font-bold text-[10px] md:mt-3 mt-2 uppercase tracking-[0.2em]">
                Step 01: Vehicle & Part Details
              </p>
            </header>

            {/* CORE VEHICLE FIELDS (Always Visible) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel label="Car Brand" error={errors.make} />
                <select
                  {...register("make")}
                  className="w-full md:p-5 px-4 py-2.5 md:rounded-2xl rounded-xl text-[13px] md:text-[15px] border-2 border-slate-100 focus:border-slate-900 focus:bg-white bg-slate-50 font-semibold uppercase appearance-none outline-none transition-all"
                >
                  <option value="">Select Brand</option>
                  {inventoryData.brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <FormLabel label="Car Model" error={errors.model} />
                <select
                  disabled={!make}
                  {...register("model")}
                  className="w-full md:p-5 px-4 py-2.5 md:rounded-2xl rounded-xl text-[13px] md:text-[15px] border-2 border-slate-100 focus:border-slate-900 focus:bg-white bg-slate-50 font-semibold uppercase appearance-none outline-none transition-all disabled:opacity-30"
                >
                  <option value="">Select Model</option>
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 w-full">
                <FormLabel label="Manufacturing Year" error={errors.year} />
                <select
                  disabled={!model}
                  {...register("year")}
                  className="w-full md:p-5 px-4 py-2.5 md:rounded-2xl rounded-xl text-[13px] md:text-[15px] border-2 border-slate-100 focus:border-slate-900 focus:bg-white bg-slate-50 font-semibold uppercase appearance-none outline-none transition-all disabled:opacity-30"
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* EXPANDABLE SECTION (Revealed only after Year is filled) */}
            {showExtendedForm && (
              <div className="space-y-8 animate-in slide-in-from-top-4 fade-in duration-500">
                <div className="h-px bg-slate-100 w-full" />

                <div className="space-y-2">
                  <FormLabel label="Part Condition" error={errors.condition} />
                  <div className="grid grid-cols-3 gap-2">
                    {["New", "Used", "Any"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setValue(
                            "condition",
                            opt === "Any" ? "Doesn't matter" : opt,
                          )
                        }
                        className={`md:py-4 py-2.5 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest transition-all ${
                          selectedCondition === opt ||
                          (opt === "Any" &&
                            selectedCondition === "Doesn't matter")
                            ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)]"
                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-900 hover:text-slate-900"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <FormLabel label="Search & Add Parts" error={errors.parts} />
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 md:w-5 md:h-5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Type part name..."
                      className="w-full pl-14 md:p-5 py-2 md:rounded-2xl rounded-xl border-2 text-[13px] md:text-[15px] border-slate-100 focus:border-slate-900 outline-none font-bold bg-slate-50 transition-all"
                    />
                    {isDropdownOpen && searchTerm.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-900 rounded-2xl shadow-2xl max-h-64 overflow-y-auto">
                        {filteredParts.map((part) => (
                          <button
                            key={part.id}
                            type="button"
                            onClick={() => {
                              setValue("parts", [...selectedParts, part.name]);
                              setSearchTerm("");
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-6 py-4 font-bold uppercase text-xs hover:bg-blue-50 hover:text-blue-600 border-b-2 border-slate-50 last:border-0 transition-colors"
                          >
                            + {part.name}{" "}
                            <span className="italic font-medium">
                              ({part.categoryName})
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Parts Badges */}
                {selectedParts.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-5 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200">
                    {selectedParts.map((part) => (
                      <span
                        key={part}
                        className="flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-slate-900"
                      >
                        {part}
                        <X
                          className="w-4 h-4 cursor-pointer text-blue-400"
                          onClick={() =>
                            setValue(
                              "parts",
                              selectedParts.filter((p) => p !== part),
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-slate-900 text-white md:py-6 py-3 md:rounded-2xl rounded-xl  font-black italic uppercase md:text-xl text-[15px] flex items-center justify-center group hover:bg-blue-600 transition-all shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] active:translate-y-1 active:shadow-none"
                >
                  Contact Details{" "}
                  <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <header>
              <h2 className="md:text-5xl text-3xl font-black italic uppercase tracking-tighter leading-none">
                Almost <span className="text-blue-600">Done!</span>
              </h2>
              <p className="text-slate-400 font-bold text-[10px] mt-3 uppercase tracking-[0.2em]">
                Sellers will send you prices on WhatsApp.
              </p>
            </header>

            <div className="space-y-6">
              <div className="space-y-2">
                <FormLabel label="Your Location" error={errors.location} />
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    {...register("location")}
                    placeholder="Enter City Name"
                    className="w-full pl-14 md:p-5 py-2.5 md:rounded-2xl rounded-xl border-2 border-slate-100 focus:border-slate-900 outline-none font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel label="WhatsApp Number" error={errors.phone} />
                <div className="relative flex">
                  <span className="flex items-center px-6 bg-slate-100 border-2 border-r-0 border-slate-100 rounded-l-2xl font-black text-slate-400">
                    +91
                  </span>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="99999XXXXX"
                    className="w-full md:p-5 py-2.5 rounded-r-2xl border-2 border-slate-100 focus:border-slate-900 outline-none font-black tracking-widest bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="col-span-1 md:p-6 py-2 border-2 border-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-900 transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-3 bg-blue-600 text-white md:py-6 py-2 rounded-2xl font-black italic uppercase text-[14px] md:text-xl flex items-center justify-center hover:bg-slate-900 transition-all shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ... helper components remain identical (but with blue color swaps) ...
function FormLabel({ label, error }) {
  return (
    <div className="flex justify-between items-center mb-1">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </label>
      {error && (
        <span className="text-[9px] font-black text-red-600 uppercase tracking-widest animate-pulse">
          {error.message}
        </span>
      )}
    </div>
  );
}

function SuccessState({ onReset }) {
  return (
    <div className="w-full max-w-md p-12 text-center bg-white border-4 border-slate-900 rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(34,197,94,1)]">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce border-2 border-green-600 shadow-xl">
        <Check className="w-12 h-12 text-green-600 stroke-[3]" />
      </div>
      <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-4">
        Request <span className="text-green-600">Locked In!</span>
      </h2>
      <p className="text-slate-500 font-bold mb-10 leading-snug">
        Verified sellers will contact you on WhatsApp shortly.
      </p>
      <button
        onClick={onReset}
        className="group mx-auto flex items-center justify-center gap-2 py-2 text-slate-900 transition-all duration-300 active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-blue-600 transition-transform group-hover:-translate-x-1" />
        <span className="font-black uppercase italic text-[11px] tracking-[0.2em] relative">
          Send Another Request
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
        </span>
      </button>
    </div>
  );
}
