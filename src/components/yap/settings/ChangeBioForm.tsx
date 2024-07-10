'use client';

import { useState } from 'react';
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
import { changeBio } from '@/src/lib/database/actions';
import { ChangeBioSchema } from '@/src/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

function ChangeBioForm() {
  const form = useForm<z.infer<typeof ChangeBioSchema>>({
    resolver: zodResolver(ChangeBioSchema),
    defaultValues: {
      bio: '',
    },
  });
  const { isSubmitting } = form.formState;

  const [changeTry, setChangeTry] = useState<{
    error?: string;
    success?: string;
  }>({});

  const handleChange = async (data: FormData) => {
    setChangeTry(await changeBio(data));
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
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='This is me!'
                    type='text'
                    minLength={0}
                    maxLength={300}
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

export default ChangeBioForm;
