"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import {
  X,
  Upload,
  CheckCircle2,
  Loader2,
  Trash2,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// 1. Move outside and Memoize to prevent re-renders on every keystroke
const InputField = memo(({ label, value, onChange, icon }) => {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 flex items-center gap-2">
        {icon && icon} {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
      />
    </div>
  );
});

InputField.displayName = "InputField";

export default function CreateSupplierModal({
  lead,
  onClose,
  onUpdateSuccess,
}) {
  const { toast } = useToast();
  const [step, setStep] = useState("FORM");
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [fetchingBrands, setFetchingBrands] = useState(true);
  const [isAccountCreated, setIsAccountCreated] = useState(false);

  const [formData, setFormData] = useState({
    shopName: lead.shopName || "",
    contactName: lead.contactName || "",
    whatsAppNumber: lead.whatsAppNumber || "",
    locationText: lead.location || "",
    partsCondition: lead.partsCondition || "NEW",
    selectedBrands: [],
    shopImageUrl: "",
    shopImagePublicId: "",
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    async function getBrands() {
      try {
        const res = await fetch("/api/admin/brands?active=true");
        const data = await res.json();
        setBrands(data.brands || []);
      } catch (err) {
        toast({
          title: "System Error",
          description: "Could not load brands list.",
          variant: "destructive",
        });
      } finally {
        setFetchingBrands(false);
      }
    }
    getBrands();
  }, [toast]);

  // Use a stable callback for input changes
  const handleInputChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBrandSelect = useCallback((brandName) => {
    if (!brandName) return;
    setFormData((prev) => {
      if (prev.selectedBrands.includes(brandName)) return prev;
      return { ...prev, selectedBrands: [...prev.selectedBrands, brandName] };
    });
  }, []);

  const removeBrand = useCallback((brandName) => {
    setFormData((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.filter((b) => b !== brandName),
    }));
  }, []);

  // Logic for Image Uploading (same as before but optimized)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "parto_supplier_shop_upload_v1");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );
      const result = await res.json();
      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          shopImageUrl: result.secure_url,
          shopImagePublicId: result.public_id,
        }));
      } else {
        setUploadError("Upload failed.");
      }
    } catch (err) {
      setUploadError("Network error.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, leadId: lead.id }),
      });
      const result = await res.json();

      if (res.ok) {
        setIsAccountCreated(true);
        setStep("SUCCESS");
      } else {
        toast({
          title: "Validation Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({ title: "Server Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.shopName &&
    formData.contactName &&
    formData.whatsAppNumber &&
    formData.selectedBrands.length > 0;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-[20px_20px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        {step === "FORM" ? (
          <div className="p-10 space-y-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                  Onboard <span className="text-blue-600">Supplier</span>
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  ID: {lead.id}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 border-2 border-slate-900 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <InputField
                label="Shop Name"
                value={formData.shopName}
                onChange={(v) => handleInputChange("shopName", v)}
              />
              <InputField
                label="Owner Name"
                value={formData.contactName}
                onChange={(v) => handleInputChange("contactName", v)}
              />
              <InputField
                label="WhatsApp"
                value={formData.whatsAppNumber}
                onChange={(v) => handleInputChange("whatsAppNumber", v)}
              />
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                  Condition
                </label>
                <select
                  value={formData.partsCondition}
                  onChange={(e) =>
                    handleInputChange("partsCondition", e.target.value)
                  }
                  className="w-full p-4 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-sm outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="USED">USED</option>
                  <option value="BOTH">BOTH</option>
                </select>
              </div>
              <div className="col-span-2">
                <InputField
                  label="Shop Location"
                  value={formData.locationText}
                  onChange={(v) => handleInputChange("locationText", v)}
                  icon={<MapPin size={12} className="text-blue-600" />}
                />
              </div>
            </div>

            {/* BRAND SELECTION - Performance Optimized */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                Specialized Brands
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase italic border border-slate-900"
                  >
                    {b}{" "}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-400"
                      onClick={() => removeBrand(b)}
                    />
                  </span>
                ))}
              </div>
              <select
                disabled={fetchingBrands}
                onChange={(e) => handleBrandSelect(e.target.value)}
                className="w-full p-4 bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-sm"
              >
                <option value="">
                  {fetchingBrands ? "Loading..." : "+ Add a brand"}
                </option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* UPLOAD BOX */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
                Visual Verification
              </label>
              {!formData.shopImageUrl ? (
                <label
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-slate-100 rounded-3xl cursor-pointer hover:bg-slate-50 transition-all",
                    uploading && "opacity-50 pointer-events-none",
                  )}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-blue-600" />
                  ) : (
                    <Upload className="text-slate-300" />
                  )}
                  <span className="mt-2 text-[10px] font-bold text-slate-400">
                    UPLOAD SHOP PHOTO
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative w-full h-40 border-2 border-slate-900 rounded-3xl overflow-hidden group">
                  <img
                    src={formData.shopImageUrl}
                    className="w-full h-full object-cover"
                    alt="Shop"
                  />
                  <button
                    onClick={() => handleInputChange("shopImageUrl", "")}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all font-black uppercase text-xs"
                  >
                    <Trash2 className="mr-2" /> Remove Photo
                  </button>
                </div>
              )}
            </div>

            <button
              disabled={!isFormValid || loading || uploading}
              onClick={handleCreateAccount}
              className="w-full py-5 bg-blue-600 text-white border-2 border-slate-900 rounded-2xl font-black italic uppercase text-sm shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-30"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Verify & Onboard Supplier"
              )}
            </button>
          </div>
        ) : (
          <SuccessOverlay
            formData={formData}
            onComplete={() => {
              onUpdateSuccess();
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}

// 2. Separate Success View to reduce main component size
function SuccessOverlay({ formData, onComplete }) {
  return (
    <div className="p-16 flex flex-col items-center text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-50 border-2 border-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-100">
        <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={3} />
      </div>
      <div>
        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
          Partner Created
        </h3>
        <p className="mt-3 text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
          {formData.shopName} is now authorized to sell on PARTO.
        </p>
      </div>
      <button
        onClick={onComplete}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black italic uppercase text-xs tracking-widest shadow-[6px_6px_0px_0px_rgba(59,130,246,1)] hover:bg-blue-600 transition-all"
      >
        Return to Inbox
      </button>
    </div>
  );
}
