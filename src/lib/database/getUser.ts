import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/database/db';

// cannot use this here, referencing it will break the app. I suspect with 99%
// certainty, when auth is called in middleware, which runs on edge without
// option for node, this causes the typeerror cannot read properties of
// undefined (reading exec()) error.
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const getUserByEmail = async (email: string) => {
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

const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getCurrentUser = async () => {
  try {
    const session = await auth();
    if (!session) return null;
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    return user;
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

export { getCurrentUser, getUserByEmail, getUserById, getUserByUsername };
