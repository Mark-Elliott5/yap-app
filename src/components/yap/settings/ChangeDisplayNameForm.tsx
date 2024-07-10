'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

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
import FormSuccess from '@/src/components/yap/form/FormSuccess';
import { changeDisplayName } from '@/src/lib/database/actions';
import { ChangeDisplayNameSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function ChangeDisplayNameForm({
  setUser,
}: {
  setUser: Dispatch<
    SetStateAction<{
      displayName: string | null;
      image: string | null;
    }>
  >;
}) {
  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof ChangeDisplayNameSchema>>({
    resolver: zodResolver(ChangeDisplayNameSchema),
    defaultValues: {
      displayName: '',
    },
  });
  const { isSubmitting } = form.formState;

  const handleChange = async (data: FormData) => {
    const response = await changeDisplayName(data);
    setChangeTry(response);
    if (response.success) {
      setUser((prev) => {
        const displayName = data.get('displayName') as string | null;
        return {
          ...prev,
          displayName: displayName === 'undefined' ? null : displayName,
        };
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Form
        onSubmit={({ formData }) => handleChange(formData)}
        className='margin-auto self-center'
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            // control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper'
                    type='text'
                    minLength={0}
                    maxLength={32}
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
          <FormButton disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </FormButton>
        </div>
      </Form>
    </FormProvider>
  );
}

export default ChangeDisplayNameForm;
