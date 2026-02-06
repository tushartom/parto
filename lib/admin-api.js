import { NextResponse } from "next/server";

export function adminApiError(error) {
  // Map specific error strings to HTTP status codes
  if (error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  if (error.message === "DEACTIVATED") {
    
    return NextResponse.json(
      { error: "This account has been disabled" },
      { status: 403 },
    );
  }

  // Fallback for unexpected errors (database crashes, etc.)
  console.error("[ADMIN_API_ERROR]:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
