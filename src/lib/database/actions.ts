'use server';

import { redirect, RedirectType } from 'next/navigation';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { signIn, signOut } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/database/db';
import {
  getCurrentUserPassword,
  getSession,
  getUserByEmail,
  getUserByUsername,
} from '@/src/lib/database/getUser';
import { utapi } from '@/src/lib/uploadthing';
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
} from '@/src/routes';
import {
  AddEchoSchema,
  AddHeartSchema,
  ChangeAvatarSchema,
  ChangeBioSchema,
  ChangeDisplayNameSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  CreatePostSchema,
  CreateReplySchema,
  DeleteAccountSchema,
  DeleteYapSchema,
  FollowUserSchema,
  LoginSchema,
  OnboardingSchema,
  RegisterSchema,
} from '@/src/schemas';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class ActionError extends Error {}

function getErrorMessage(err: unknown) {
  switch (true) {
    case err instanceof ZodError:
      return err.issues[0].message;

    case err instanceof ActionError:
      return err.message;

    case err instanceof PrismaClientKnownRequestError:
      if (err.code === 'P2002') {
        return 'Email already in use.';
      }
      return 'Something went wrong! Try again.';

    case err instanceof AuthError:
      switch (err.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong!';
      }

    default:
      return 'Unknown error occurred.';
  }
}

const getSessionWrapper = async (err: string) => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new ActionError(err);
  }
  return session;
};

const login = async (data: FormData) => {
  let userEmail: string, userPassword: string;
  try {
    const { email, password } = await LoginSchema.parseAsync(data);
    userEmail = email;
    userPassword = password;
  } catch (err) {
    console.log('LOGIN ERR:', err);
    return { error: getErrorMessage(err) };
  }
  // successful auth throws NEXT_REDIRECT which is an error
  // therefore this function must be called outside try/catch or thrown again
  await signIn('credentials', {
    email: userEmail,
    password: userPassword,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
};

const logout = async () => {
  await signOut({
    redirectTo: '/login',
  });
};

const register = async (data: FormData) => {
  let userEmail: string, userPassword: string;
  try {
    const { email, password, confirmPassword } =
      await RegisterSchema.parseAsync(data);

    if (password !== confirmPassword) {
      throw new ActionError('Passwords do not match');
    }

    userEmail = email;
    userPassword = password;

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj: Prisma.UserCreateInput = {
      email,
      emailVerified: null,
      name: null,
      password: hashedPassword,
      OAuth: false,
      role: 'USER',
      username: null,
      displayName: null,
      image: null,
      imageKey: null,
      joinDate: new Date(),
      private: false,
      bio: '',
    };

    await db.user.create({
      data: {
        ...userObj,
        following: { connect: { username: process.env.AUTOFOLLOW ?? '' } },
      },
    });
  } catch (err) {
    console.log('REGISTER ERROR:', err);
    return { error: getErrorMessage(err) };
  }
  // successful auth throws NEXT_REDIRECT which is an error
  // therefore this function must be called outside try/catch or thrown again
  await signIn('credentials', {
    email: userEmail,
    password: userPassword,
    redirectTo: DEFAULT_REGISTER_REDIRECT,
  });
};

const onboarding = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    if (session.user.username) {
      throw new ActionError('Username already set.');
    }

    const { username, displayName } = await OnboardingSchema.parseAsync(data);
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new ActionError('Username already taken.');
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        username,
        displayName,
      },
    });
  } catch (err) {
    console.log('onboarding Error:', err);
    return { error: getErrorMessage(err) };
  }

  redirect(`/home`, RedirectType.replace);
};

