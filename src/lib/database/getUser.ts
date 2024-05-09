import { cache } from 'react';

import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/database/db';
import { User } from '@prisma/client';

// These files must not be imported directly or indirectly to the edge runtime.
// E.g. imported into auth.ts, which is then reexported to middleware.ts.
// This way, cache() can be used here.

const getUserByEmail = cache(async (email: User['email']) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
});

const getUserById = cache(async (id: User['id']) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
});

const getUserByUsername = cache(async (username: User['username']) => {
  try {
    if (!username) {
      return null;
    }
    const user = await db.user.findUnique({
      where: {
        username,
      },
      omit: {
        password: true,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
});

const getCurrentUserPassword = cache(async () => {
  try {
    const session = await getSession();
    if (!session || !session.user) return null;
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        password: true,
        OAuth: true,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
});

const getCurrentUserId = cache(async () => {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) return null;
    return session.user.id;
  } catch (err) {
    console.log(err);
    return null;
  }
});

const getCurrentUsername = cache(async () => {
  try {
    const session = await getSession();
    if (!session || !session.user || !session.user.username) return null;
    return session.user.username;
  } catch (err) {
    console.log(err);
    return null;
  }
});

const getSession = cache(async () => {
  try {
    const session = await auth();
    if (!session) return null;
    return session;
  } catch (err) {
    console.log(err);
    return null;
  }
});

export {
  getCurrentUserId,
  getCurrentUsername,
  getCurrentUserPassword,
  getSession,
  getUserByEmail,
  getUserById,
  getUserByUsername,
};
