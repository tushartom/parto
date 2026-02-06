import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {

  const publicRoutes = ["/admin/unauthorized", "/admin/forbidden", "/supplier/login"];
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isPublicRoute = publicRoutes.includes(pathname);
  const isAdminUiRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isPublicRoute) {
    console.log(isPublicRoute + "is this public route?");
    return;
  };

  if (isLoginRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/supplier-leads", req.url));
    }
    return NextResponse.next();
  }

  if (isAdminUiRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    if (pathname.startsWith("/admin/team") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/supplier-leads", req.url));
    }
  }

  if (isAdminApiRoute) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
