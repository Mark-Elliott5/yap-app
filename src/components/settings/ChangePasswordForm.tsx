'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import { changePassword } from '@/actions/actions';
import { ChangePasswordSchema } from '@/schemas';
import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
import FormSuccess from '@/src/components/FormSuccess';
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

function ChangePasswordForm({ OAuth }: { OAuth: boolean }) {
  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const { isSubmitting } = form.formState;

  const handleChange = async (data: FormData) => {
    setChangeTry(await changePassword(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={changePassword}
        onSubmit={({ formData }) => handleChange(formData)}
        className='margin-auto w-full self-center sm:w-5/6 md:w-2/3 lg:w-7/12'
      >
        <fieldset disabled={OAuth}>
          <div className='flex flex-col gap-2 pb-6'>
            <FormField
              control={form.control}
              name='oldPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='********'
                      type='password'
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
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='********'
                      type='password'
                      autoComplete='new-password'
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
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='********'
                      type='password'
                      minLength={1}
                      autoComplete='new-password'
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
            {changeTry?.error && <FormError message={changeTry.error} />}
            {changeTry?.success && <FormSuccess message={changeTry.success} />}
            {OAuth && (
              <FormDescription>
                OAuth accounts cannot change their email or password.
              </FormDescription>
            )}
            <FormButton disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </FormButton>
          </div>
        </fieldset>
      </Form>
    </FormProvider>
  );
}

export default ChangePasswordForm;
