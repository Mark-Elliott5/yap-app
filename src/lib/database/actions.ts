'use server';

import { redirect, RedirectType } from 'next/navigation';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { auth, signIn, signOut } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/database/db';
import {
  getCurrentUser,
  getUserByEmail,
  getUserByUsername,
} from '@/src/lib/database/getUser';
import { utapi } from '@/src/lib/uploadthing';
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
} from '@/src/routes';
import {
  ChangeAvatarSchema,
  ChangeBioSchema,
  ChangeDisplayNameSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  CreatePostSchema,
  CreateReplySchema,
  DeleteAccountSchema,
  LoginSchema,
  OnboardingSchema,
  RegisterSchema,
} from '@/src/schemas';
import { Prisma, Yap } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class ActionError extends Error {}

const getSession = async (err: string) => {
  const session = await auth();
  if (!session || !session.user) {
    throw new ActionError(err);
  }
  return session;
};

const login = async (data: FormData) => {
  try {
    const { email, password } = await LoginSchema.parseAsync(data);
    console.log(email, password);

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

    await db.user.create({ data: userObj });
    console.log('User created: ' + email);
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
    const session = await getSession('Access denied.');
    console.log('Onboarding session:', session);

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
    console.log('Username updated:', username);
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

  redirect(`/settings`, RedirectType.replace);
};

const changeEmail = async (data: FormData) => {
  try {
    const session = await getSession('Session not found.');
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

    const currentUser = await getCurrentUser();
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
    const session = await getSession('Access denied.');

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
    const session = await getSession('Access denied.');

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
    const session = await getSession('Access denied.');

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
    const session = await getSession('Access denied.');

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
  let postId = '';
  try {
    const session = await getSession('Access denied.');

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
    };

    const yap = await db.yap.create({ data: yapObj });
    postId = yap.id;
    console.log(postId);

    return { success: 'Post created successfully.' };
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

  //uncomment when /post/* is created
  // redirect(`/${session.user.username}/post/${postId}`, RedirectType.push);
};

const createReply = async (data: FormData) => {
  let postId = '';
  try {
    const session = await getSession('Access denied.');

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

    const yap = await db.yap.create({ data: yapObj });
    postId = yap.id;
    console.log(postId);

    return { success: 'Post created successfully.' };
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

  //uncomment when /post/* is created
  // redirect(`/${session.user.username}/post/${postId}`, RedirectType.push);
};

const getLatestYaps = async (id: Yap['id'] | undefined = undefined) => {
  try {
    await getSession('Access denied.');

    if (!id) {
      const yaps = await db.yap.findMany({
        take: 10,
        orderBy: {
          date: 'desc',
        },
        omit: {
          parentYapId: true,
          authorId: true,
        },
        include: {
          author: {
            select: {
              username: true,
              displayName: true,
              image: true,
              joinDate: true,
            },
          },
          parentYap: {
            omit: {
              text: true,
              image: true,
              date: true,
            },
            include: {
              author: {
                select: {
                  username: true,
                  displayName: true,
                  image: true,
                  joinDate: true,
                },
              },
            },
          },
          _count: {
            select: {
              likes: true,
              echoes: true,
            },
          },
        },
      });

      return { yaps };
    }

    const yaps = await db.yap.findMany({
      skip: 1,
      take: 10,
      cursor: {
        id,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            image: true,
            joinDate: true,
          },
        },
        parentYap: {
          omit: {
            text: true,
            image: true,
            date: true,
          },
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
                image: true,
                joinDate: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            echoes: true,
          },
        },
      },
    });

    return { yaps };
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

const getYap = async (id: Yap['id']) => {
  try {
    await getSession('Access denied.');

    if (!id) {
      throw new ActionError('No post ID was received by the server.');
    }

    const yap = await db.yap.findUnique({
      where: {
        id,
      },
      omit: {
        parentYapId: true,
        authorId: true,
      },
      include: {
        replies: {
          omit: {
            authorId: true,
            parentYapId: true,
          },
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
                image: true,
                joinDate: true,
              },
            },
          },
        },
        author: {
          select: {
            username: true,
            displayName: true,
            image: true,
            joinDate: true,
          },
        },
        parentYap: {
          omit: {
            text: true,
            image: true,
            date: true,
          },
          include: {
            author: {
              select: {
                username: true,
                displayName: true,
                image: true,
                joinDate: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            echoes: true,
          },
        },
      },
    });

    return { yap };
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

export {
  changeAvatar,
  changeBio,
  changeDisplayName,
  changeEmail,
  changePassword,
  createPost,
  createReply,
  deleteAccount,
  getLatestYaps,
  getYap,
  login,
  logout,
  onboarding,
  register,
};
