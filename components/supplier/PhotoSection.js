"use client";

import { useState } from "react";
import Image from "next/image";
import { Controller } from "react-hook-form";

export default function PhotoSection({
  control,
  setValue,
  images,
  isEditing,
  setImagesToDelete,
}) {
  const [isUploading, setIsUploading] = useState(false);

  // 1. Cloudinary Upload Logic
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "parto_ads_upload_v1"); // Preset with 'status:temp' tag


    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    return { public_id: data.public_id, url: data.secure_url };
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding these will exceed the 2-image limit
    if (images.length + files.length > 2) {
      alert("Maximum 2 images allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadToCloudinary(file));
      const uploadedImages = await Promise.all(uploadPromises);

      // Update React Hook Form state
      setValue("images", [...images, ...uploadedImages], {
        shouldValidate: true,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Remove Image Logic
  const removeImage = (indexToRemove) => {
    const imageToExclude = images[indexToRemove];

    // If we are editing, track this ID for permanent deletion on "Save"
    if (isEditing && imageToExclude.public_id) {
      setImagesToDelete((prev) => [...prev, imageToExclude.public_id]);
    }

    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Render Uploaded Images */}
        {images.map((img, index) => (
          <div
            key={img.public_id}
            className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-100"
          >
            <Image
              src={img.url}
              alt="Part preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        ))}

        {/* Upload Button (Only show if less than 2 images) */}
        {images.length < 2 && (
          <label
            className={`w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isUploading ? "bg-gray-50 border-gray-200" : "border-blue-200 hover:border-blue-400 bg-blue-50/30"}`}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UploadIcon />
                <span className="text-[10px] font-bold text-blue-600 mt-2">
                  ADD PHOTO
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <p className="text-[11px] text-gray-400">
        Tip: Take clear photos of the part from different angles.
      </p>
    </div>
  );
}

// Simple internal icons for a clean look
const UploadIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="text-blue-500"
  >
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
