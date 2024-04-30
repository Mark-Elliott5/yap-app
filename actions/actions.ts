'use server';

import { redirect, RedirectType } from 'next/navigation';
import { AuthError } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import {
  getCurrentUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
} from '@/data-utils';
import { utapi } from '@/server/uploadthing';
import { auth, signIn, signOut } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/db';
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
} from '@/src/routes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
  ChangeAvatarSchema,
  ChangeBioSchema,
  ChangeDisplayNameSchema,
  // ChangeAvatarSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  DeleteAccountSchema,
  LoginSchema,
  OnboardingSchema,
  RegisterSchema,
  // ServerChangeAvatarSchema,
} from '../schemas';

class ActionError extends Error {}

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
    const userObj: JWT['user'] & {
      password: string;
    } = {
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
    const { username, displayName } = await OnboardingSchema.parseAsync(data);

    const session = await auth();
    console.log('Onboarding session:', session);
    if (!session) {
      throw new ActionError('Session not found.');
    }
    if (session.user.username) {
      throw new ActionError('Username already set.');
    }

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
    const session = await auth();
    if (!session || !session.user) {
      throw new ActionError('No session found when updating user.');
    }
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

    const success = await updateUser(session.user.id!, { email });
    if (!success) {
      throw new ActionError('Email update failed.');
    }
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

  return { success: 'Email updated.' };
};

const changePassword = async (data: FormData) => {
  try {
    const { oldPassword, newPassword } =
      await ChangePasswordSchema.parseAsync(data);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new ActionError('No session found when updating user.');
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
    const success = await updateUser(currentUser.id, { password: newPassword });
    if (!success) {
      throw new ActionError('Password update failed.');
    }
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

  return { success: 'Password updated.' };
};

const changeAvatar = async (data: FormData) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw new ActionError('Access denied.');
    }

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
    const session = await auth();
    if (!session || !session.user) {
      throw new ActionError('Access denied.');
    }

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
    const session = await auth();
    if (!session || !session.user) {
      throw new ActionError('Access denied.');
    }

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
    const session = await auth();
    if (!session || !session.user) {
      throw new ActionError('Access denied.');
    }

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

export {
  changeAvatar,
  changeBio,
  changeDisplayName,
  changeEmail,
  changePassword,
  deleteAccount,
  login,
  logout,
  onboarding,
  register,
};
