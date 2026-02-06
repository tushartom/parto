import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/admin-auth"; //
import { adminApiError } from "@/lib/admin-api"; //

export const dynamic = "force-dynamic";
/**
 * POST: Handles direct deletion of assets from Cloudinary.
 * Protected: Prevents unauthorized users from wiping your storage.
 */
export async function POST(request) {
  try {
    // 1. Security Guard: Verify active admin status before any action
    await requireAdmin();

    const { publicId } = await request.json();

    // 2. Input Validation
    if (!publicId) {
      return NextResponse.json(
        { error: "Public ID is required" },
        { status: 400 },
      );
    }

    // 3. Direct deletion from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return NextResponse.json({
        success: true,
        message: "Asset deleted successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Cloudinary deletion failed", detail: result },
        { status: 500 },
      );
    }
  } catch (error) {
    // 4. Handles UNAUTHORIZED, DEACTIVATED, or Server errors
    return adminApiError(error);
  }
}
