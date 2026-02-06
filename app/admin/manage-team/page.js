import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeamTable from "./TeamTable";
import { auth } from "@/auth";
import SessionWrapper from "@/components/admin/SessionWrapper";
export default async function ManageTeamPage() {
const session = await auth();
  // 2. Role Check: Only Super Admins allowed
  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin/unauthorized");
  }

  // 3. Fetch all admins
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
    },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
          Manage Team
        </h1>
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mt-2">
          Control Administrative Access & Permissions
        </p>
      </header>
      <SessionWrapper session={session}>
        <TeamTable initialAdmins={admins} />
      </SessionWrapper>
    </div>
  );
}
