"use client";

import { useEffect } from "react";

export default function PricingDeliverySection({
  register,
  errors,
  watch,
  setValue,
}) {
  // Watch the 'askForPrice' toggle to handle conditional logic
  const askForPrice = watch("askForPrice");

  // If 'Ask for Price' is toggled ON, clear the numerical price field
  useEffect(() => {
    if (askForPrice) {
      setValue("price", null);
    }
  }, [askForPrice, setValue]);

  return (
    <div className="space-y-8">
      {/* 1. PRICE INPUT & TOGGLE */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-gray-700">
            Expected Price (₹)
          </label>

          {/* Ask for Price Toggle */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <span className="text-[11px] font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
              ASK FOR PRICE
            </span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register("askForPrice")}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
          </label>
        </div>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            ₹
          </span>
          <input
            type="number"
            disabled={askForPrice}
            placeholder={askForPrice ? "Negotiable" : "0.00"}
            {...register("price", { valueAsNumber: true })}
            className={`w-full p-3.5 pl-8 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 disabled:opacity-40 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.price
                ? "border-red-500 focus:ring-red-100"
                : "border-gray-200 focus:ring-blue-100"
            }`}
          />
        </div>
        {errors.price && (
          <p className="text-red-500 text-[11px] mt-1 font-medium">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* 2. DELIVERY OPTION */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-gray-700">
          Delivery Availability
        </label>
        <select
          {...register("deliveryOption")}
          className={`w-full p-3.5 bg-gray-50 border rounded-xl outline-none transition-all focus:bg-white focus:ring-2 ${
            errors.deliveryOption
              ? "border-red-500 focus:ring-red-100"
              : "border-gray-200 focus:ring-blue-100"
          }`}
        >
          <option value="PAN_INDIA">Pan India Shipping</option>
          <option value="LOCAL_PICKUP">Local Pickup Only</option>
          <option value="STATE_ONLY">Within State Only</option>
          <option value="NEGOTIABLE">Negotiable with Buyer</option>
        </select>
        {errors.deliveryOption && (
          <p className="text-red-500 text-[11px] mt-1 font-medium">
            {errors.deliveryOption.message}
          </p>
        )}
        <p className="text-[10px] text-gray-400">
          Buyers prefer suppliers who can ship across India.
        </p>
      </div>
    </div>
  );
}
