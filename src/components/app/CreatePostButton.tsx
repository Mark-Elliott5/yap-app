'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { IoIosClose } from 'react-icons/io';
import { z } from 'zod';

import { createPost } from '@/actions/actions';
import { CreatePostSchema } from '@/schemas';
import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
import FormSuccess from '@/src/components/FormSuccess';
import { Button } from '@/src/components/ui/button';
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

function CreatePostButton() {
  const [postVisible, setPostVisible] = useState(false);
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

  return (
    <>
      <button
        className='w-unset p-0 text-left text-2xl text-zinc-950 dark:text-zinc-100'
        onClick={() => setPostVisible((prev) => !prev)}
      >
        Post
      </button>
      {postVisible && (
        <div
          className='fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-zinc-950/50'
          onClick={() => setPostVisible(false)}
        >
          <div className='rounded-lg bg-gradient-to-br from-yap-red-500 to-rose-700 p-[1px]'>
            <div
              className='flex w-[400px] flex-col gap-2 rounded-lg bg-zinc-100 px-8 py-6 shadow-md dark:bg-zinc-900'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-between'>
                <header className='text-3xl font-medium text-zinc-950 dark:text-zinc-100'>
                  Yap something!
                </header>
                <Button
                  variant='ghost'
                  className='p-1'
                  onClick={() => setPostVisible(false)}
                >
                  <IoIosClose
                    size='2rem'
                    className='text-zinc-950 dark:text-zinc-100'
                  />
                </Button>
              </div>
              <FormProvider {...form}>
                <Form
                  // action={createPost}
                  onSubmit={({ formData }) => handleChange(formData)}
                  className='margin-auto self-center'
                >
                  <div className='flex flex-col gap-2 pb-6'>
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
                      render={({
                        field: { value, onChange, ...fieldProps },
                      }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <Input
                              {...fieldProps}
                              placeholder='Image'
                              type='file'
                              accept='image/jpeg, image/png, image/jpg'
                              onChange={(event) =>
                                onChange(
                                  event.target.files && event.target.files[0]
                                )
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
                    {changeTry?.error && (
                      <FormError message={changeTry.error} />
                    )}
                    {changeTry?.success && (
                      <FormSuccess message={changeTry.success} />
                    )}
                    <FormButton disabled={isSubmitting}>
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </FormButton>
                  </div>
                </Form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatePostButton;
