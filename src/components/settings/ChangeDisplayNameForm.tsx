'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

import { changeDisplayName } from '@/actions/actions';
import { ChangeDisplayNameSchema } from '@/schemas';
import FormButton from '@/src/components/FormButton';
import FormError from '@/src/components/FormError';
import FormSuccess from '@/src/components/FormSuccess';
import {
  Form as FormProvider,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
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

  const handleChange = async (data: FormData) => {
    const response = await changeDisplayName(data);
    setChangeTry(response);
    if (response.success) {
      setUser((prev) => {
        const displayName = data.get('displayName') as string;
        return {
          ...prev,
          displayName,
        };
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Form
        action={changeDisplayName}
        onSubmit={({ formData }) => handleChange(formData)}
        className='margin-auto w-full self-center sm:w-5/6 md:w-2/3 lg:w-7/12'
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
            name='displayName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='yapper'
                    type='displayName'
                    minLength={1}
                    maxLength={32}
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
          <FormButton label='Save' />
        </div>
      </Form>
    </FormProvider>
  );
}

export default ChangeDisplayNameForm;
