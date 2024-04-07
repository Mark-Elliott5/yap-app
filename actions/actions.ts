'use server';

import { ZodError, z } from 'zod';
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
    return { error: (err as ZodError).errors[0].message };
  }
};

const register = async (data: FormData) => {
  try {
    const values = RegisterSchema.parse(data);
    console.log(values);
    return { success: 'Registration successful!' };
  } catch (err) {
    console.log(err);
    // console.log({
    //   error: (err as ZodError).flatten((issue) => issue.message).fieldErrors,
    // });
    return { error: (err as ZodError).errors[0].message };
  }
};

export { login, register };
