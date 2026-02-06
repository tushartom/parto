// app/admin/layout.js (NO "use client" here)
import { Sidebar } from "@/components/admin/Sidebar";
import { Toaster } from "@/components/ui/Toaster";
import SessionWrapper from "@/components/admin/SessionWrapper";
import { auth } from "@/auth";
import AdminClientGuard from "@/components/admin/AdminClientGuard";

export default async function AdminLayout({ children }) {
  // 1. Fetch session on the server (Instant hydration)
  const session = await auth();

  return (
    <SessionWrapper session={session}>
      {/* 2. This component will handle your useActiveSessionGuard logic */}
      <AdminClientGuard />

      <div className="flex h-screen bg-background font-sans antialiased">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50">
          <div className="min-h-full">{children}</div>
        </main>
        <Toaster />
      </div>
    </SessionWrapper>
  );
}
