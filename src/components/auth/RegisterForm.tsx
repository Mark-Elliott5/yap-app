'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
// import FormSuccess from '@/src/components/FormSuccess';
import {
  Form as FormProvider,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { register } from '@/src/lib/database/actions';
import { RegisterSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function RegisterForm() {
  const [registerTry, setRegistrationTry] = useState<
    | {
        error?: string;
        // success?: string;
      }
    | undefined
  >({});
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { isSubmitting } = form.formState;

  const handleRegister = async (data: FormData) => {
    setRegistrationTry(await register(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={({ formData }) => handleRegister(formData)}
        // control={form.control}
      >
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
                    // autoComplete='new-password'
                    minLength={8}
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
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='************'
                    type='password'
                    // autoComplete='new-password'
                    minLength={1}
                    maxLength={32}
                    required
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
                {/* <FormDescription>You can change this later.</FormDescription> */}
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-y-6'>
          {registerTry?.error && <FormError message={registerTry.error} />}
          {/* {registerTry?.success && (
            <FormSuccess message={registerTry.success} />
          )} */}
          <FormButton disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default RegisterForm;
