// auth.js
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { adminAuth } from "@/lib/firebase-admin";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "supplier-otp",
      name: "Supplier Login",
      async authorize(credentials) {
        console.log("--- AUTHORIZE START ---");
        if (!credentials?.token || !credentials?.phoneNumber) {
          console.log("❌ Missing credentials data");
          return null;
        }

        try {
          // 1. Technical Verification (Firebase Admin)
          console.log("Verifying Firebase Token...");
          const decodedToken = await adminAuth.verifyIdToken(credentials.token);
          if (!decodedToken) {
            console.log("❌ Firebase token verification failed");
            return null;
          }
          console.log(
            "✅ Firebase Token Verified for:",
            decodedToken.phone_number,
          );

          // 2. Business Verification (Prisma)
          const cleanPhone = credentials.phoneNumber.replace("+91", "");
          console.log("Checking Prisma for Supplier:", cleanPhone);

          const supplier = await prisma.supplier.findUnique({
            where: { whatsAppNumber: cleanPhone },
            select: { id: true, isActive: true },
          });

          if (!supplier) {
            console.log("❌ Supplier not found in database");
            return null;
          }

          console.log("✅ Supplier Found. Active Status:", supplier.isActive);

          // 3. Return object for JWT
          return {
            id: supplier.id,
            isActive: supplier.isActive,
            role: "SUPPLIER",
          };
        } catch (error) {
          console.error("--- AUTHORIZE ERROR ---", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      console.log(`--- SIGNIN CALLBACK: ${account.provider} ---`);

      if (account.provider === "supplier-otp") {
        if (!user.isActive) {
          console.log("❌ Supplier is inactive. Redirecting to /forbidden");
          return "/supplier/forbidden";
        }
        console.log("✅ Supplier Sign-In Approved");
        return true;
      }

      if (account.provider === "google") {
        try {
          if (!prisma) throw new Error("Database client not initialized");

          const admin = await prisma.admin.findUnique({
            where: { email: user.email },
            select: { id: true, isActive: true, role: true },
          });

          console.log("Admin Lookup Result:", !!admin);

          if (!admin) {
            console.log("❌ Email not in Admin table:", user.email);
            return "/admin/unauthorized";
          }
          if (!admin.isActive) {
            console.log("❌ Admin account disabled");
            return "/admin/forbidden";
          }

          await prisma.admin
            .update({
              where: { id: admin.id },
              data: { lastLoginAt: new Date() },
            })
            .catch((e) => console.error("Audit log error:", e));

          console.log("✅ Admin Sign-In Approved");
          return true;
        } catch (error) {
          console.error("CRITICAL DATABASE ERROR:", error.message);
          return false;
        }
      }
      return false;
    },

    async jwt({ token, user, trigger, account }) {
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      // --- STEP 1: INITIAL SIGN-IN ---
      if (user) {
        console.log("--- JWT INITIAL SETUP ---");
        try {
          if (account.provider === "google") {
            const admin = await prisma.admin.findUnique({
              where: { email: user.email },
              select: { id: true, role: true, isActive: true },
            });
            token.id = admin.id;
            token.role = admin.role;
            token.isActive = admin.isActive;
            token.provider = "google";
          }
          if (account.provider === "supplier-otp") {
            token.id = user.id;
            token.role = user.role;
            token.isActive = user.isActive;
            token.provider = "supplier-otp";
          }

          token.validatedAt = now;
          console.log(
            `Token created for ${token.provider}. Role: ${token.role}`,
          );
        } catch (error) {
          console.error("Initial JWT Fetch Error:", error);
        }
        return token;
      }

      // --- STEP 2: BACKGROUND REFRESH ---
      if (
        trigger === "update" ||
        now - (token.validatedAt || 0) > fiveMinutes
      ) {
        console.log(`--- JWT BACKGROUND REFRESH: ${token.provider} ---`);
        try {
          let dbUser = null;
          if (token.provider === "google") {
            dbUser = await prisma.admin.findUnique({
              where: { id: token.id },
              select: { isActive: true },
            });
          }
          if (token.provider === "supplier-otp") {
            dbUser = await prisma.supplier.findUnique({
              where: { id: token.id },
              select: { isActive: true },
            });
          }

          token.isActive = !!dbUser?.isActive;
          console.log(`Status Sync: ${token.isActive ? "ACTIVE" : "INACTIVE"}`);
          token.validatedAt = now;
        } catch (error) {
          console.error("Auth Background Check Failed:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        // Ensuring these match exactly what was set in JWT
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
      }
      console.log(
        `--- SESSION READY --- ID: ${session.user.id}, Role: ${session.user.role}`,
      );
      return session;
    },
  },
});
