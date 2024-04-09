import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

import db from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { getUserByEmail } from '../data-utils';
import { LoginSchema } from '../schemas';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        const values = LoginSchema.parse(credentials);
        const { email, password } = values;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return null;
        }
        return user;
      },
    }),
  ],
});

// import type { NextAuthConfig } from 'next-auth';
// import GitHub from 'next-auth/providers/github';

// export default {
//   providers: [GitHub],
// } satisfies NextAuthConfig;
