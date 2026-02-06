"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

export function useActiveSessionGuard() {
  const { data: session, update } = useSession();
  // 1. Initialize with null to stay 'pure' during render
  const lastCheckRef = useRef(null);

  useEffect(() => {
    // Only monitor if someone is actually logged in
    if (!session?.user) return;
    // 2. Set the initial time only once after mounting
    if (lastCheckRef.current === null) {
      lastCheckRef.current = Date.now();
    }
    const checkAndUpdate = async () => {
      const now = Date.now();
      const oneMinute = 60 * 1000;  
      const readableLastCheck = lastCheckRef.current 
    ? new Date(lastCheckRef.current).toLocaleTimeString() 
    : "Never checked";

  // 2. Log with a label so it's easy to find in the console
  console.log(`🛡️ [Guard] Last check was at: ${readableLastCheck}`);
      console.log("function running");
      // Avoid spamming update() - only run once per minute of activity
      if (now - lastCheckRef.current < oneMinute) return;

      lastCheckRef.current = now;

      // update() triggers the JWT callback on the server
      const updatedSession = await update();

      // If the server-side check (JWT callback) returned isActive: false
      if (!updatedSession || updatedSession.user?.isActive === false) {
        // Force logout and tell the user why
        await signOut({ callbackUrl: "/admin/forbidden" });
      }
    };

    // Events that count as "activity"
    window.addEventListener("focus", checkAndUpdate);
    window.addEventListener("click", checkAndUpdate);

    return () => {
      window.removeEventListener("focus", checkAndUpdate);
      window.removeEventListener("click", checkAndUpdate);
    };
  }, [session, update]);
}
