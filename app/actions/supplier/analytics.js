"use server";

import prisma from "@/lib/prisma";

export async function incrementViewCount(adId) {
  try {
    await prisma.partAd.update({
      where: { id: adId },
      data: { views: { increment: 1 } },
    });
    return { success: true };
  } catch (error) {
    console.error("VIEW_TRACKING_ERROR:", error);
    return { success: false };
  }
}

export async function incrementInquiryCount(adId) {
  try {
    await prisma.partAd.update({
      where: { id: adId },
      data: { inquiries: { increment: 1 } },
    });
    return { success: true };
  } catch (error) {
    console.error("INQUIRY_TRACKING_ERROR:", error);
    return { success: false };
  }
}