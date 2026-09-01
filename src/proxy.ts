import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Wrap the edge-safe auth config. The `authorized` callback in
// auth.config.ts decides whether to allow or redirect each request
// (e.g. sending unauthenticated users to /connexion).
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: [
    // Protect the authenticated (dashboard) routes.
    "/tableau-de-bord/:path*",
    "/patients/:path*",
    "/rapports/:path*",
    "/parametres/:path*",
  ],
};
