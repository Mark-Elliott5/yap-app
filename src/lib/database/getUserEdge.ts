import db from '@/src/lib/database/db';
import { User } from '@prisma/client';

// These functions should ONLY be imported into auth.ts, or anywhere it might
// get directly or indirectly imported into the edge runtime. These exports
// allow us to use cache() in the getUser.ts file, without causing an error
// in the edge runtime.

/**
 * For edge runtimes, whether indirectly or directly imported.
 */
const getUserByEmailEdge = async (email: User['email']) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (err) {
    console.error('GETUSERBYEMAILEDGE ERROR:', err);
    return null;
  }
};

/**
 * For edge runtimes, whether indirectly or directly imported.
 */
const getUserByIdEdge = async (id: User['id']) => {
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
    console.error('GETUSERBYEDGE ERROR:', err);
    return null;
  }
};

export { getUserByEmailEdge, getUserByIdEdge };
