'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import { deleteAccount } from '@/actions/actions';
import { DeleteAccountSchema } from '@/schemas';
import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
import {
  Form as FormProvider,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

function DeleteAccountForm() {
  const [changeTry, setChangeTry] = useState<
    | {
        error?: string;
        // success?: string;
      }
    | undefined
  >({});
  const form = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      username: '',
    },
  });
  const { isSubmitting } = form.formState;

  const handleChange = async (data: FormData) => {
    try {
      setChangeTry(await deleteAccount(data));
    } catch {
      return;
    }
  };

  return (
    <FormProvider {...form}>
      <Form
        action={deleteAccount}
        onSubmit={({ formData }) => handleChange(formData)}
        className='margin-auto w-full self-center sm:w-5/6 md:w-2/3 lg:w-7/12'
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delete Account</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper'
                    type='text'
                    minLength={1}
                    required
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Enter your username to confirm you want to delete your
                  account.{' '}
                  <span className='font-bold text-yap-red-500'>
                    This action is irreversible.
                  </span>
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-y-6'>
          {changeTry?.error && <FormError message={changeTry.error} />}
          <FormButton disabled={isSubmitting} variant='destructive'>
            {isSubmitting ? 'Deleting...' : 'Delete Account'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default DeleteAccountForm;
