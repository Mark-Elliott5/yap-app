// import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { getUserByEmail, getUserById } from '@/data-utils';
import { LoginSchema } from '@/schemas';
// import authConfig from '@/src/app/api/auth/[...nextauth]/auth.config';
import db from '@/src/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  debug: process.env.NODE_ENV === 'development',
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
      // console.log('AUTH CONFIG SESSION');
      // console.log('SESSION CALLBACK TOKEN:', token);

      if (session.user) {
        if (!token.sub) return session;
        const user = { ...token.user, id: token.sub };
        session.user = user;
      }
      // console.log('SESSION:', session);
      return session;
    },
    async jwt({ token }) {
      // console.log('AUTH CONFIG TOKEN');
      if (!token.sub) return token;
      // console.log('GETTING EXISTING USER');
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        // console.log('FAILED TO GET EXISTING USER');
        return token;
      }
      const { password, ...user } = existingUser;
      // const tokenUserObj = {
      //   role,
      //   OAuth,
      //   username,
      //   displayName,
      //   image,
      //   imageKey,
      //   email,
      //   emailVerified,
      // };
      token.user = user;
      // console.log('TOKEN:', token);
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
    }),
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as z.infer<typeof LoginSchema>;
        const user = await getUserByEmail(email);
        // if (!user) console.log('user not found');
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
