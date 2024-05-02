import { useEffect, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import { createPost } from '@/actions/actions';
import { CreateReplySchema } from '@/schemas';
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
import { Yap } from '@prisma/client';

function ReplyPostForm({ id }: { id: Yap['id'] }) {
  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof CreateReplySchema>>({
    resolver: zodResolver(CreateReplySchema),
    defaultValues: {
      id,
    },
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
          <FormField
            // unnecessary when using FormProvider according to docs
            // control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input {...field} value={id} type='hidden' hidden />
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

export default ReplyPostForm;
