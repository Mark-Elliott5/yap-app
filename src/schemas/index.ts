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

const ChangeEmailSchema = zfd
  .formData({
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
  })
  .superRefine(({ email, confirmEmail }, ctx) => {
    if (email !== confirmEmail) {
      ctx.addIssue({
        code: 'custom',
        message: 'The new emails do not match.',
        path: ['confirmEmail'],
      });
    }
  });

const ChangePasswordSchema = zfd
  .formData({
    oldPassword: zfd.text(
      z
        .string()
        .min(8, {
          message: 'Old password cannot be shorter than 8 characters.',
        })
        .max(64, {
          message: 'Old password cannot be longer than 64 characters.',
        })
    ),
    newPassword: zfd.text(
      z
        .string()
        .min(8, {
          message: 'New password cannot be shorter than 8 characters.',
        })
        .max(64, {
          message: 'New password cannot be longer than 64 characters.',
        })
    ),
    confirmPassword: zfd.text(
      z
        .string()
        .min(8, {
          message: 'Confirm new password cannot be shorter than 8 characters.',
        })
        .max(64, {
          message: 'Confirm new password cannot be longer than 64 characters.',
        })
    ),
  })
  .superRefine(({ oldPassword, newPassword, confirmPassword }, ctx) => {
    if (oldPassword === newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'New password is the same as the old password',
        path: ['newPassword'],
      });
    }
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
      .max(32, {
        message: 'Display name cannot be longer than 32 characters.',
      })
      .optional()
      .transform((val) => (val === '' ? undefined : val))
  ),
});

const ChangeBioSchema = zfd.formData({
  bio: zfd.text(
    z
      .string()
      .max(144, {
        message: 'Bio cannot be longer than 32 characters.',
      })
      .optional()
      .transform((val) => (val === '' ? undefined : val))
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
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match.',
        fatal: true,
        path: ['confirmPassword'],
      });
    }
  });

const OnboardingSchema = zfd.formData({
  username: zfd.text(
    z
      .string()
      .min(1, {
        message: 'Username is required.',
      })
      .max(32, {
        message: 'Username cannot be longer than 32 characters.',
      })
      .regex(/^[a-z0-9_.]+$/, {
        message:
          'Username can only contain lowercase alphanumeric characters, underscores, and periods.',
      })
  ),
  displayName: zfd.text(
    z
      .union([
        z
          .string()
          .max(32, 'Display names cannot be more than 32 characters long.'),
        z.string().length(0),
      ])
      .optional()
      .transform((val) => (val === '' || val === 'undefined' ? undefined : val))
  ),
});

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const ChangeAvatarSchema = zfd.formData({
  avatar: zfd.file(
    z
      .instanceof(File, { message: 'Please add an image file.' })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: `Image size must be less than 5MB.`,
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only .jpg, .jpeg, and .png files are accepted.',
      })
  ),
});

const DeleteAccountSchema = zfd.formData({
  username: zfd.text(
    z
      .string()
      .min(1, {
        message: 'Username is required.',
      })
      .max(32, {
        message: 'Username cannot be longer than 32 characters.',
      })
      .regex(/^[a-z0-9_.]+$/, {
        message:
          'Username can only contain lowercase alphanumeric characters, underscores, and periods.',
      })
  ),
});

const CreatePostSchema = zfd
  .formData({
    text: zfd.text(
      z
        .string()
        .max(144, {
          message: 'Content cannot be longer than 32 characters.',
        })
        .optional()
        .transform((val) =>
          val === '' || val === 'undefined' ? undefined : val
        )
    ),
    image: zfd
      .file(z.instanceof(File, { message: 'Please add an image file.' }))
      .refine((file) => file && file.size <= MAX_FILE_SIZE, {
        message: `Image size must be less than 5MB.`,
      })
      .refine((file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only .jpg, .jpeg, .png and .webp files are accepted.',
      })
      .optional()
      .or(z.string().refine((val) => (val === '' ? undefined : val))),
  })
  .superRefine(({ text, image }, ctx) => {
    if (!text && !image) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please add text or an image to make a post.',
        path: ['text'],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'Please add text or an image to make a post.',
        path: ['image'],
      });
    }
  });

const CreateReplySchema = zfd
  .formData({
    id: zfd.text(z.string()),
    text: zfd.text(
      z
        .string()
        .max(144, {
          message: 'Content cannot be longer than 32 characters.',
        })
        .optional()
        .transform((val) =>
          val === '' || val === 'undefined' ? undefined : val
        )
    ),
    image: zfd
      .file(z.instanceof(File, { message: 'Please add an image file.' }))
      .refine((file) => file && file.size <= MAX_FILE_SIZE, {
        message: `Image size must be less than 5MB.`,
      })
      .refine((file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only .jpg, .jpeg, .png and .webp files are accepted.',
      })
      .optional()
      .or(z.string().refine((val) => (val === '' ? undefined : val))),
  })
  .superRefine(({ text, image }, ctx) => {
    if (!text && !image) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please add text or an image to make a post.',
        path: ['text'],
      });
      ctx.addIssue({
        code: 'custom',
        message: 'Please add text or an image to make a post.',
        path: ['image'],
      });
    }
  });

const AddHeartSchema = zfd.formData({
  id: zfd.text(z.string().min(1, 'ID is required.')),
  state: zfd.numeric(
    z
      .number()
      .int()
      .min(0, { message: 'State must be 0 or 1.' })
      .max(1, { message: 'State must be 0 or 1.' })
  ),
});

const AddEchoSchema = zfd.formData({
  id: zfd.text(z.string().min(1, 'ID is required.')),
});

export {
  AddEchoSchema,
  AddHeartSchema,
  ChangeAvatarSchema,
  ChangeBioSchema,
  ChangeDisplayNameSchema,
  ChangeEmailSchema,
  ChangePasswordSchema,
  CreatePostSchema,
  CreateReplySchema,
  DeleteAccountSchema,
  LoginSchema,
  OnboardingSchema,
  RegisterSchema,
};
