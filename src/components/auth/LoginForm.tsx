'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

// import FormSuccess from '@/src/components/FormSuccess';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import FormButton from '@/src/components/yap/form/buttons/FormButton';
import FormError from '@/src/components/yap/form/FormError';
import { login } from '@/src/lib/database/actions';
import { LoginSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const [loginTry, setLoginTry] = useState<
    | {
        error?: string;
        // success?: string;
      }
    | undefined
  >({});
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { isSubmitting } = form.formState;

  const handleLogin = async (data: FormData) => {
    setLoginTry(await login(data));
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={({ formData }) => handleLogin(formData)}>
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            // control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper@yap.com'
                    type='email'
                    autoComplete='email'
                    minLength={1}
                    required
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='************'
                    type='password'
                    autoComplete='current-password'
                    minLength={8}
                    required
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-y-6'>
          {loginTry?.error && <FormError message={loginTry.error} />}
          {/* {loginTry?.success && <FormSuccess message={loginTry.success} />} */}
          <FormButton disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default LoginForm;
