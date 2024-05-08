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
import FormButton from '@/src/components/yap/FormButton';
import FormError from '@/src/components/yap/FormError';
import FormSuccess from '@/src/components/yap/FormSuccess';
import { onboarding } from '@/src/lib/database/actions';
import { OnboardingSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function OnboardingForm() {
  const [onboardingTry, setOnboardingTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof OnboardingSchema>>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      username: '',
      displayName: '',
    },
  });
  const { isSubmitting } = form.formState;

  const handleOnboarding = async (data: FormData) => {
    setOnboardingTry(await onboarding(data));
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={({ formData }) => handleOnboarding(formData)}>
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            // control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yappy'
                    type='text'
                    autoComplete='username'
                    minLength={1}
                    maxLength={32}
                    required
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Your permanent username.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            // control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Yapper'
                    type='text'
                    autoComplete='username'
                    minLength={0}
                    maxLength={32}
                    className='placeholder:italic'
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  You can change this later. If one is not provided, your
                  username will be used instead.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-y-6'>
          {onboardingTry?.error && <FormError message={onboardingTry.error} />}
          {onboardingTry?.success && (
            <FormSuccess message={onboardingTry.success} />
          )}
          <FormButton disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default OnboardingForm;
