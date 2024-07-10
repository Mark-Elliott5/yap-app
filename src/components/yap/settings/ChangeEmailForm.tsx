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
import { changeEmail } from '@/src/lib/database/actions';
import { ChangeEmailSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function ChangeEmailForm({ OAuth, email }: { OAuth: boolean; email: string }) {
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
  const { isSubmitting } = form.formState;

  const handleChange = async (data: FormData) => {
    setChangeTry(await changeEmail(data));
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={OAuth ? email : 'yapper@yap.com'}
                      type='email'
                      minLength={1}
                      required
                      disabled={OAuth}
                      className='placeholder:italic'
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Your current email is {email}.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              // control={form.control}
              name='confirmEmail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={OAuth ? email : 'yapper@yap.com'}
                      type='email'
                      minLength={1}
                      required
                      disabled={OAuth}
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

export default ChangeEmailForm;
