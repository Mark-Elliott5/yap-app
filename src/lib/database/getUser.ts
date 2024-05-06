import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/database/db';
import { User } from '@prisma/client';

// cannot use this here, referencing it will break the app. I suspect with 99%
// certainty, when auth is called in middleware, which runs on edge without
// option for node, this causes the typeerror cannot read properties of
// undefined (reading exec()) error.
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// this also means cache() will not work here. Maybe duplicate auth() dependent
// functions to a new file, and only import those functions into middleware,
// then we can use cache() here if necessary.

const getUserByEmail = async (email: User['email']) => {
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
};

const getUserById = async (id: User['id']) => {
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
};

const getUserByUsername = async (username: User['username']) => {
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
};

const getCurrentUserPassword = async () => {
  try {
    const session = await auth();
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
};

const getCurrentUserId = async () => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) return null;
    return session.user.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getCurrentUsername = async () => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.username) return null;
    return session.user.username;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// const getSession = async () => {
//   try {
//     const session = await auth();
//     if (!session) return null;
//     return session;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

// const updateUser = async (id: string, data: updateableFields) => {
//   try {
//     const user = await db.user.update({
//       where: {
//         id,
//       },
//       data,
//     });
//     return user;
//   } catch (err) {
//     console.log(err);
//     return null;
//   }
// };

export {
  getCurrentUserId,
  getCurrentUsername,
  getCurrentUserPassword,
  getUserByEmail,
  getUserById,
  getUserByUsername,
};
