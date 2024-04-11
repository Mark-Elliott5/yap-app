'use server';

import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { signIn } from '@/src/auth';
import db from '@/src/lib/db';
import { DEFAULT_LOGIN_REDIRECT } from '@/src/routes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// import { getUserByEmail } from '../data-utils';
import { LoginSchema, RegisterSchema } from '../schemas';

// class EmailError extends Error {}

const login = async (data: FormData) => {
  let values;
  try {
    values = LoginSchema.parse(data);
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
    values = RegisterSchema.parse(data);
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
  try {
    const { email, password } = values;
    // const user = await getUserByEmail(email);
    // // if (user) {
    // //   throw new EmailError('Email already taken.', {});
    // // }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      email,
      password: hashedPassword,
    };
    await db.user.create({ data: userObj });
    console.log('User created: ' + email);
    return { success: 'Registration successful!' };
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { error: 'Email already in use.' };
      }
      console.log('Prisma error:', err);
      return { error: 'Something went wrong!' };
    }
    // if (err instanceof EmailError) {
    //   console.log('DB error:', err);
    //   return { error: 'Email already in use.' };
    // }
    console.log('Unknown error:', err);
    return { error: 'Something went wrong!' };
  }
};

const changeEmail = async (data: FormData) => {
  // let values;
  // try {
  //   values = LoginSchema.parse(data);
  //   console.log(values);
  // } catch (err) {
  //   console.log(err);
  //   return { error: (err as ZodError).errors[0].message };
  // }
  // const { email, password } = values;
  // console.log(email, password);
  // try {
  //   await signIn('credentials', {
  //     email,
  //     password,
  //     redirectTo: DEFAULT_LOGIN_REDIRECT,
  //   });
  // } catch (err) {
  //   let msg = '';
  //   if (err instanceof AuthError) {
  //     switch (err.type) {
  //       // no way currently of suppressing CredentialSignin console log
  //       case 'CredentialsSignin':
  //         msg = 'Invalid credentials.';
  //         break;
  //       default:
  //         msg = 'Something went wrong!';
  //     }
  //     return { error: msg };
  //   }
  //   // successful auth throws NEXT_REDIRECT which is an error??
  //   // therefore this line is necessary to redirect successful logins
  //   throw err;
  // }
  // return { success: 'Login successful!' };
};

const changePassword = async (data: FormData) => {
  // let values;
  // try {
  //   values = LoginSchema.parse(data);
  //   console.log(values);
  // } catch (err) {
  //   console.log(err);
  //   return { error: (err as ZodError).errors[0].message };
  // }
  // const { email, password } = values;
  // console.log(email, password);
  // try {
  //   await signIn('credentials', {
  //     email,
  //     password,
  //     redirectTo: DEFAULT_LOGIN_REDIRECT,
  //   });
  // } catch (err) {
  //   let msg = '';
  //   if (err instanceof AuthError) {
  //     switch (err.type) {
  //       // no way currently of suppressing CredentialSignin console log
  //       case 'CredentialsSignin':
  //         msg = 'Invalid credentials.';
  //         break;
  //       default:
  //         msg = 'Something went wrong!';
  //     }
  //     return { error: msg };
  //   }
  //   // successful auth throws NEXT_REDIRECT which is an error??
  //   // therefore this line is necessary to redirect successful logins
  //   throw err;
  // }
  // return { success: 'Login successful!' };
};

const changeAvatar = async (data: FormData) => {
  // let values;
  // try {
  //   values = LoginSchema.parse(data);
  //   console.log(values);
  // } catch (err) {
  //   console.log(err);
  //   return { error: (err as ZodError).errors[0].message };
  // }
  // const { email, password } = values;
  // console.log(email, password);
  // try {
  //   await signIn('credentials', {
  //     email,
  //     password,
  //     redirectTo: DEFAULT_LOGIN_REDIRECT,
  //   });
  // } catch (err) {
  //   let msg = '';
  //   if (err instanceof AuthError) {
  //     switch (err.type) {
  //       // no way currently of suppressing CredentialSignin console log
  //       case 'CredentialsSignin':
  //         msg = 'Invalid credentials.';
  //         break;
  //       default:
  //         msg = 'Something went wrong!';
  //     }
  //     return { error: msg };
  //   }
  //   // successful auth throws NEXT_REDIRECT which is an error??
  //   // therefore this line is necessary to redirect successful logins
  //   throw err;
  // }
  // return { success: 'Login successful!' };
};

const deleteAccount = async (data: FormData) => {
  // let values;
  // try {
  //   values = LoginSchema.parse(data);
  //   console.log(values);
  // } catch (err) {
  //   console.log(err);
  //   return { error: (err as ZodError).errors[0].message };
  // }
  // const { email, password } = values;
  // console.log(email, password);
  // try {
  //   await signIn('credentials', {
  //     email,
  //     password,
  //     redirectTo: DEFAULT_LOGIN_REDIRECT,
  //   });
  // } catch (err) {
  //   let msg = '';
  //   if (err instanceof AuthError) {
  //     switch (err.type) {
  //       // no way currently of suppressing CredentialSignin console log
  //       case 'CredentialsSignin':
  //         msg = 'Invalid credentials.';
  //         break;
  //       default:
  //         msg = 'Something went wrong!';
  //     }
  //     return { error: msg };
  //   }
  //   // successful auth throws NEXT_REDIRECT which is an error??
  //   // therefore this line is necessary to redirect successful logins
  //   throw err;
  // }
  // return { success: 'Login successful!' };
};

const changeDisplayName = async (data: FormData) => {
  // let values;
  // try {
  //   values = LoginSchema.parse(data);
  //   console.log(values);
  // } catch (err) {
  //   console.log(err);
  //   return { error: (err as ZodError).errors[0].message };
  // }
  // const { email, password } = values;
  // console.log(email, password);
  // try {
  //   await signIn('credentials', {
  //     email,
  //     password,
  //     redirectTo: DEFAULT_LOGIN_REDIRECT,
  //   });
  // } catch (err) {
  //   let msg = '';
  //   if (err instanceof AuthError) {
  //     switch (err.type) {
  //       // no way currently of suppressing CredentialSignin console log
  //       case 'CredentialsSignin':
  //         msg = 'Invalid credentials.';
  //         break;
  //       default:
  //         msg = 'Something went wrong!';
  //     }
  //     return { error: msg };
  //   }
  //   // successful auth throws NEXT_REDIRECT which is an error??
  //   // therefore this line is necessary to redirect successful logins
  //   throw err;
  // }
  // return { success: 'Login successful!' };
};

export {
  changeAvatar,
  changeDisplayName,
  changeEmail,
  changePassword,
  deleteAccount,
  login,
  register,
};
