'use client';

import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

// import { Button } from '../ui/button';
import { deleteAccount } from '@/actions/actions';
import { DeleteAccountSchema } from '@/schemas';
import FormButton from '@/src/components/FormButton';
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
  const form = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      username: '',
    },
  });

  const handleChange = async (data: FormData) => {
    await deleteAccount(data);
  };

  return (
    <FormProvider {...form}>
      <Form
        action={deleteAccount}
        onSubmit={({ formData }) => handleChange(formData)}
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper'
                    type='text'
                    minLength={1}
                    required
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Enter your username to confirm you want to delete your
                  account.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-y-6'>
          <FormButton label='Save' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default DeleteAccountForm;
