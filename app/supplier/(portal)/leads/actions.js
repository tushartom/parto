"use server";

import prisma from "@/lib/prisma";
import { requireSupplier } from "@/lib/supplier-auth";
import { revalidatePath } from "next/cache";

/**
 * 1. FETCH MARKET FEED (ALL)
 * Fetches leads matching supplier brands, excluding those they've ignored.
 */
export async function fetchMarketLeadsAction(page = 1) {
  try {
    const supplier = await requireSupplier();
    const brandNames = supplier.brands.map((b) => b.name);
    const pageSize = 10;

    // We fetch leads where the supplier HAS NOT ignored them
    const leads = await prisma.lead.findMany({
      where: {
        vehicleMake: { in: brandNames },
        state: { not: "DROPPED" },
        // EXCLUDE leads that this specific supplier has marked as isIgnored
        unlocks: {
          none: {
            supplierId: supplier.id,
            isIgnored: true,
          },
        },
      },
      include: {
        buyer: { select: { phoneNumber: true } },
        // Include interaction data for THIS specific supplier
        unlocks: {
          where: { supplierId: supplier.id },
          select: {
            hasInteracted: true,
            isStarred: true,
            isIgnored: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    // Format data so LeadCard doesn't have to hunt for the 'unlock' object
    const formatted = leads.map((l) => ({
      ...l,
      interaction: l.unlocks[0] || {
        hasInteracted: false,
        isStarred: false,
        isIgnored: false,
      },
    }));

    return { data: formatted };
  } catch (err) {
    console.error("Market Feed Error:", err);
    return { error: "Failed to load market feed", data: [] };
  }
}

/**
 * 2. TOGGLE LEAD INTERACTION (The Frictionless Engine)
 * Handles WhatsApp/Call clicks (Interaction), Starring, and Ignoring (Discard).
 */
export async function updateLeadInteractionAction(leadId, data) {
  try {
    const supplier = await requireSupplier();

    // Use upsert so that the first action (like clicking WhatsApp)
    // creates the record automatically.
    await prisma.leadUnlock.upsert({
      where: {
        leadId_supplierId: { leadId, supplierId: supplier.id },
      },
      update: {
        ...data,
        // If hasInteracted is being set to true for the first time
        ...(data.hasInteracted && { firstInteractedAt: new Date() }),
      },
      create: {
        leadId,
        supplierId: supplier.id,
        ...data,
        ...(data.hasInteracted && { firstInteractedAt: new Date() }),
      },
    });

    // Revalidate the path so the Double Blue Tick or Archive happens instantly
    revalidatePath("/supplier/leads");
    return { success: true };
  } catch (err) {
    console.error("Interaction Update Error:", err);
    return { error: "Could not update lead status." };
  }
}

/**
 * 3. FETCH FILTERED TABS (Starred or Ignored)
 */
export async function fetchFilteredLeadsAction(type) {
  try {
    const supplier = await requireSupplier();

    // SENIOR FIX: If we want Starred leads, we MUST ensure they aren't also Ignored.
    // If we want Ignored leads, we fetch them regardless of star status.
    const filter =
      type === "STARRED"
        ? { isStarred: true, isIgnored: false } // Added isIgnored: false
        : { isIgnored: true };

    const interactions = await prisma.leadUnlock.findMany({
      where: {
        supplierId: supplier.id,
        ...filter,
      },
      include: {
        lead: {
          include: {
            buyer: { select: { phoneNumber: true } },
          },
        },
      },
      orderBy: { lead: { createdAt: "desc" } },
    });

    return { data: interactions.map((i) => ({ ...i.lead, interaction: i })) };
  } catch (err) {
    return { error: "Failed to load leads.", data: [] };
  }
}