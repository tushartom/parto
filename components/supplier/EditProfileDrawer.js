"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { X, Check, Save, Info } from "lucide-react";
import { updateSupplierProfile } from "@/app/actions/supplier/updateProfile";

export default function EditProfileDrawer({
  open,
  setOpen,
  supplier,
  allBrands,
}) {
  const [formData, setFormData] = useState({
    shopName: supplier.shopName,
    contactName: supplier.contactName,
    locationText: supplier.locationText,
    partsCondition: supplier.partsCondition,
    brandIds: supplier.brands.map((b) => b.id),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleBrand = (id) => {
    setFormData((prev) => ({
      ...prev,
      brandIds: prev.brandIds.includes(id)
        ? prev.brandIds.filter((bid) => bid !== id)
        : [...prev.brandIds, id],
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const result = await updateSupplierProfile(formData);
    setIsSubmitting(false);
    if (result.success) setOpen(false);
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[3rem] h-[94dvh] fixed bottom-0 left-0 right-0 z-[51] outline-none">
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-200 my-4" />

          <div className="flex-1 overflow-y-auto px-6 pb-32">
            <header className="flex justify-between items-center mb-8">
              <div>
                <Drawer.Title className="text-2xl font-black text-gray-900">
                  Edit Profile
                </Drawer.Title>
                <Drawer.Description className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Manage your business identity
                </Drawer.Description>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 bg-gray-50 rounded-full text-gray-400"
              >
                <X size={20} />
              </button>
            </header>

            <div className="space-y-8">
              {/* SHOP & OWNER */}
              <div className="grid grid-cols-1 gap-5">
                <InputGroup
                  label="Shop Name"
                  value={formData.shopName}
                  onChange={(v) => setFormData({ ...formData, shopName: v })}
                />
                <InputGroup
                  label="Owner/Contact Name"
                  value={formData.contactName}
                  onChange={(v) => setFormData({ ...formData, contactName: v })}
                />
              </div>

              {/* PARTS CONDITION SELECTOR */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-[0.2em]">
                  Inventory Type
                </label>
                <div className="flex p-1 bg-gray-50 rounded-2xl gap-1">
                  {["NEW", "USED", "BOTH"].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFormData({ ...formData, partsCondition: type })
                      }
                      className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${
                        formData.partsCondition === type
                          ? "bg-white text-blue-600 shadow-sm shadow-gray-200"
                          : "text-gray-400"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* FULL ADDRESS */}
              <div>
                <InputGroup
                  label="Detailed Shop Address"
                  value={formData.locationText}
                  onChange={(v) =>
                    setFormData({ ...formData, locationText: v })
                  }
                  isTextArea
                />
                <div className="mt-2 p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex gap-2">
                  <Info size={14} className="text-orange-500 shrink-0" />
                  <p className="text-[9px] font-bold text-orange-600 uppercase leading-relaxed">
                    Changing this address will trigger an admin review for your
                    locality/city status.
                  </p>
                </div>
              </div>

              {/* BRANDS MULTI-SELECT (Grid for 20+ Brands) */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-[0.2em]">
                  Brands Specialized In
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allBrands.map((brand) => {
                    const isSelected = formData.brandIds.includes(brand.id);
                    return (
                      <button
                        key={brand.id}
                        onClick={() => toggleBrand(brand.id)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                        }`}
                      >
                        {brand.name}
                        {isSelected && <Check size={14} strokeWidth={4} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ACTION FOOTER */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-50 backdrop-blur-lg">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                "Syncing..."
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function InputGroup({ label, value, onChange, isTextArea }) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 min-h-[120px] outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
        />
      )}
    </div>
  );
}
