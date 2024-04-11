'use client';

import { useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

// import { Button } from '../ui/button';
import { changeAvatar } from '@/actions/actions';
import { ChangeAvatarSchema } from '@/schemas';
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

function ChangeAvatarForm() {
  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});
  const form = useForm<z.infer<typeof ChangeAvatarSchema>>({
    resolver: zodResolver(ChangeAvatarSchema),
  });

  const fileRef = form.register('avatar');

  const handleChange = async (data: FormData) => {
    setChangeTry(await changeAvatar(data));
  };

  return (
    <FormProvider {...form}>
      <Form
        action={changeAvatar}
        onSubmit={({ formData }) => handleChange(formData)}
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
            name='avatar'
            render={() => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input {...fileRef} type='file' required />
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

export default ChangeAvatarForm;
