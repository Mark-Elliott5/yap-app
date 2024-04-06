'use server';

import { z } from 'zod';
import LoginSchema from '../schemas';

const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values);
};

export { login };
