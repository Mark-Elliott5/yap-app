'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';

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

function ChangeAvatarForm({
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
  const form = useForm<z.infer<typeof ChangeAvatarSchema>>({
    resolver: zodResolver(ChangeAvatarSchema),
  });

  const handleChange = async (data: FormData) => {
    const response = await changeAvatar(data);
    setChangeTry(response);
    if (response.success) {
      setUser((prev) => {
        return {
          ...prev,
          image: response.url,
        };
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Form
        action={changeAvatar}
        onSubmit={({ formData }) => handleChange(formData)}
        className='margin-auto w-full self-center sm:w-5/6 md:w-2/3 lg:w-7/12'
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            control={form.control}
            name='avatar'
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Picture</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder='Picture'
                    type='file'
                    accept='image/*, application/pdf'
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                    className='text-black dark:text-white dark:placeholder:text-black'
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

// works:
// {
/* <form
action={changeAvatar}
onSubmit={(e) => handleChange(new FormData(e.currentTarget))}
>
<input type='file' name='avatar' id='avatar' />
<button className='bg-white p-10' type='submit'>
  SUBMIT
</button>
</form> */
// }

export default ChangeAvatarForm;
