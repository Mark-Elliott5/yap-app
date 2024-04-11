'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

// import { Button } from '../ui/button';
import { changeEmail } from '@/actions/actions';
import { ChangeEmailSchema } from '@/schemas';
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

function ChangeEmailForm() {
  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      email: '',
      confirmEmail: '',
    },
  });

  const handleChange = async (data: FormData) => {
    setChangeTry(await changeEmail(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={changeEmail}
        onSubmit={({ formData }) => handleChange(formData)}
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper@yap.com'
                    type='email'
                    minLength={1}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper@yap.com'
                    type='email'
                    minLength={1}
                    required
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
          <FormButton label='Save' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default ChangeEmailForm;
