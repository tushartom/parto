"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// import {unstable_update } from "@/auth";


export async function toggleAdminStatus(adminId, currentStatus) {
  try {
    
    // 2. Database Update
    await prisma.admin.update({
      where: { id: adminId },
      data: { isActive: !currentStatus },
    });

    // 3. Clear Cache: Force the Team page to show fresh data
    revalidatePath("/admin/manage-team");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle admin status:", error);
    return { success: false, error: error.message };
  }
}
