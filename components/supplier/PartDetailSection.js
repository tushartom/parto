"use client";

import { useState, useEffect } from "react";

export default function PartDetailSection({
  register,
  setValue,
  watch,
  errors,
  categories,
}) {
  const [parts, setParts] = useState([]);
  const [isLoadingParts, setIsLoadingParts] = useState(false);

  // Watch fields for dynamic logic
  const selectedCategoryId = watch("categoryId");
  const selectedPartId = watch("partId");

  // 1. Fetch parts when category changes
  useEffect(() => {
    const fetchParts = async () => {
      if (!selectedCategoryId) {
        setParts([]);
        return;
      }

      setIsLoadingParts(true);
      try {
        const response = await fetch(
          `/api/vehicles/parts?categoryId=${selectedCategoryId}`,
        );
        const data = await response.json();
        setParts(data || []);
      } catch (error) {
        console.error("Error fetching parts:", error);
      } finally {
        setIsLoadingParts(false);
      }
    };

    fetchParts();
  }, [selectedCategoryId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. CATEGORY */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <select
            {...register("categoryId")}
            className={`w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${
              errors.categoryId
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:ring-blue-100"
            }`}
            onChange={(e) => {
              register("categoryId").onChange(e);
              setValue("partId", ""); // Reset part when category changes
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-[11px] mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* 2. PART SELECTION */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">
            Specific Part
          </label>
          <select
            {...register("partId")}
            disabled={!selectedCategoryId || isLoadingParts}
            className={`w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 disabled:opacity-50 ${
              errors.partId
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:ring-blue-100"
            }`}
          >
            <option value="">
              {isLoadingParts ? "Loading..." : "Select Part"}
            </option>
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.name}
              </option>
            ))}
            <option value="other">Other (Type below)</option>
          </select>
        </div>
      </div>

      {/* 3. CUSTOM PART NAME (Conditional) */}
      {(selectedPartId === "other" || !selectedPartId) && (
        <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-bold text-gray-700">
            Custom Part Name
          </label>
          <input
            {...register("customPartName")}
            placeholder="e.g. Left Side Door Handle"
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          <p className="text-[10px] text-gray-400 italic">
            If you can't find the part in the list, type it here.
          </p>
        </div>
      )}

      {/* 4. CONDITION & OEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">Condition</label>
          <div className="flex p-1 bg-gray-100 rounded-xl">
            {["USED", "NEW", "ANY"].map((cond) => (
              <label key={cond} className="flex-1 cursor-pointer">
                <input
                  {...register("condition")}
                  type="radio"
                  value={cond}
                  className="hidden peer"
                />
                <div className="text-center py-2 text-xs font-bold rounded-lg transition-all peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-500">
                  {cond}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700">
            OEM Number (Optional)
          </label>
          <input
            {...register("oemNumber")}
            placeholder="e.g. 12345-ABC"
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* 5. SUPPLIER NOTE */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">Supplier Note</label>
        <textarea
          {...register("supplierNote")}
          rows={3}
          maxLength={80}
          placeholder="e.g. Slight scratch, but working perfectly."
          className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
        />
        <div className="flex justify-end">
          <span className="text-[10px] text-gray-400">
            {watch("supplierNote")?.length || 0}/80
          </span>
        </div>
      </div>
    </div>
  );
}
