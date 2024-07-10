'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import FormButton from '@/src/components/yap/form/buttons/FormButton';
import FormError from '@/src/components/yap/form/FormError';
import FormSuccess from '@/src/components/yap/form/FormSuccess';
import { changePassword } from '@/src/lib/database/actions';
import { ChangePasswordSchema } from '@/src/schemas';
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
        onSubmit={OAuth ? () => {} : ({ formData }) => handleChange(formData)}
        className='margin-auto self-center'
      >
        <fieldset disabled={OAuth}>
          <div className='flex flex-col gap-2 pb-6'>
            <FormField
              // control={form.control}
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
              // control={form.control}
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
              // control={form.control}
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
            {!OAuth && (
              <FormButton disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </FormButton>
            )}
          </div>
        </fieldset>
      </Form>
    </FormProvider>
  );
}

export default ChangePasswordForm;
