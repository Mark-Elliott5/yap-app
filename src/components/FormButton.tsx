'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/src/components/ui/button';

function FormButton({
  label,
  variant,
}: {
  label: string;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      variant={variant}
      className='w-full'
      disabled={pending}
    >
      {label}
    </Button>
  );
}

export default FormButton;
