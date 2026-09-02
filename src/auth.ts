import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Nom d'utilisateur", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { username, isActive: true },
        });

        if (!user) {
          return null;
        }

        const passwordValid = await compare(password, user.passwordHash);
        if (!passwordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
