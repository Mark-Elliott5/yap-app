import { z } from 'zod';
import { zfd } from 'zod-form-data';

const LoginSchema = zfd.formData({
  email: zfd.text(z.string().email()),
  password: zfd.text(
    z.string().min(1, {
      message: 'Password is required.',
    })
  ),
});

export default LoginSchema;
