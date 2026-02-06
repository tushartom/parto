import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});


export async function makeImagesPermanent(publicIds) {
  if (!publicIds?.length) return;
  try {
    return await cloudinary.uploader.remove_tag("temp", publicIds);
  } catch (error) {
    console.error("Cloudinary Tag Error:", error);
    throw new Error("Failed to finalize images");
  }
}

/**
 * Physically deletes assets from Cloudinary storage.
 * @param {string[]} publicIds - Array of Cloudinary public IDs
 */
export async function deleteAssets(publicIds) {
  if (!publicIds?.length) return;
  try {
    return await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Failed to delete assets from storage");
  }
}

export default cloudinary;
