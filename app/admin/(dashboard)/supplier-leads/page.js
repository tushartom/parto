"use client";

import React from "react";
import { SupplierLeadsInbox } from "@/components/admin/SupplierLeadsInbox";

export default function SupplierLeadsPage() {
  return (
    <div className="p-4 md:p-8">
      {/* This component handles the live fetching of leads 
        and the status update logic using the useToast hook.
      */}
      <SupplierLeadsInbox />
    </div>
  );
}
