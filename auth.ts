import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const providers = process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
  ? [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET
      })
    ]
  : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/ingresar" }
});
