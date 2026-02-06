import { auth } from "@/auth";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();

  // 1) Must be logged in
  const email = session?.user?.email;
  if (!email) {
    throw new Error("UNAUTHORIZED");
  }

  // 2) Must exist in allowlist + active
  const admin = await prisma.admin.findUnique({
    where: { email },
    select: { id: true, isActive: true, role: true },
  });

  if (!admin) {
    throw new Error("FORBIDDEN"); // not in allowlist
  }

  if (!admin.isActive) {
    throw new Error("DEACTIVATED");
  }

  return admin;
}

/**
 * requireSuperAdmin()
 * Use this for high-privilege actions like managing the admin team or
 * deleting marketplace data.
 */
export async function requireSuperAdmin() {
  const user = await requireAdmin(); // First, ensure they are at least an active admin

  if (user.role !== "SUPER_ADMIN") {
    // For UI routes, we redirect them back to a safe dashboard
    redirect("/admin/supplier-leads");
  }

  return user;
}

/**
 * checkAdminApi()
 * A variant for API Route Handlers (/api/admin/*) that returns a JSON error
 * instead of a redirect.
 */
export async function checkAdminApi() {
  const session = await auth();

  if (!session?.user || session.user.isActive !== true) {
    return { error: "Unauthorized", status: 401 };
  }

  return { user: session.user, status: 200 };
}
