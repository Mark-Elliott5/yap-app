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
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

// import { Button } from '../ui/button';
import { register } from '../../../actions/actions';
import { RegisterSchema } from '../../../schemas';

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
      confirmPassword: '',
    },
  });

  const handleRegister = async (data: FormData) => {
    setRegistrationTry(await register(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={register}
        onSubmit={({ formData }) => handleRegister(formData)}
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
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='************'
                    type='password'
                    minLength={1}
                    maxLength={32}
                    required
                  />
                </FormControl>
                <FormMessage />
                {/* <FormDescription>You can change this later.</FormDescription> */}
              </FormItem>
            )}
          ></FormField>
        </div>
        <div className='flex flex-col gap-y-6'>
          {registerTry?.error && <FormError message={registerTry.error} />}
          {registerTry?.success && (
            <FormSuccess message={registerTry.success} />
          )}
          <FormButton label='Register' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default RegisterForm;
