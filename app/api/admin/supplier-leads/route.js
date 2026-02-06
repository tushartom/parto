import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth"; //
import { adminApiError } from "@/lib/admin-api"; //

const QuerySchema = z.object({
  status: z.enum(["PENDING", "VERIFIED", "REJECTED"]),
  page: z.string().transform(Number).pipe(z.number().min(1)).catch(1),
});

/**
 * GET: Fetches filtered leads and atomic counts for all tabs.
 * Protected by requireAdmin gatekeeper.
 */
export async function GET(request) {
  try {
    // 1. Security Guard: Hits DB to verify admin is active
    await requireAdmin();

    const { searchParams } = new URL(request.url);

    // 2. Validate inputs
    const validation = QuerySchema.safeParse({
      status: searchParams.get("status") || "PENDING",
      page: searchParams.get("page") || "1",
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid status or page" },
        { status: 400 },
      );
    }

    const { status, page } = validation.data;
    const limit = 10;
    const skip = (page - 1) * limit;

    // 3. Optimized Transaction: Fetch data and counts in one trip
    const [leads, pendingCount, verifiedCount, rejectedCount] =
      await prisma.$transaction([
        prisma.supplierLead.findMany({
          where: { status },
          skip,
          take: limit,
          orderBy: { submittedAt: "desc" },
        }),
        prisma.supplierLead.count({ where: { status: "PENDING" } }),
        prisma.supplierLead.count({ where: { status: "VERIFIED" } }),
        prisma.supplierLead.count({ where: { status: "REJECTED" } }),
      ]);

    const counts = {
      PENDING: pendingCount,
      VERIFIED: verifiedCount,
      REJECTED: rejectedCount,
    };

    return NextResponse.json({
      supplierLeads: leads,
      totalPages: Math.ceil(counts[status] / limit),
      currentPage: page,
      counts,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    // 4. Map DB/Auth errors to clean 401, 403, or 500 responses
    return adminApiError(error);
  }
}

/**
 * PATCH: Handles status transitions and notes.
 * Protected by requireAdmin gatekeeper.
 */
export async function PATCH(request) {
  try {
    // 1. Security Guard
    await requireAdmin();

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (
      status &&
      !["PENDING", "VERIFIED", "REJECTED", "CONVERTED"].includes(status)
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedLead = await prisma.supplierLead.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    // 2. Automatic Error Handling
    return adminApiError(error);
  }
}