const changeEmail = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Session not found.');
    if (session.user.OAuth) {
      throw new ActionError('Cannot update OAuth user email.');
    }

    const { email } = await ChangeEmailSchema.parseAsync(data);
    // if (email !== confirmEmail) {
    //   throw new ActionError('Emails must match.');
    // }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ActionError(
        'Supplied email is already associated with an account.'
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        email,
      },
    });

    return { success: 'Email updated.' };
  } catch (err) {
    console.log('changeEmail Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const changePassword = async (data: FormData) => {
  try {
    const { oldPassword, newPassword } =
      await ChangePasswordSchema.parseAsync(data);

    const currentUser = await getCurrentUserPassword();
    if (!currentUser) {
      throw new ActionError('User not found when attempting to update user.');
    }
    if (currentUser.OAuth) {
      throw new ActionError('Cannot change password of OAuth user.');
    }

    // if OAuth false, password exists
    const match = await bcrypt.compare(oldPassword, currentUser.password!);
    if (!match) {
      throw new ActionError('Old password incorrect.');
    }

    // if (newPassword !== confirmPassword) {
    //   throw new ActionError('New passwords must match.');
    // }

    await db.user.update({
      where: { id: currentUser.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
    });

    return { success: 'Password updated.' };
  } catch (err) {
    console.log('changePassword Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const changeAvatar = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    const { avatar } = await ChangeAvatarSchema.parseAsync(data);
    if (!avatar) {
      throw new ActionError('No file detected.');
    }

    const { imageKey, id } = session.user;

    const formattedFile = new File([avatar], `avatar#${id}`, {
      type: avatar.type,
    });

    const response = await utapi.uploadFiles(formattedFile);
    if (response.error !== null) {
      console.log('UPLOADTHING ERR (CHANGEAVATAR):', response.error);
      throw new ActionError('Upload failed, please try again.');
    }

    if (imageKey) {
      await utapi.deleteFiles(imageKey);
    }

    await db.user.update({
      where: {
        id,
      },
      data: {
        image: response.data.url,
        imageKey: response.data.key,
      },
    });
    return { success: 'Avatar uploaded successfully.', url: response.data.url };
  } catch (err) {
    console.log('changeAvatar Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const deleteAccount = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    const { username } = await DeleteAccountSchema.parseAsync(data);
    if (username !== session.user.username) {
      throw new ActionError('Username incorrect. Account cannot be deleted.');
    }

    await db.user.delete({
      where: {
        id: session.user.id,
      },
    });
  } catch (err) {
    console.log('deleteAccount Error:', err);
    return { error: getErrorMessage(err) };
  }
  await signOut({
    redirectTo: '/login',
  });
};

const changeDisplayName = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    const { displayName } = await ChangeDisplayNameSchema.parseAsync(data);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        displayName:
          displayName === undefined ||
          displayName === 'undefined' ||
          displayName === ''
            ? null
            : displayName,
      },
    });
    return { success: 'Display name updated successfully.' };
  } catch (err) {
    console.log('changeDisplayName Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const changeBio = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    const { bio } = await ChangeBioSchema.parseAsync(data);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        bio:
          bio === undefined || bio === 'undefined' || bio === '' ? null : bio,
      },
    });
    return { success: 'Bio updated successfully.' };
  } catch (err) {
    console.log('changeBio Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const createPost = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    const { text, image } = await CreatePostSchema.parseAsync(data);

    let response = null;
    if (image instanceof File) {
      const formattedFile = new File([image], `image`, {
        type: image.type,
      });
      response = await utapi.uploadFiles(formattedFile);
      if (response.error !== null) {
        console.log('UPLOADTHING ERR (CHANGEIMAGE):', response.error);
        throw new ActionError('Image upload failed, please try again.');
      }
    }

    const yapObj: Prisma.YapCreateInput = {
      text,
      date: new Date(),
      author: {
        connect: {
          id: session.user.id,
        },
      },
      isReply: false,
      image: response?.data.url ?? null,
      imageKey: response?.data.key ?? null,
    };

    const yap = await db.yap.create({ data: yapObj });
    const postId = yap.id;

    return { postId };
  } catch (err) {
    console.log('createPost Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const createReply = async (data: FormData) => {
  try {
    const session = await getSessionWrapper('Access denied.');

    const { text, image, id } = await CreateReplySchema.parseAsync(data);

    let response = null;
    if (image instanceof File) {
      const formattedFile = new File([image], `image`, {
        type: image.type,
      });
      response = await utapi.uploadFiles(formattedFile);
      if (response.error !== null) {
        console.log('UPLOADTHING ERR (CHANGEIMAGE):', response.error);
        throw new ActionError('Image upload failed, please try again.');
      }
    }

    const yapObj: Prisma.YapCreateInput = {
      text,
      date: new Date(),
      author: {
        connect: {
          id: session.user.id,
        },
      },
      parentYap: {
        connect: {
          id,
        },
      },
      isReply: true,
      image: response?.data.url ?? null,
    };

    const yap = await db.yap.create({
      data: yapObj,
      include: {
        parentYap: {
          select: {
            authorId: true,
          },
        },
      },
    });
    const postId = yap.id;

    if (yap.parentYap) {
      const notification: Prisma.NotificationCreateInput = {
        type: 'reply',
        postId,
        user: {
          connect: {
            id: yap.parentYap.authorId,
          },
        },
        author: {
          connect: {
            id: session.user.id,
          },
        },
      };

      // error is thrown if record not found
      try {
        await db.user.update({
          where: {
            id: yap.parentYap.authorId,
            AND: {
              newNotifications: null,
            },
          },
          data: {
            newNotifications: new Date(),
          },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code !== 'P2025'
        ) {
          throw err;
        }
      }

      await db.notification.create({ data: notification });
    }

    return { postId };
  } catch (err) {
    console.log('createReply Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const deleteYap = async (data: FormData) => {
  try {
    const { user } = await getSessionWrapper('Access denied.');

    const { id } = await DeleteYapSchema.parseAsync(data);

    const yap = await db.yap.delete({
      where: {
        id,
        AND: {
          authorId: { equals: user.id },
        },
      },
    });
    if (yap.imageKey) {
      await utapi.deleteFiles(yap.imageKey);
    }

    return { success: true };
  } catch (err) {
    console.log('deleteYap Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const heartYap = async (data: FormData) => {
  try {
    const { user } = await getSessionWrapper('Access denied.');

    const { id } = await AddHeartSchema.parseAsync(data);

    const yap = await db.yap.findUnique({
      where: {
        id,
        AND: {
          likes: {
            some: {
              username: user.username!,
            },
          },
        },
      },
      include: {
        likes: {
          where: {
            username: user.username!,
          },
          take: 1,
        },
      },
    });

    if (!yap) {
      const like = await db.like.create({
        data: {
          user: {
            connect: {
              username: user.username!,
            },
          },
          yap: {
            connect: {
              id,
            },
          },
        },
        select: {
          yap: {
            select: {
              authorId: true,
            },
          },
        },
      });

      const notification: Prisma.NotificationCreateInput = {
        type: 'like',
        postId: id,
        user: {
          connect: {
            id: like.yap.authorId,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      };

      try {
        await db.user.update({
          where: {
            id: like.yap.authorId,
            AND: {
              newNotifications: null,
            },
          },
          data: {
            newNotifications: new Date(),
          },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code !== 'P2025'
        ) {
          throw err;
        }
      }

      await db.notification.create({ data: notification });
    } else {
      await db.like.delete({
        where: {
          id: yap.likes[0].id,
          AND: {
            username: user.username!,
          },
        },
      });
      await db.notification.deleteMany({
        where: {
          postId: yap.id,
          AND: {
            authorUsername: user.username!,
            type: 'like',
          },
        },
      });
    }

    return { success: true };
  } catch (err) {
    console.log('heartYap Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const echoYap = async (data: FormData) => {
  try {
    const { user } = await getSessionWrapper('Access denied.');

    const { id } = await AddEchoSchema.parseAsync(data);

    const yap = await db.yap.findUnique({
      where: {
        id,
        AND: {
          echoes: {
            some: {
              username: user.username!,
            },
          },
        },
      },
      include: {
        echoes: {
          where: {
            username: user.username!,
          },
          take: 1,
        },
      },
    });

    if (!yap) {
      const echo = await db.echo.create({
        data: {
          user: {
            connect: {
              username: user.username!,
            },
          },
          yap: {
            connect: {
              id,
            },
          },
        },
        select: {
          yap: {
            select: {
              authorId: true,
            },
          },
        },
      });

      const notification: Prisma.NotificationCreateInput = {
        type: 'echo',
        postId: id,
        user: {
          connect: {
            id: echo.yap.authorId,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      };

      try {
        await db.user.update({
          where: {
            id: echo.yap.authorId,
            AND: {
              newNotifications: null,
            },
          },
          data: {
            newNotifications: new Date(),
          },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code !== 'P2025'
        ) {
          throw err;
        }
      }

      await db.notification.create({ data: notification });
    } else {
      await db.echo.delete({
        where: {
          id: yap.echoes[0].id,
          AND: {
            username: user.username!,
          },
        },
      });
      await db.notification.deleteMany({
        where: {
          postId: yap.id,
          AND: {
            authorUsername: user.username!,
            type: 'echo',
          },
        },
      });
    }

    return { success: true };
  } catch (err) {
    console.log('echoYap Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const followUser = async (data: FormData) => {
  try {
    const { user } = await getSessionWrapper('Access denied.');

    const { username } = await FollowUserSchema.parseAsync(data);

    if (user.username === username) {
      throw new ActionError('Users cannot follow themselves.');
    }

    const isUserFollowing = await db.user.findUnique({
      where: {
        username,
        AND: {
          followers: {
            some: {
              username: user.username!,
            },
          },
        },
      },
    });

    await db.user.update({
      where: {
        username,
      },
      data: {
        followers: {
          [isUserFollowing ? 'disconnect' : 'connect']: {
            id: user.id,
          },
        },
      },
    });

    if (!isUserFollowing) {
      const notification: Prisma.NotificationCreateInput = {
        type: 'follow',
        postId: null,
        user: {
          connect: {
            username,
          },
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      };

      try {
        await db.user.update({
          where: {
            username,
            AND: {
              newNotifications: null,
            },
          },
          data: {
            newNotifications: new Date(),
          },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code !== 'P2025'
        ) {
          throw err;
        }
      }

      await db.notification.create({ data: notification });
    } else {
      await db.notification.deleteMany({
        where: {
          username: username,
          authorUsername: user.username!,
          type: 'follow',
        },
      });
    }

    return { success: true };
  } catch (err) {
    console.log('followUser Error:', err);
    return { error: getErrorMessage(err) };
  }
};

const clearNotifications = async () => {
  try {
    const { user } = await getSessionWrapper('Access denied.');

    await db.notification.deleteMany({
      where: {
        username: user.username!,
      },
    });

    return { success: true };
  } catch (err) {
    console.log('clearNotif Error:', err);
    return { error: getErrorMessage(err) };
  }
};

export {
  changeAvatar,
  changeBio,
  changeDisplayName,
  changeEmail,
  changePassword,
  clearNotifications,
  createPost,
  createReply,
  deleteAccount,
  deleteYap,
  echoYap,
  followUser,
  heartYap,
  login,
  logout,
  onboarding,
  register,
};
