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
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/Login`, {
            username: credentials?.username,
            password: credentials?.password,
          });

          const responseData = res.data;
          const user = (responseData && typeof responseData === "object" && responseData.data)
            ? responseData.data
            : responseData;

          if (user) {
            // Get the JWT token or similar access token
            const token = user.token || user.jwt || user.accessToken;

            // Fetch profile / validate token using /api/Auth/Me
            if (token) {
              try {
                const meRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/Me`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                const meData = meRes.data?.data || meRes.data;
                if (meData) {
                  Object.assign(user, meData);
                }
              } catch (meError) {
                console.error("Failed to fetch /auth/me profile:", meError);
              }
            }

            // Retrieve role and normalize
            const rawRole = user.role || user.Role || user.roleNama || user.role_nama;
            let resolvedRole = "customer";
            if (rawRole) {
              const normalized = String(rawRole).toLowerCase();
              if (normalized === "admin") {
                resolvedRole = "admin";
              }
            } else {
              resolvedRole = credentials?.username?.toLowerCase().includes("admin") ? "admin" : "customer";
            }

            return {
              id: user.id?.toString() || user.userId?.toString() || "1",
              name: user.nama || user.name || user.username || credentials?.username || "User",
              role: resolvedRole,
              token: token,
              ...user,
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
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
