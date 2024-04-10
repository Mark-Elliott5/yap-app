import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';

import db from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';

import { getUserByEmail, getUserById } from '../data-utils';
import { LoginSchema } from '../schemas';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/login',
    error: '/authentication-error',
  },
  callbacks: {
    // async signIn({ user }) {
    //   if (!user?.id) return false;
    //   const existingUser = await getUserById(user.id);

    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false;
    //   }

    //   return true;
    // },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
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
