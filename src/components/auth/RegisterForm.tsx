'use client';

import { z } from 'zod';
import { RegisterSchema } from '../../../schemas';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
// import { Button } from '../ui/button';
import { register } from '../../../actions/actions';
import FormError from '../FormError';
import FormSuccess from '../FormSuccess';
import FormButton from './PendingButton';
import { useState } from 'react';

function RegisterForm() {
  const [registerTry, setRegistrationTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRegister = async (data: FormData) => {
    setRegistrationTry(await register(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={handleRegister}
        onSubmit={(e) => handleRegister(e.formData)}
        control={form.control}
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
          ></FormField>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='************'
                    type='password'
                    minLength={8}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Yapper'
                    type='text'
                    minLength={1}
                    maxLength={32}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className='flex flex-col gap-y-6'>
          {registerTry.error && <FormError message={registerTry.error} />}
          {registerTry.success && <FormSuccess message={registerTry.success} />}
          <FormButton label='Register' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default RegisterForm;
