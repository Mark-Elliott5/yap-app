'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormButton from '@/components/auth/PendingButton';
import FormError from '@/components/FormError';
import FormSuccess from '@/components/FormSuccess';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

// import { Button } from '../ui/button';
import { login } from '../../../actions/actions';
import { LoginSchema } from '../../../schemas';

function LoginForm() {
  const [loginTry, setLoginTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: FormData) => {
    setLoginTry(await login(data));
  };

  return (
    <FormProvider {...form}>
      <Form action={login} onSubmit={({ formData }) => handleLogin(formData)}>
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
        </div>
        <div className='flex flex-col gap-y-6'>
          {loginTry?.error && <FormError message={loginTry.error} />}
          {loginTry?.success && <FormSuccess message={loginTry.success} />}
          <FormButton label='Log in' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default LoginForm;
