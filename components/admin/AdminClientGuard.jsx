// components/admin/AdminClientGuard.js
"use client";

import { useActiveSessionGuard } from "@/hooks/useActiveSessionGuard";

export default function AdminClientGuard() {
  // Now this hook is safely inside the SessionWrapper context
  useActiveSessionGuard();
  return null; // This component doesn't render anything UI-wise
}
