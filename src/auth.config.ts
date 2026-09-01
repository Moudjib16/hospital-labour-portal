import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe base configuration shared with the proxy (middleware).
 * Kept free of Node-only modules (Prisma/bcrypt) so it can run on the edge.
 */
export const authConfig = {
  pages: {
    signIn: "/connexion",
  },
  callbacks: {
    // Used by the proxy middleware to authorize requests. If false,
    // Auth.js redirects the user to the sign-in page (/connexion) and
    // automatically preserves the current URL as the callbackUrl.
    authorized({ auth }) {
      const isLoggedIn = !!auth?.user;

      if (!isLoggedIn) {
        // Not authenticated: force them to the login page.
        return false;
      }

      // Logged in: allow access to protected pages.
      return true;
    },
  },
  providers: [], // Credentials provider is added in auth.ts (Node-only)
} satisfies NextAuthConfig;
