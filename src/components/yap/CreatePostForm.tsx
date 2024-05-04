'use client';

import { useEffect, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createPost } from '@/actions/actions';
import { CreatePostSchema } from '@/schemas';
import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
import FormSuccess from '@/src/components/FormSuccess';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

function CreatePostForm() {
  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
  });
  const { isSubmitting } = form.formState;

  const handleChange = async (data: FormData) => {
    setChangeTry(await createPost(data));
  };

  useEffect(() => {
    if (changeTry.success) {
      const timeout = setTimeout(() => {
        setChangeTry({});
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [changeTry]);

  return (
    <FormProvider {...form}>
      <Form
        // action={createPost}
        onSubmit={({ formData }) => handleChange(formData)}
        className='h-dvh p-10'
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
                    maxLength={32}
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
          {changeTry?.error && <FormError message={changeTry.error} />}
          {changeTry?.success && <FormSuccess message={changeTry.success} />}
          <FormButton disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default CreatePostForm;
