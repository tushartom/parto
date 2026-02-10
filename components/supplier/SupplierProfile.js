"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  MapPin,
  Package,
  Store,
  User,
  ChevronRight,
  ShieldCheck,
  Edit2,
} from "lucide-react";
import Image from "next/image";
import EditProfileDrawer from "./EditProfileDrawer";
import { updateSupplierProfileImage } from "@/app/actions/supplier/updateProfile";

export default function SupplierProfile({ supplier, allBrands }) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  // Use local state for immediate UI feedback
  const [displayImage, setDisplayImage] = useState(supplier.shopImageUrl);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant Preview
    const localUrl = URL.createObjectURL(file);
    setDisplayImage(localUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 2. Call the server action with the old Public ID
      const result = await updateSupplierProfileImage(
        supplier.id, // Pass the supplier ID
        formData,
        supplier.shopImagePublicId,
      );

      if (result.success) {
        // Handle database update confirmation or router.refresh()
        setDisplayImage(result.url);
      } else {
        alert("Failed to upload image. Please try again.");
        setDisplayImage(supplier.shopImageUrl); // Revert on error
      }
    } catch (err) {
      setDisplayImage(supplier.shopImageUrl);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localUrl); // Cleanup memory
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-40 relative">
      {/* 1. HEADER & AVATAR SECTION */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {/* Enhanced Avatar Frame */}
          <div className="w-32 h-32 rounded-[2.8rem] bg-white p-1 shadow-2xl shadow-blue-100 ring-1 ring-gray-100 overflow-hidden">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
              <Image
                src={displayImage || "/placeholder-shop.jpg"}
                alt={supplier.shopName}
                fill
                className={`object-cover transition-opacity duration-300 ${isUploading ? "opacity-50" : "opacity-100"}`}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* Verified Badge Overlay */}
          <div className="absolute -top-1 -right-1 bg-blue-600 text-white p-1.5 rounded-2xl border-4 border-white shadow-lg">
            <ShieldCheck size={16} strokeWidth={3} />
          </div>

          {/* Camera Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -bottom-2 -left-2 p-3 bg-white text-gray-400 rounded-2xl shadow-xl border border-gray-50 hover:text-blue-600 transition-all active:scale-90"
          >
            <Camera size={20} strokeWidth={2.5} />
          </button>
        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-900 ">
          {supplier.shopName}
        </h2>
        <div className="flex flex-col items-center gap-4 mt-3">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Verified Partner
          </span>
          {/* NEW INTEGRATED BUTTON */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl text-[13px] tracking-wide font-bold transition-all active:scale-95 border border-gray-100"
          >
            <Edit2 size={14} strokeWidth={3} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* 2. INFORMATION CARDS */}
      <div className="grid grid-cols-1 gap-4">
        {/* Business Identity */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
            <Store size={14} strokeWidth={3} /> Business Identity
          </h3>
          <div className="space-y-6">
            <ProfileField
              label="Contact Person"
              value={supplier.contactName}
              icon={User}
            />
            <ProfileField
              label="WhatsApp Number"
              value={supplier.whatsAppNumber}
              icon={null}
              isLocked
            />
          </div>
        </div>

        {/* Specialization */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
            <Package size={14} strokeWidth={3} /> Specialization
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase mb-3">
                Brands Covered
              </p>
              <div className="flex flex-wrap gap-2">
                {supplier.brands.map((brand) => (
                  <span
                    key={brand.id}
                    className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-[12px] font-bold text-gray-700"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase">
                  Dealing In
                </p>
                <p className="text-[12px] tracking-wide font-black mt-0.5 uppercase text-gray-600">
                  {supplier.partsCondition} Parts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Physical Address */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
          <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
            <MapPin size={14} strokeWidth={3} /> Full Address
          </h3>
          <p className="text-md font-bold text-gray-800 leading-tight">
            {supplier.locationText}
          </p>
          {/* <div className="text-[12px] font-semibold text-gray-400 bg-gray-100 px-2 mt-4 text-center py-1 rounded-lg  tracking-wide">
            Locked
          </div> */}
        </div>
      </div>

      {/* 4. DRAWER COMPONENT */}
      <EditProfileDrawer
        open={isEditing}
        setOpen={setIsEditing}
        supplier={supplier}
        allBrands={allBrands}
      />
    </div>
  );
}

function ProfileField({ label, value, icon: Icon, isLocked }) {
  return (
    <div className="flex flex-col group">
      <div className="flex gap-2 items-center">
        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {Icon ? (
            <div className="w-6 flex justify-center items-center">
              <Icon size={18} strokeWidth={2.5} className="text-slate-400" />
            </div>
          ) : (
            <div className="w-6 flex justify-center items-center">
              <span className="text-lg font-black text-slate-400">#</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase leading-none tracking-wider">
            {label}
          </p>
          <p className="text-[14px] font-bold text-gray-800 mt-1.5">{value}</p>
        </div>
      </div>

      {isLocked && (
        <div className="text-[12px] font-semibold text-gray-400 bg-gray-100 px-2 mt-4 text-center py-1 rounded-lg  tracking-wide">
          Locked
        </div>
      )}
    </div>
  );
}
