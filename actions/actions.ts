'use server';

import { redirect } from 'next/navigation';
import { AuthError, Session } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import {
  getCurrentUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
} from '@/data-utils';
import {
  auth,
  signIn,
  unstable_update,
} from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/db';
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_REGISTER_REDIRECT,
} from '@/src/routes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import {
  // ChangeAvatarSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  LoginSchema,
  OnboardingSchema,
  RegisterSchema,
} from '../schemas';

class UsernameError extends Error {}

const login = async (data: FormData) => {
  let values;
  try {
    values = await await LoginSchema.parseAsync(data);
    console.log(values);
  } catch (err) {
    console.log(err);
    return { error: (err as ZodError).errors[0].message };
  }
  const { email, password } = values;
  console.log(email, password);

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    let msg = '';
    if (err instanceof AuthError) {
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
  return { success: 'Login successful!' };
};

const register = async (data: FormData) => {
  let values;
  try {
    values = await RegisterSchema.parseAsync(data);
    if (values.password !== values.confirmPassword) {
      throw new ZodError([
        {
          message: 'Passwords do not match.',
          fatal: true,
          code: 'custom',
          path: ['confirmPassword'],
        },
      ]);
    }
  } catch (err) {
    console.log(err);
    return { error: (err as ZodError).errors[0].message };
  }
  const { email, password } = values;
  try {
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
    };

    await db.user.create({ data: userObj });
    console.log('User created: ' + email);
    // return { success: 'Registration successful!' };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { error: 'Email already in use.' };
      }
      console.log('Prisma error:', err);
      return { error: 'Something went wrong!' };
    }
    console.log('Unknown error:', err);
    return { error: 'Something went wrong!' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REGISTER_REDIRECT,
    });
  } catch (err) {
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
  return { success: 'Register successful!' };
};

const onboarding = async (data: FormData) => {
  let values;
  try {
    values = await OnboardingSchema.parseAsync(data);
  } catch (err) {
    console.log(err);
    return { error: (err as ZodError).errors[0].message };
  }
  const { username, displayName } = values;
  console.log(values);
  try {
    const session = await auth();
    console.log('Onboarding session:', session);
    if (!session) {
      throw new UsernameError('Session not found.');
    }
    if (session.user.username) {
      throw new UsernameError('Username already set.');
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new UsernameError('Username already taken');
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
    if (err instanceof PrismaClientKnownRequestError) {
      console.log('Prisma error:', err);
      return { error: 'Something went wrong!' };
    }
    if (err instanceof UsernameError) {
      console.log('UsernameError:', err);
      return { error: err.message };
    }
    console.log('Unknown error:', err);
    return { error: 'Something went wrong!' };
  }

  // update the session so session data is not stale
  const newSession = await unstable_update({ user: { username, displayName } });
  console.log('UNSTABLE UPDATE:', newSession);
  redirect(`/settings`); //, RedirectType.replace
};

const changeEmail = async (data: FormData) => {
  let values;
  try {
    values = await ChangeEmailSchema.parseAsync(data);
    console.log(values);
  } catch (err) {
    console.log(err);
    return { error: (err as ZodError).errors[0].message };
  }

  try {
    const { email } = values;
    // if (email !== confirmEmail) {
    //   throw new Error('Emails must match.');
    // }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already associated with an account.');
    }

    const session = await auth();
    if (!session) {
      throw new Error('No session found when updating user.');
    }
    if (session.user.OAuth) {
      throw new Error('Cannot update OAuth user email.');
    }

    const success = await updateUser(session.user.id!, { email });
    if (!success) {
      throw new Error('Email update failed.');
    }
  } catch (err) {
    return { error: (err as Error).message };
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
      throw new Error('No session found when updating user.');
    }
    if (currentUser.OAuth) {
      throw new Error('Cannot change password of OAuth user.');
    }

    // if OAuth false, password exists
    const match = await bcrypt.compare(oldPassword, currentUser.password!);
    if (!match) {
      throw new Error('Old password incorrect.');
    }
    // if (newPassword !== confirmPassword) {
    //   throw new Error('New passwords must match.');
    // }
    const success = await updateUser(currentUser.id, { password: newPassword });
    if (!success) {
      throw new Error('Password update failed.');
    }
  } catch (err) {
    return { error: (err as Error).message };
  }

  return { success: 'Password updated.' };
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
  // changeAvatar,
  // changeDisplayName,
  changeEmail,
  changePassword,
  // deleteAccount,
  login,
  onboarding,
  register,
};
