import { z } from 'zod';
import { zfd } from 'zod-form-data';

const LoginSchema = zfd.formData({
  email: zfd.text(
    z.string().email().min(1, {
      message: 'Email is required.',
    })
  ),
  password: zfd.text(
    z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .max(64, {
        message: 'Password cannot be longer than 64 characters.',
      })
  ),
});

const ChangeEmailSchema = zfd.formData({
  email: zfd.text(
    z.string().email().min(1, {
      message: 'Email is required.',
    })
  ),
  confirmEmail: zfd.text(
    z.string().email().min(1, {
      message: 'Confirm Email is required.',
    })
  ),
});

const ChangeAvatarSchema = zfd.formData({
  avatar: zfd.file(
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((file) => file?.length == 1, 'File is required.')
  ),
});

const ChangePasswordSchema = zfd
  .formData({
    oldPassword: zfd.text(
      z
        .string()
        .email()
        .min(8, {
          message: 'Old password is required.',
        })
        .max(64, {
          message: 'Old password cannot be longer than 64 characters.',
        })
    ),
    newPassword: zfd.text(
      z
        .string()
        .min(8, {
          message: 'New password is required.',
        })
        .max(64, {
          message: 'New password cannot be longer than 64 characters.',
        })
    ),
    confirmPassword: zfd.text(
      z
        .string()
        .min(8, {
          message: 'Confirm new password is required.',
        })
        .max(64, {
          message: 'Confirm new password cannot be longer than 64 characters.',
        })
    ),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'The new passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

const ChangeDisplayNameSchema = zfd.formData({
  displayName: zfd.text(
    z
      .string()
      .min(1, {
        message: 'Display name is required.',
      })
      .max(32, {
        message: 'Display name cannot be longer than 32 characters.',
      })
  ),
});

const RegisterSchema = zfd
  .formData({
    email: zfd.text(
      z.string().email().min(1, {
        message: 'Email is required.',
      })
    ),
    password: zfd.text(
      z
        .string()
        .min(8, {
          message: 'Minimum password length is 8 characters.',
        })
        .max(64, {
          message: 'Password cannot be longer than 64 characters.',
        })
    ),
    confirmPassword: zfd.text(
      z
        .string()
        .min(8, {
          message: 'Minimum password length is 8 characters.',
        })
        .max(64, {
          message: 'Password cannot be longer than 64 characters.',
        })
    ),
    // username: zfd.text(
    //   z
    //     .string()
    //     .min(1, {
    //       message: 'Username is required.',
    //     })
    //     .max(32, {
    //       message: 'Username cannot be longer than 32 characters.',
    //     })
    // ),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match.',
        path: ['confirmPassword'],
      });
    }
  });

export {
  ChangeAvatarSchema,
  ChangeDisplayNameSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  LoginSchema,
  RegisterSchema,
};
