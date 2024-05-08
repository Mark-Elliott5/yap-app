'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { createPost } from '@/src/lib/database/actions';
import { CreatePostSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';

function CreatePostForm({ currentUser }: { currentUser: User['username'] }) {
  const [actionResponse, setActionResponse] = useState<{
    error?: string;
  }>({});
  const router = useRouter();
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = async (data: FormData) => {
    setSubmitting(true);
    const { postId, error } = await createPost(data);
    if (postId) return router.push(`/user/${currentUser}/post/${postId}`);
    if (error) {
      setActionResponse({ error });
      setSubmitting(true);
    }
  };

  return (
    <FormProvider {...form}>
      <Form
        // action={createPost}
        onSubmit={({ formData }) => handleChange(formData)}
        className='h-dvh rounded-lg bg-white p-10 shadow-xl dark:bg-zinc-900'
      >
        <div className='flex flex-col gap-2 pb-6'>
          <header className='text-3xl font-medium text-zinc-950 dark:text-zinc-100'>
            Yap something!
          </header>
          <FormField
            // control={form.control}
            name='text'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Yappity yap'
                    type='text'
                    minLength={0}
                    maxLength={144}
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // unnecessary when using FormProvider according to docs
            // control={form.control}
            name='image'
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder='Image'
                    type='file'
                    accept='image/jpeg, image/png, image/jpg'
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                    className='text-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-950'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-y-6'>
          {actionResponse?.error && (
            <FormError message={actionResponse.error} />
          )}
          <FormButton disabled={submitting}>
            {submitting ? 'Posting...' : 'Post'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default CreatePostForm;
