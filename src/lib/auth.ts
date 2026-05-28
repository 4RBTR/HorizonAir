import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Fallback for Mocking
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "admin-1", name: "Admin Horizon", role: "admin" };
        }
        if (credentials?.username === "user" && credentials?.password === "user") {
          return { id: "user-1", name: "Danendra Bagas", role: "customer" };
        }

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/Login`, {
            username: credentials?.username,
            password: credentials?.password,
          });

          const user = res.data;

          if (user) {
            const resolvedRole = user.role || (credentials?.username?.toLowerCase().includes("admin") ? "admin" : "customer");
            return {
              id: user.id?.toString() || "1",
              name: user.nama || user.name || user.username || credentials?.username || "User",
              role: resolvedRole,
              ...user,
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.accessToken = (user as any).token || (user as any).accessToken || (user as any).jwt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
