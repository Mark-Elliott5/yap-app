import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';

import { getUserByEmail, getUserById } from '@/data-utils';
import { LoginSchema } from '@/schemas';
import db from '@/src/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: '/login',
    error: '/authentication-error',
  },
  callbacks: {
    // async signIn({ user }) {
    //   if (!user?.id) return false;
    //   const existingUser = await getUserById(user.id);

    //   // if (!existingUser || !existingUser.emailVerified) {
    //   //   return false;
    //   // }
    //   if (!existingUser) return false;
    //   if (!existingUser.username) {
    //   }

    //   return true;
    // },
    // async redirect({user})
    async session({ session, token }) {
      if (session.user) {
        console.log(session.user);
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        if (token.OAuth) {
          session.user.OAuth = token.OAuth;
        }
        if (token.username) {
          session.user.username = token.username;
        }
        if (token.displayName) {
          session.user.displayName = token.displayName;
        }
      }
      console.log('SESSION:', session);
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      console.log('EUSER:', existingUser);
      token.role = existingUser.role;
      token.OAuth = existingUser.OAuth!;
      token.username = existingUser.username;
      token.displayName = existingUser.displayName;
      console.log('TOKEN: ', token);
      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), OAuth: true },
      });
    },
    // async signIn({ user, isNewUser }) {
    //   if (isNewUser) {
    //   }
    // },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // profile: () => {},
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
