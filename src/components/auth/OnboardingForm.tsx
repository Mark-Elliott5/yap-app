'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

// import { Button } from '../ui/button';
import { onboarding } from '@/actions/actions';
import { OnboardingSchema } from '@/schemas';
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

  const handleOnboarding = async (data: FormData) => {
    setOnboardingTry(await onboarding(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={onboarding}
        onSubmit={({ formData }) => handleOnboarding(formData)}
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
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
                    required
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>Your permanent username.</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Yapper'
                    type='nickname'
                    autoComplete=''
                    minLength={0}
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
          <FormButton label='Save' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default OnboardingForm;
