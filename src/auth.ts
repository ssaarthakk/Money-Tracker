import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const rawEmail = (credentials?.email as string | undefined) ?? undefined;
        const email = rawEmail ? rawEmail.toLowerCase().trim() : undefined;
        const password = (credentials?.password as string | undefined) ?? "";

        if (!email || !password) return null;

        await dbConnect();
        const user = await User.findOne({ email });
  if (!user) return null;
  // If the user was created via OAuth and has no password, block credentials login
  if (!user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: (user as any)._id?.toString?.() ?? (user as any).id?.toString?.(),
          name: user.name || user.email.split("@")[0],
          email: user.email,
          image: user.image,
        } as any;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        await dbConnect();
        await User.updateOne(
          { email: user.email.toLowerCase() },
          {
            $setOnInsert: {
              email: user.email.toLowerCase(),
            },
            $set: {
              name: user.name,
              image: user.image,
            },
          },
          { upsert: true }
        );
        const dbUser = await User.findOne({ email: user.email.toLowerCase() });
        if (dbUser) {
          (user as any).id = (dbUser as any)._id?.toString?.();
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id || token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id || token.sub;
      }
      return session;
    },
  },
});