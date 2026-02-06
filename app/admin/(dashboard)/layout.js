// app/admin/layout.js
import { Toaster } from "@/components/ui/Toaster";
import SessionWrapper from "@/components/admin/SessionWrapper";
import { auth } from "@/auth";
import AdminClientGuard from "@/components/admin/AdminClientGuard";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const session = await auth();

  return (
    <SessionWrapper session={session}>
      <AdminClientGuard />
      {/* This shell manages the sidebar state and responsive layout */}
      <AdminDashboardShell>{children}</AdminDashboardShell>
      <Toaster />
    </SessionWrapper>
  );
}
