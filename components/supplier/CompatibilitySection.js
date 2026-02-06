"use client";

import { useState, useEffect } from "react";

export default function CompatibilitySection({
  register,
  setValue,
  watch,
  errors,
  brands,
}) {
  const [models, setModels] = useState([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Watch the selected brandId to trigger model fetching
  const selectedBrandId = watch("brandId");

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedBrandId) {
        setModels([]);
        return;
      }

      setIsLoadingModels(true);
      try {
        // We fetch models based on the selected brand
        const response = await fetch(
          `/api/vehicles/models?brandId=${selectedBrandId}`,
        );
        const data = await response.json();
        setModels(data || []);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedBrandId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. BRAND (MAKE) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Vehicle Make</label>
        <select
          {...register("brandId")}
          className={`w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${
            errors.brandId
              ? "border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:ring-blue-100"
          }`}
          onChange={(e) => {
            // Reset model selection when brand changes
            register("brandId").onChange(e);
            setValue("modelId", "");
          }}
        >
          <option value="">Select Brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        {errors.brandId && (
          <p className="text-red-500 text-[11px] mt-1">
            {errors.brandId.message}
          </p>
        )}
      </div>

      {/* 2. MODEL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Model</label>
        <div className="relative">
          <select
            {...register("modelId")}
            disabled={!selectedBrandId || isLoadingModels}
            className={`w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.modelId
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:ring-blue-100"
            }`}
          >
            <option value="">
              {isLoadingModels ? "Loading..." : "Select Model"}
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {isLoadingModels && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {errors.modelId && (
          <p className="text-red-500 text-[11px] mt-1">
            {errors.modelId.message}
          </p>
        )}
      </div>

      {/* 3. YEAR */}
      <div className="flex flex-col gap-1.5 md:col-span-2">
        <label className="text-sm font-bold text-gray-700">
          Manufacturing Year
        </label>
        <input
          type="number"
          placeholder="e.g. 2021"
          {...register("year", { valueAsNumber: true })}
          className={`w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${
            errors.year
              ? "border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:ring-blue-100"
          }`}
        />
        {errors.year && (
          <p className="text-red-500 text-[11px] mt-1">{errors.year.message}</p>
        )}
      </div>
    </div>
  );
}
