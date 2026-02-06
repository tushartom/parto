// components/supplier/AdFormController.jsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adSchema } from "@/lib/validations/ad";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Section Components
import PhotoSection from "./PhotoSection";
import CompatibilitySection from "./CompatibilitySection";
import PartDetailSection from "./PartDetailSection";
import PricingDeliverySection from "./PricingDeliverySection";

import { publishAd } from "@/app/actions/ad/publishAd";
import { updateAd } from "@/app/actions/ad/updateAd";

const LOCAL_STORAGE_KEY = "parto_draft_ad";

export default function AdFormController({
  initialData = null,
  mode = "create",
  onClose,
  onSuccess,
  metadata = { brands: [], categories: [] },
}) {
  const isEditing = mode === "edit";
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents hydration mismatch

  const router = useRouter();
  // 1. Initialize Form with ALL fields from schema
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adSchema),
    defaultValues: initialData || {
      // Compatibility
      brandId: "",
      modelId: "",
      year: new Date().getFullYear(),
      // Part Details
      categoryId: "",
      partId: null,
      customPartName: "",
      condition: "USED",
      oemNumber: "",
      supplierNote: "",
      // Media
      images: [],
      // Price & Delivery
      price: null,
      askForPrice: false,
      deliveryOption: "PAN_INDIA",
    },
  });

  const formData = watch();

  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          // Use reset to update all fields safely
          reset(parsedDraft);
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
    setIsLoaded(true);
  }, [isEditing, reset]);

  // 3. Save to localStorage whenever formData changes (Create mode only)
  useEffect(() => {
    if (!isEditing && isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isEditing, isLoaded]);

  const onSubmit = async (data) => {
    try {
      let result;

      if (isEditing) {
        // Tag & Sweep: Pass the images removed during this session
        result = await updateAd(initialData.id, data, imagesToDelete);
      } else {
        result = await publishAd(data);
      }
 router.refresh();
      if (result?.success) {
        // toast.success(isEditing ? "Ad updated!" : "Ad published live!");
        // 4. Clear draft on successful publish

        if (!isEditing) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          reset({
            brandId: "",
            modelId: "",
            year: new Date().getFullYear(),
            categoryId: "",
            partId: null,
            customPartName: "",
            condition: "USED",
            oemNumber: "",
            supplierNote: "",
            images: [],
            price: null,
            askForPrice: false,
            deliveryOption: "PAN_INDIA",
          });
        }
        if (onSuccess) {
          onSuccess({ ...initialData, ...data });
        }
        if (onClose) {
          onClose(); // Close drawer if in Edit mode
        } else {
          router.push("/supplier/my-ads"); // Redirect if on Create page
        }
        router.refresh();
      } else {
        // toast.error(result?.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("SUBMISSION_ERROR:", error);
      toast.error("A server error occurred. Please try again.");
    }
  };
  if (!isLoaded) return null;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full bg-white"
    >
      {/* 4-Section Scrollable Form Body */}
      {/* Optimized Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar pb-8">
        {/* SECTION 1: IMAGES */}
        <section id="section-photos" className="pb-6 border-b border-gray-50">
          <header className="mb-3">
            <h3 className="text-base font-bold text-gray-900">1. Photos</h3>
            <p className="text-[11px] text-gray-500">
              Max 2 clear images of the part.
            </p>
          </header>
          <PhotoSection
            setValue={setValue}
            images={formData.images}
            isEditing={isEditing}
            setImagesToDelete={setImagesToDelete}
          />
          {errors.images && (
            <p className="text-red-500 text-[10px] mt-2 font-medium">
              {errors.images.message}
            </p>
          )}
        </section>

        {/* SECTION 2: COMPATIBILITY */}
        <section
          id="section-compatibility"
          className="pb-6 border-b border-gray-50"
        >
          <h3 className="text-base font-bold text-gray-900 mb-3">
            2. Vehicle Compatibility
          </h3>
          <CompatibilitySection
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            brands={metadata.brands}
          />
        </section>

        {/* SECTION 3: PART DETAILS */}
        <section
          id="section-part-details"
          className="pb-6 border-b border-gray-50"
        >
          <h3 className="text-base font-bold text-gray-900 mb-3">
            3. Part Details
          </h3>
          <PartDetailSection
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            categories={metadata.categories}
          />
        </section>

        {/* SECTION 4: PRICING & DELIVERY */}
        <section id="section-pricing" className="pb-4">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            4. Pricing & Logistics
          </h3>
          <PricingDeliverySection
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </section>
      </div>

      {/* STICKY ACTION FOOTER */}
      <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] sticky bottom-0">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isEditing ? "Saving Changes..." : "Publishing..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Post My Ad"
          )}
        </button>
      </div>
    </form>
  );
}
