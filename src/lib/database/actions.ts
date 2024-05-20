'use server';

import { redirect, RedirectType } from 'next/navigation';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { signIn, signOut } from '@/src/app/api/auth/[...nextauth]/auth';
import { notifierUserIdMap } from '@/src/app/api/notifications/notifierMap';
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

const getSessionWrapper = async (err: string) => {
  const session = await getSession();
  if (!session || !session.user) {
    throw new ActionError(err);
  }
  return session;
};

const login = async (data: FormData) => {
  try {
    const { email, password } = await LoginSchema.parseAsync(data);

    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    console.log('LOGIN ERR:', err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof AuthError) {
      let msg = '';
      switch (err.type) {
        // no way currently of suppressing CredentialSignin console log
        case 'CredentialsSignin':
          msg = 'Invalid credentials.';
          break;
        default:
          msg = 'Something went wrong!';
      }
      return { error: msg };
    }
    // successful auth throws NEXT_REDIRECT which is an error??
    // therefore this line is necessary to redirect successful logins
    throw err;
  }

  // return { success: 'Login successful!' };
};

const logout = async () => {
  await signOut({
    redirectTo: '/login',
  });
};

const register = async (data: FormData) => {
  try {
    const { email, password, confirmPassword } =
      await RegisterSchema.parseAsync(data);

    if (password !== confirmPassword) {
      throw new ActionError('Passwords do not match');
    }

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
        following: { connect: { username: process.env.AUTOFOLLOW! } },
      },
    });

    // return { success: 'Registration successful!' };

    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REGISTER_REDIRECT,
    });
  } catch (err) {
    console.log('REGISTER ERROR:', err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }

    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { error: 'Email already in use.' };
      }
      console.log('Prisma error:', err);
      return { error: 'Something went wrong!' };
    }

    if (err instanceof AuthError) {
      let msg = '';
      switch (err.type) {
        // currently, no way of suppressing CredentialSignin console log
        case 'CredentialsSignin':
          msg = 'Invalid credentials.';
          break;
        default:
          msg = 'Something went wrong!';
      }
      return { error: msg };
    }
    // successful auth throws NEXT_REDIRECT which is an error??
    // therefore this line is necessary to redirect successful logins
    throw err;
  }

  // return { success: 'Register successful!' };
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
      throw new ActionError('Username already taken');
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        username,
        displayName,
      },
    });
    // return { success: 'Registration successful!' };
  } catch (err) {
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong!' };
    }

    if (err instanceof ActionError) {
      console.log('ActionError:', err);
      return { error: err.message };
    }

    console.log('Unknown error:', err);
    return { error: 'Something went wrong!' };
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
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof AuthError) {
      let msg = '';
      switch (err.type) {
        // no way currently of suppressing CredentialSignin console log
        case 'CredentialsSignin':
          msg = 'Invalid credentials.';
          break;
        default:
          msg = 'Something went wrong!';
      }
      return { error: msg };
    }

    if (err instanceof ActionError) {
      console.log('ActionError:', err);
      return { error: err.message };
    }

    return { error: 'Something went wrong!' };
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
        password: newPassword,
      },
    });

    return { success: 'Password updated.' };
  } catch (err) {
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof ActionError) {
      console.log('ActionError:', err);
      return { error: err.message };
    }

    return { error: 'Something went wrong!' };
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
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
      const notifier = notifierUserIdMap.get(yap.parentYap.authorId);
      if (notifier) notifier.update({ data: 'true', event: 'update' });
    }

    return { postId };
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.issues[0].message };
    }

    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
      const notifier = notifierUserIdMap.get(like.yap.authorId);
      if (notifier) notifier.update({ data: 'true', event: 'update' });
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
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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
      const notifier = notifierUserIdMap.get(echo.yap.authorId);
      if (notifier) notifier.update({ data: 'true', event: 'update' });
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
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
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

    return { success: true };
  } catch (err) {
    console.log(err);
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong! Please try again.' };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknown error occured.' };
  }
};

export {
  changeAvatar,
  changeBio,
  changeDisplayName,
  changeEmail,
  changePassword,
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
