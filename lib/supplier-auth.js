import { auth } from "@/auth"; 
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";


export async function requireSupplier() {
  const session = await auth();

  if (!session?.user) {
    redirect("/supplier/login");
  }

  const supplier = await prisma.supplier.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      isActive: true,
      brands: true,
    },
  });

  if (!supplier) {
    redirect("/supplier/unauthorized");
  }
 if (!supplier.isActive) {
   redirect("/supplier/forbidden");
 }

  return supplier;
}


