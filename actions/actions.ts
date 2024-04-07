'use server';

import bcrypt from 'bcrypt';
import { z } from 'zod';

import db from '@/lib/db';

import { getUserByEmail } from '../data-utils';
import { LoginSchema, RegisterSchema } from '../schemas';

const login = async (data: FormData | z.infer<typeof LoginSchema>) => {
  try {
    const values = LoginSchema.parse(data);
    console.log(values);
    return { success: 'Logged in!' };
  } catch (err) {
    console.log(err);
    // console.log({
    //   error: (err as ZodError).flatten((issue) => issue.message).fieldErrors,
    // });
    // return { error: (err as ZodError).errors[0].message };
    return { error: (err as Error).message };
  }
};

const register = async (data: FormData) => {
  try {
    const { email, password, username }: z.infer<typeof RegisterSchema> =
      RegisterSchema.parse(data);
    const user = await getUserByEmail(email);
    if (user) {
      throw new Error('Email already taken.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      email,
      password: hashedPassword,
      username,
    };
    await db.user.create({ data: userObj });
    console.log('User created: ' + username);
    return { success: 'Registration successful!' };
  } catch (err) {
    console.log(err);
    // console.log({
    //   error: (err as ZodError).flatten((issue) => issue.message).fieldErrors,
    // });
    return { error: (err as Error).message };
  }
};

export { login, register };
