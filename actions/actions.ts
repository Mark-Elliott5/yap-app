'use server';

import { redirect, RedirectType } from 'next/navigation';
import { AuthError, Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import {
  getCurrentUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
} from '@/data-utils';
import { utapi } from '@/server/uploadthing';
import { auth, signIn } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/db';
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
} from '@/src/routes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
  ChangeAvatarSchema,
  // ChangeAvatarSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  LoginSchema,
  OnboardingSchema,
  RegisterSchema,
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
      return { error: err.message };
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

const register = async (data: FormData) => {
  try {
    const { email, password, confirmPassword } =
      await RegisterSchema.parseAsync(data);

    if (password !== confirmPassword) {
      throw new ActionError('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj: Session['user'] & {
      password: string;
    } = {
      email,
      password: hashedPassword,
      OAuth: false,
      role: 'USER',
      username: null,
      displayName: null,
      image: null,
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
      return { error: err.message };
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
      return { error: err.message };
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
        'Supplied email already associated with an account.'
      );
    }

    const success = await updateUser(session.user.id!, { email });
    if (!success) {
      throw new ActionError('Email update failed.');
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return { error: err.message };
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
  let values;
  try {
    values = await ChangePasswordSchema.parseAsync(data);
    console.log(values);
  } catch (err) {
    console.log(err);
    return { error: (err as ZodError).errors[0].message };
  }

  try {
    const { oldPassword, newPassword } = values;
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
      return { error: err.message };
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

    const acceptableTypes = new Set(['jpeg', 'png']);
    if (!acceptableTypes.has(avatar.type)) {
      throw new ActionError(
        `File type not accepted. Received type: ${avatar.type}`
      );
    }

    const response = await utapi.uploadFiles(avatar);
    if (response.error !== null) {
      console.log('UPLOADTHING ERR (CHANGEAVATAR):', response.error);
      throw new Error(response.error.message);
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        image: response.data.url,
      },
    });
    return { success: 'Avatar uploaded successfully.' };
  } catch (err) {
    console.log(err);
    if (err instanceof ZodError) {
      return { error: err.message };
    }

    if (err instanceof ActionError) {
      return { error: err.message };
    }
    // if (err instanceof PrismaClientKnownRequestError) {
    //   return { error: 'Database error!' };
    // }
    return { error: 'Unknow error occured.' };
  }
};

// const changeAvatar = async (data: FormData) => {
//   let values;
//   try {
//     v awaitalues = ChangeAvatarSchema.parseAsync(data);
//     console.log(values);
//   } catch (err) {
//     console.log(err);
//     return { error: (err as ZodError).errors[0].message };
//   }

//   try {
//     const { avatar } = values;
//     const currentUser = await getCurrentUser();
//     if (!currentUser) {
//       throw new Error('No session found when updating user.');
//     }

//     // if (newPassword !== confirmPassword) {
//     //   throw new Error('New passwords must match.');
//     // }
//     const success = await updateUser(currentUser.id, { password: newPassword });
//     if (!success) {
//       throw new Error('Password update failed.');
//     }
//   } catch (err) {
//     return { error: (err as Error).message };
//   }

//   return { success: 'Password updated.' };
// };

// const deleteAccount = async (data: FormData) => {};

// const changeDisplayName = async (data: FormData) => {};

export {
  changeAvatar,
  // changeAvatar,
  // changeDisplayName,
  changeEmail,
  changePassword,
  // deleteAccount,
  login,
  onboarding,
  register,
};
