import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/db';

interface updateableFields {
  email?: string;
  password?: string;
  avatar?: string;
  displayName?: string;
  username?: string;
}

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

const updateUser = async (id: string, data: updateableFields) => {
  try {
    const user = await db.user.update({
      where: {
        id,
      },
      data,
    });
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export {
  getCurrentUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
};
