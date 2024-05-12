import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';

import db from '@/src/lib/database/db';
import {
  getUserByEmailEdge,
  getUserByIdEdge,
} from '@/src/lib/database/getUserEdge';
// import { LoginSchema } from '@/src/schemas';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
    error: '/authentication-error',
  },
  callbacks: {
    // async signIn({ user }) {
    //   if (!user?.id) return false;
    //   const existingUser = await getUserByIdEdge(user.id);

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
      const existingUser = await getUserByIdEdge(token.sub);
      if (!existingUser) {
        // console.log('FAILED TO GET EXISTING USER');
        return token;
      }
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
      token.user = existingUser;
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
        // const result = await LoginSchema.safeParseAsync(credentials);
        // if (!result.success) return null;
        // const { data } = credentials;
        // credentials as { email: string; password: string };
        const user = await getUserByEmailEdge(
          (credentials as { email: string; password: string }).email
        );
        if (!user || !user.password) return null;
        const match = await bcrypt.compare(
          (credentials as { email: string; password: string }).password,
          user.password
        );
        if (!match) {
          return null;
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
});

// import type { NextAuthConfig } from 'next-auth';
// import GitHub from 'next-auth/providers/github';

// export default {
//   providers: [GitHub],
// } satisfies NextAuthConfig;
