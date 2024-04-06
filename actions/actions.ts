'use server';

import { ZodError } from 'zod';
import LoginSchema from '../schemas';

const login = async (data: FormData) => {
  try {
    const values = LoginSchema.parse(data);
    console.log(values);
    return { success: 'Logged in!' };
  } catch (err) {
    console.log(err);
    return { error: (err as ZodError).errors[0].message };
  }
};

export { login };
