import { z } from 'zod';
import { zfd } from 'zod-form-data';

const LoginSchema = zfd.formData({
  email: zfd.text(
    z.string().email().min(1, {
      message: 'Email is required.',
    })
  ),
  password: zfd.text(
    z.string().min(1, {
      message: 'Password is required.',
    })
  ),
});

const RegisterSchema = zfd.formData({
  email: zfd.text(
    z.string().email().min(1, {
      message: 'Email is required.',
    })
  ),
  password: zfd.text(
    z.string().min(8, {
      message: 'Minimum password length is 8 characters.',
    })
  ),
  username: zfd.text(
    z
      .string()
      .min(1, {
        message: 'Username is required.',
      })
      .max(32, {
        message: 'Username cannot be longer than 32 characters.',
      })
  ),
});

export { LoginSchema, RegisterSchema };
