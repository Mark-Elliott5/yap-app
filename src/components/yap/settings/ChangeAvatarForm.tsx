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
import { changeAvatar } from '@/src/lib/database/actions';
import { ChangeAvatarSchema } from '@/src/schemas';
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
  const { isSubmitting } = form.formState;

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
        // action={changeAvatar}
        onSubmit={({ formData }) => handleChange(formData)}
        className='margin-auto self-center'
      >
        <div className='flex flex-col gap-2 pb-6'>
          <FormField
            // unnecessary when using FormProvider according to docs
            // control={form.control}
            name='avatar'
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Picture</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    placeholder='Picture'
                    type='file'
                    accept='image/jpeg, image/png, image/jpg'
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                    className='text-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-950'
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
            {isSubmitting ? 'Uploading...' : 'Save'}
          </FormButton>
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
<button className='bg-zinc-100 p-10' type='submit'>
  SUBMIT
</button>
</form> */
// }

export default ChangeAvatarForm;
