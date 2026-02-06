"use client";

/**
 * partoFetch handles all API requests.
 * If the server's requireAdmin() detects a deactivation, it returns 403.
 * This interceptor catches that 403 and broadcasts a 'FORBIDDEN' event.
 */
export async function adminFetch(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    // 403 = Authenticated but DEACTIVATED
    if (res.status === 403) {
      window.dispatchEvent(new Event("admin-forbidden"));
      return null;
    }

    // 401 = Cookie expired, go to login
    if (res.status === 401) {
      window.location.href = "/admin/login?error=SessionExpired";
      return null;
    }

    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || "Request failed");
  }

  return res;
}
