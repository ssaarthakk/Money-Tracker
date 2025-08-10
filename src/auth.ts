import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

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

        // Dynamically import server-only modules to keep Edge bundle clean
        const [dbModule, userModelModule, bcryptModule] = await Promise.all([
          import("@/lib/dbConnect"),
          import("@/models/user.model"),
          import("bcryptjs"),
        ]);
        const dbConnect = dbModule.default;
        const User = userModelModule.default as any;
        const bcrypt: any = (bcryptModule as any).default ?? bcryptModule;

        await dbConnect();
        const user = await User.findOne({ email });
        if (!user) return null;
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
        const [dbModule, userModelModule] = await Promise.all([
          import("@/lib/dbConnect"),
          import("@/models/user.model"),
        ]);
        const dbConnect = dbModule.default;
        const User = userModelModule.default as any;

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